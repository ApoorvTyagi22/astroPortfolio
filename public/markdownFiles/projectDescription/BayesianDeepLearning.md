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

In this project the variational approximation is realised through **Monte Carlo Dropout**: Gal & Ghahramani (2016) showed that training a network with dropout is equivalent to variational inference with a Bernoulli approximate posterior over the weights, and that the KL-to-prior term corresponds to weight decay. This gives the probabilistic grounding of a BNN with the training stability of a standard network.

## Decomposing Uncertainty

Uncertainty in predictions arises from two distinct sources:

1. **Aleatoric Uncertainty (Data Uncertainty):** Arises from inherent noise in the observations (e.g., sensor noise, poor image quality, ambiguous pathologies). It cannot be reduced by collecting more training data. We capture this by training the network to directly predict the variance of its outputs ($\sigma^2$) using a Heteroscedastic Loss function.
2. **Epistemic Uncertainty (Model Uncertainty):** Arises from a lack of knowledge about the best model parameters, often due to sparse training data in certain regions of the feature space. This _can_ be reduced with more data. We capture this using **Monte Carlo (MC) Dropout** at inference time, measuring the variance in predictions across multiple stochastic forward passes.

# Implementation / Methodology

## Data Pipeline

The model trains on the **Kermany et al. OCT2017 dataset** — a public collection of ~84,000 real optical coherence tomography scans — mapped to a clinically meaningful 3-class AMD staging problem: NORMAL → _normal_, DRUSEN → _early AMD_ (drusen deposits are the hallmark of early AMD), and CNV → _late AMD_ (choroidal neovascularisation, i.e. wet AMD). The DME class is excluded as it is a diabetic pathology rather than an AMD stage. For development without Kaggle credentials, the pipeline falls back to a small synthetic dataset used strictly for smoke-testing.

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

| Component     | Implementation                                                  |
| :------------ | :-------------------------------------------------------------- |
| **Backbone**  | Pretrained `vit_small_patch16_224` (timm formulation)           |
| **Epistemic** | MC Dropout applied to extracted ViT features                    |
| **Aleatoric** | Heteroscedastic head: per-class logit means and log-variances   |
| **Outputs**   | 3 Predictive Means ($\mu$), 3 Predictive Variances ($\sigma^2$) |

The log-variance head is clamped and initialised near a small constant variance, so early training is dominated by the mean head. This is standard practice for heteroscedastic models and keeps the variance head from destabilising the network before the mean head has learned anything. Weight-space regularisation (the KL term of the ELBO) is applied as AdamW weight decay.

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

During evaluation, passing an image through the network $T$ times with dropout re-enabled yields a distribution of predictions. The mean of the softmax outputs is the prediction; their variance across passes is the epistemic uncertainty; the mean predicted $\sigma^2$ is the aleatoric uncertainty. Any non-finite output raises an error immediately rather than being silently masked, so a diverged model cannot be mistaken for a confident one.

# Analysis

The model was trained for 5 epochs on 12,000 scans, 4,000 from each class, on an Apple M3. Evaluation uses the held-out OCT2017 test split with 20 MC Dropout passes per image.

## Classification

| Class                | Precision |    Recall | Support |
| :------------------- | --------: | --------: | ------: |
| normal               |      1.00 |      1.00 |     242 |
| early_amd            |      0.99 |      1.00 |     242 |
| late_amd             |      1.00 |      0.99 |     242 |
| **Overall accuracy** |           | **99.6%** |     726 |

All three classes are classified well. Per-class recall matters more than the headline number here, because a model that labelled every scan with the most common class could still post a respectable overall accuracy while being useless in a clinic.

One caveat worth stating. Accuracy on a held-out slice of the training data was 94.8%, lower than the 99.6% on the official test split. The test split is small and was curated by expert graders, so it is cleaner than the training distribution. The 94.8% figure is the more honest estimate of real-world performance.

## Uncertainty Decomposition

