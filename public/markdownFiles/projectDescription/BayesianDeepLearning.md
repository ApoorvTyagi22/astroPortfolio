---
title: "Uncertainty-Aware Medical Diagnostics with Bayesian Deep Learning"
subtitle: "Decomposing aleatoric and epistemic uncertainty in Vision Transformers for trustworthy Age-Related Macular Degeneration (AMD) detection."
date: "29 Mar 2026"
---

## Note

The code for this project can be found on [GitHub](https://github.com/ApoorvTyagi22/BayesianDeepLearning). The code is fully documented. Some images may take a while to load on this webpage.

# Introduction

This post describes a Trustworthy Machine Learning approach to medical image diagnostics, built using Bayesian Deep Learning. Designed with clinical triage settings like the **UK's National Health Service (NHS)** in mind, the system processes Optical Coherence Tomography (OCT) scans to classify Age-Related Macular Degeneration (AMD) while simultaneously estimating its own uncertainty.

With an ageing UK population, ophthalmology clinics—particularly major centres like Moorfields Eye Hospital—are facing unprecedented backlogs. Automating scan triage is essential, but clinical adoption requires systems that know when they don't know. The model quantifies both the uncertainty inherent in the scan (e.g. poor image quality) and its own internal doubt: if a scan is flagged as highly uncertain, it can be routed to a human consultant instead of receiving a confidently wrong automated diagnosis.

The model uses a Vision Transformer (ViT) backbone pretrained on ImageNet, fine-tuned on real retinal OCT scans mapped to a 3-stage AMD problem (normal, early AMD, late AMD). By explicitly decoupling uncertainty into **aleatoric** (data noise) and **epistemic** (model ignorance) components, the system addresses the notorious "overconfidence" issue common in standard deep neural networks operating on out-of-distribution (OOD) medical data.

# Background

## The Overconfidence Problem in Deep Learning

Standard neural networks represent weights as single point estimates. When presented with anomalous data or images fundamentally different from their training distribution (Out-of-Distribution or OOD), standard models often produce high-confidence softmax outputs. This occurs because softmax simply squashes arbitrary logits into a `[0, 1]` distribution without measuring true predictive confidence.

## Bayesian Neural Networks (BNNs)

A Bayesian Neural Network treats its weights $w$ not as fixed values, but as probability distributions $P(w)$. Instead of finding a single optimal set of weights, learning involves finding the posterior distribution of the weights given the training data $P(w|D)$. Because calculating the exact posterior is computationally intractable for deep networks, we use **Variational Inference (VI)** to approximate it using a simpler distribution $q_\theta(w)$.

The network is trained by maximising the Evidence Lower Bound (ELBO), which balances the data likelihood against the Kullback-Leibler (KL) divergence between the approximate posterior and a prior distribution $P(w)$:

$$
\text{Loss} = -\mathbb{E}_{q_\theta(w)} [\log P(D|w)] + \text{KL}(q_\theta(w) || P(w))
$$

In this project the variational approximation is realised through **Monte Carlo Dropout**: Gal & Ghahramani (2016) showed that training a network with dropout is equivalent to variational inference with a Bernoulli approximate posterior over the weights, and that the KL-to-prior term corresponds to weight decay. This gives the probabilistic grounding of a BNN with the training stability of a standard network — an earlier version of this project used explicit stochastic-weight layers and learned the hard way why that trade-off matters (see *Lessons from a Failed First Version* below).

## Decomposing Uncertainty

Uncertainty in predictions arises from two distinct sources:

1. **Aleatoric Uncertainty (Data Uncertainty):** Arises from inherent noise in the observations (e.g., sensor noise, poor image quality, ambiguous pathologies). It cannot be reduced by collecting more training data. We capture this by training the network to directly predict the variance of its outputs ($\sigma^2$) using a Heteroscedastic Loss function.
2. **Epistemic Uncertainty (Model Uncertainty):** Arises from a lack of knowledge about the best model parameters, often due to sparse training data in certain regions of the feature space. This _can_ be reduced with more data. We capture this using **Monte Carlo (MC) Dropout** at inference time, measuring the variance in predictions across multiple stochastic forward passes.

# Implementation / Methodology

## Data Pipeline

The model trains on the **Kermany et al. OCT2017 dataset** — a public collection of ~84,000 real optical coherence tomography scans — mapped to a clinically meaningful 3-class AMD staging problem: NORMAL → *normal*, DRUSEN → *early AMD* (drusen deposits are the hallmark of early AMD), and CNV → *late AMD* (choroidal neovascularisation, i.e. wet AMD). The DME class is excluded as it is a diabetic pathology rather than an AMD stage. For development without Kaggle credentials, the pipeline falls back to a small synthetic dataset used strictly for smoke-testing.

To rigorously test uncertainty quantification, the model is evaluated across three distinct regimes:

- **Standard Test Set:** Clean OCT scans (normal, early AMD, late AMD) from the held-out test split.
- **Shifted (Noisy) Test Set:** The standard test set aggressively corrupted with random rotations and severe Gaussian noise. This simulates low-quality clinic sensors and tests the model's **Aleatoric Uncertainty**.
- **Out-of-Distribution (OOD):** CIFAR-10 natural images (e.g., aeroplanes, dogs), which the model has never seen and which contain no AMD pathology. This tests **Epistemic Uncertainty**—verifying that the model registers high doubt when fundamentally confused.

```python
# Shifted transforms for evaluating OOD / Aleatoric uncertainty
shifted_transform = transforms.Compose([
    transforms.Resize((IMG_SIZE, IMG_SIZE)),
    transforms.RandomRotation(90),
    transforms.ToTensor(),
    AddGaussianNoise(0., 0.5),
    transforms.Normalize(...)
])
```

## Architecture

| Component          | Implementation                                                  |
| :----------------- | :-------------------------------------------------------------- |
| **Backbone**       | Pretrained `vit_small_patch16_224` (timm formulation)           |
| **Epistemic**      | MC Dropout applied to extracted ViT features                    |
| **Aleatoric**      | Heteroscedastic head: per-class logit means and log-variances   |
| **Outputs**        | 3 Predictive Means ($\mu$), 3 Predictive Variances ($\sigma^2$) |

The log-variance head is clamped and initialised near a small constant variance, so early training is dominated by the mean head — standard practice for heteroscedastic models, and one of the stability fixes from the first version. Weight-space regularisation (the KL term of the ELBO) is applied as AdamW weight decay.

### Heteroscedastic Classification Loss

To train the aleatoric variance head, we use the heteroscedastic classification loss of Kendall & Gal (2017). Rather than computing cross-entropy on deterministic logits, we treat the predicted logits as a Gaussian distribution $\mathcal{N}(\mu, \sigma^2)$ and approximate the expected cross-entropy using Monte Carlo sampling via the reparameterization trick:

```python
# Reparameterization: z = mu + sigma * epsilon
expected_loss = 0.0
for _ in range(num_samples):
    epsilon = torch.randn_like(pred_mu)
    sampled_logits = pred_mu + std * epsilon
    expected_loss += cross_entropy(sampled_logits, target)
loss = expected_loss / num_samples
```

The intuition: on ambiguous inputs, the model can lower its expected loss by raising the predicted variance — so the variance head learns to flag exactly the scans a clinician would want escalated.

## MC Dropout Inference

During evaluation, passing an image through the network $T$ times with dropout re-enabled yields a distribution of predictions. The mean of the softmax outputs is the prediction; their variance across passes is the epistemic uncertainty; the mean predicted $\sigma^2$ is the aleatoric uncertainty. Any non-finite output raises an error immediately rather than being silently masked — a direct lesson from debugging the first version.

# Lessons from a Failed First Version

The first iteration of this project produced a results table that looked superficially plausible — until you read it carefully: identical accuracy on clean and corrupted data, confidence of exactly 0.333 everywhere, epistemic uncertainty of exactly zero, and OOD detection AUROC of 0.5 (a coin flip). Three compounding bugs caused this, and each is a useful cautionary tale:

1. **The data was never real.** The Kaggle download pointed at a placeholder dataset slug, so every run silently fell back to synthetic noise images. Lesson: make fallback paths loud, and check *what* you trained on before believing *how well* you trained.
2. **The regulariser ate the network.** The "KL divergence proxy" summed the L2 norm of **all** parameters — including the 22M-parameter pretrained backbone — into the loss. The optimiser dutifully shrank the backbone toward zero, collapsing every prediction to uniform. Lesson: regularise in the optimizer (AdamW weight decay), and never L2-penalise pretrained weights toward zero.
3. **`nan_to_num` hid the crime scene.** Non-finite logits were being replaced with 0.0 at inference, which turned a diverged model into a uniform predictor with *exactly zero* variance across MC passes — hence the "perfect" ECE and the zero epistemic uncertainty. Lesson: never sanitise model outputs silently; fail loudly.

A model that predicts uniformly has trivially low calibration error — which is why ECE should never be read without the accompanying accuracy and per-class recall. The retrained model's per-class recall is now monitored every epoch precisely to catch this failure mode.

# Analysis

*Results from the full training run on OCT2017 are being finalised and this section will be updated with the converged model's metrics: per-class recall, ECE with reliability diagram, uncertainty decomposition across the three regimes, and OOD-detection AUROC. The hypothesis under test: aleatoric uncertainty should rise on the corrupted test set, epistemic uncertainty should rise on CIFAR-10, and epistemic uncertainty alone should separate in-distribution from OOD inputs with AUROC well above 0.5.*

# Conclusion

This project implements a complete framework for uncertainty-aware medical diagnostics: a ViT fine-tuned on real OCT scans with a heteroscedastic head for aleatoric uncertainty and MC Dropout for epistemic uncertainty, evaluated for calibration (ECE), OOD detection (AUROC), and robustness under severe data shift.

Just as importantly, it documents a complete failure-and-recovery cycle. The first version collapsed silently, and the metrics that exposed it — per-class recall, exact-zero variances, coin-flip AUROC — are now built into the training loop as guardrails. In a clinical setting, the difference between a model that is wrong and a model that is *silently* wrong is the whole ballgame; building systems that fail loudly is as much a part of trustworthy ML as the Bayesian machinery itself.

As the NHS digitises to manage immense backlogs, completely autonomous AI is often deemed too risky for frontline diagnostics. The uncertainty-aware approach bridges the gap: it allows safe automation of routine scans while reliably escalating ambiguous or anomalous cases to human specialists. Future work: scaling to higher-resolution scans, temperature scaling on top of the Bayesian estimates, and integrating uncertainty-aware thresholds directly into triage routing.