| Regime              | Accuracy | Aleatoric | Epistemic | Mean confidence |
| :------------------ | -------: | --------: | --------: | --------------: |
| Clean OCT scans     |    99.6% |  4.29e-03 |  3.85e-05 |           0.997 |
| Corrupted OCT scans |    33.5% |  1.88e-02 |  1.58e-02 |           0.676 |
| CIFAR-10 (OOD)      |      n/a |  1.10e-01 |  7.41e-03 |           0.840 |

Both types of uncertainty behave as the theory says they should. Aleatoric uncertainty rises as the input gets harder to read: 4 times higher on corrupted scans and 26 times higher on natural images. Epistemic uncertainty rises when the input moves away from what the model was trained on: 410 times higher on corrupted scans and 192 times higher on CIFAR-10.

The values for the two types are on different scales, so they should only be compared down a column, not across a row.

One result looks backwards at first. Epistemic uncertainty is higher on corrupted OCT scans than on CIFAR-10, even though CIFAR-10 is further from the training data. The reason is that corrupted scans land near the boundary between the three classes the model knows, so different dropout masks genuinely disagree about which class it is. CIFAR-10 images land so far outside the training distribution that the features collapse into one region and the masks agree with each other on a meaningless answer. Near-boundary inputs produce more model disagreement than far-away inputs.

## Calibration

The Expected Calibration Error on the clean test set is **0.0026**, meaning predicted confidence matches actual accuracy to within about a quarter of a percentage point.

This number is only meaningful alongside accuracy. A model that always predicts 33% confidence and is right 33% of the time is perfectly calibrated and completely useless. Calibration is a claim about honesty, not skill, so it needs an accuracy figure next to it to mean anything.

## Out-of-Distribution Detection

Using epistemic uncertainty as the detection score, the model separates OCT scans from CIFAR-10 images with an **AUROC of 0.9871**. Pick one scan and one natural image at random, and 98.7% of the time the natural image gets the higher uncertainty.

This is the result the project was built to test, and it is best read against the confidence column above. On the same CIFAR-10 images, softmax confidence averages **0.840**. The network is 84% sure about pictures of dogs and aeroplanes. If you trust the softmax output, you deploy a model that is confidently wrong on inputs it has never seen. If you look at epistemic uncertainty instead, the same model flags almost all of those inputs correctly.

Two signals, one model, the same images: one useless, one reliable. That is the argument for decomposing uncertainty rather than reading confidence off the softmax.

## Limitations

The corruption applied to the shifted test set is severe. Accuracy falls to 33.5%, which is chance on three balanced classes, so this set is closer to a second out-of-distribution regime than to a realistic low-quality clinic scan. A graded sweep of corruption severities would show how uncertainty grows with degradation, rather than only showing the extreme.

The OCT2017 dataset also groups multiple scans per patient, and near-perfect test scores are commonly reported on it. A patient-level split would give a stricter estimate of generalisation.

# Conclusion

This project implements a complete framework for uncertainty-aware medical diagnostics: a ViT fine-tuned on real OCT scans with a heteroscedastic head for aleatoric uncertainty and MC Dropout for epistemic uncertainty. The trained model reaches 99.6% accuracy on the test split with an ECE of 0.0026, and detects out-of-distribution inputs with an AUROC of 0.9871 using epistemic uncertainty alone, on the same images where softmax confidence stays at 0.840 and gives no warning at all.

The pipeline is also built to fail loudly. Per-class recall is reported every epoch, non-finite outputs raise an error instead of being sanitised, and calibration is never read without the accuracy beside it. In a clinical setting the difference between a model that is wrong and a model that is _silently_ wrong is the whole point, so these guardrails matter as much as the Bayesian machinery itself.

As the NHS digitises to manage immense backlogs, completely autonomous AI is often deemed too risky for frontline diagnostics. The uncertainty-aware approach bridges the gap: it allows safe automation of routine scans while reliably escalating ambiguous or anomalous cases to human specialists. Future work: scaling to higher-resolution scans, temperature scaling on top of the Bayesian estimates, and integrating uncertainty-aware thresholds directly into triage routing.
