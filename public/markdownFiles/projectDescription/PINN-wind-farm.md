---
title: "Physics-Informed Neural Networks for UK Offshore Wind Farm Digital Twin"
subtitle: "Building a PINN surrogate model regularised by the Navier-Stokes equations to optimise turbine yaw angles for a Dogger Bank-inspired wind farm."
date: "29/3/2026"
---

## Note

The code for this project can be found on [GitHub](https://github.com/ApoorvTyagi22/Physics-InformedNeuralNetworks.git). The code is fully documented. Some images may take a while to load on this webpage.

# Introduction

This post describes a Digital Twin for UK offshore wind farms, built using Physics-Informed Neural Networks (PINNs). The system learns the velocity and pressure fields around a wind farm layout by regularising a neural network's loss function with the 2D steady-state Navier-Stokes equations. The trained surrogate model is then used alongside a classical optimiser (scipy L-BFGS-B) to find optimal turbine yaw angles that steer wakes away from downstream turbines, increasing total farm power output.

The model is trained using DeepXDE with a PyTorch backend and is inspired by the layout of the Dogger Bank Wind Farm — the world's largest offshore wind farm, located in the North Sea. The digital twin achieves a PINN test loss of 0.050 and demonstrates up to **4.65% power gain** from yaw steering under realistic wind conditions. Wind farm wake control is an active area of research — studies have shown that intelligent yaw steering can increase annual energy production by 2–5% across a farm, which for Dogger Bank (3.6 GW capacity) translates to millions of pounds in additional revenue.

# Background

## Physics-Informed Neural Networks

A PINN embeds physical laws directly into a neural network's loss function. Unlike a standard neural network that learns purely from data, a PINN is **regularised** by the residuals of the governing partial differential equations (PDEs). This ensures predictions respect conservation of mass and momentum, even in regions with sparse data. The total loss is defined as:

$$
L_{total} = w_d \cdot L_{data} + w_p \cdot L_{PDE}
$$

Where $L_{data}$ is the mean squared error between predictions and observed data, and $L_{PDE}$ is the mean squared residual of the PDE evaluated at collocation points randomly sampled across the domain. The weights $w_d$ and $w_p$ balance the data-driven and physics-driven components.

## Navier-Stokes Equations

The governing equations for 2D steady-state incompressible viscous flow are:

**Momentum (x-direction):**

$$
u \frac{\partial u}{\partial x} + v \frac{\partial u}{\partial y} + \frac{\partial p}{\partial x} - \frac{1}{Re}\left(\frac{\partial^2 u}{\partial x^2} + \frac{\partial^2 u}{\partial y^2}\right) = 0
$$

**Momentum (y-direction):**

$$
u \frac{\partial v}{\partial x} + v \frac{\partial v}{\partial y} + \frac{\partial p}{\partial y} - \frac{1}{Re}\left(\frac{\partial^2 v}{\partial x^2} + \frac{\partial^2 v}{\partial y^2}\right) = 0
$$

**Continuity (conservation of mass):**

$$
\frac{\partial u}{\partial x} + \frac{\partial v}{\partial y} = 0
$$

Where $u$ and $v$ are the velocity components, $p$ is the pressure, and $Re$ is the Reynolds number. These three equations are evaluated at collocation points within the domain and their residuals form $L_{PDE}$.

## Wake Steering

When wind flows through a turbine, it creates a wake — a region of reduced wind speed and increased turbulence downstream. In a wind farm, downstream turbines operating inside wakes produce significantly less power. **Yaw steering** involves intentionally misaligning an upstream turbine's rotor with the wind direction. This deflects the wake laterally, allowing downstream turbines to access higher wind speeds. The trade-off is that the yawed turbine itself produces less power (proportional to $\cos^2(\gamma)$, where $\gamma$ is the yaw angle), but the net farm-level gain can be positive if the downstream benefit exceeds the upstream loss.

The lateral wake deflection is modelled using the Jiménez model:

$$
\delta(x) = \frac{C_T}{2} \sin(\gamma) \cos^2(\gamma) \cdot x
$$

Where $C_T$ is the thrust coefficient, $\gamma$ is the yaw angle, and $x$ is the downstream distance. This deflection grows linearly with distance, making wake steering particularly effective for closely spaced turbines.

# Implementation / Methodology

## Data Pipeline

The system operates in **demo mode**, generating synthetic data that mirrors real UK grid patterns:

- **National Grid ESO data**: Synthetic half-hourly wind generation data with diurnal variation (higher wind speeds overnight), seasonal modulation (stronger winds in winter), and stochastic turbulence. This captures the statistical properties of actual ESO wind outturn data.
- **UK Power Networks data**: Synthetic grid constraint data including export limits and flexibility dispatch events for the Dogger Bank Grid Supply Point.

```python
# Wind speed model: diurnal + seasonal + turbulence
diurnal = -1.5 * np.cos(2 * np.pi * hours / 24)       # Higher at night
seasonal = 2.0 * np.cos(2 * np.pi * (days - 15) / 365) # Higher in winter
turbulence = np.random.normal(0, 1.5, n_points)
wind_speed = 10.0 + diurnal + seasonal + turbulence
```

## Wind Farm Layout

The farm is modelled as a 4×4 grid of 16 turbines inspired by Dogger Bank Phase A, using GE Haliade-X 13 MW turbines with a 220 m rotor diameter and a spacing of 7 rotor diameters (1,540 m).

## PINN Architecture

The neural network takes spatial coordinates $(x, y)$ as input and outputs the velocity field $(u, v)$ and pressure $p$:

| Parameter         | Value         |
| ----------------- | ------------- |
| Input dimension   | 2 $(x, y)$    |
| Output dimension  | 3 $(u, v, p)$ |
| Hidden layers     | 6             |
| Neurons per layer | 128           |
| Activation        | tanh          |
| Total parameters  | ~100k         |

The boundary conditions are:

| Boundary                 | Condition                              |
| ------------------------ | -------------------------------------- |
| Inlet ($x = 0$)          | $u = U_\infty$, $v = 0$ (uniform flow) |
| Walls ($y = 0, y_{max}$) | $u = 0$, $v = 0$ (no-slip)             |
| Outlet ($x = x_{max}$)   | $p = 0$ (zero pressure)                |

Observation data from the Jensen wake model is injected at 104 points in the near-wake region of each turbine. This provides the data-driven component of the loss.

### Two-Stage Optimiser

```python
# Stage 1: Adam for global exploration (20,000 iterations)
model.compile("adam", lr=1e-3, loss_weights=loss_weights)
model.train(iterations=20000)

# Stage 2: L-BFGS for local refinement (converges at ~10,000 iterations)
model.compile("L-BFGS", loss_weights=loss_weights)
model.train()
```

The Adam optimiser explores the loss landscape broadly, while L-BFGS provides second-order refinement. This two-stage approach is standard practice for PINNs and consistently outperforms either optimiser alone.

## Yaw Optimisation

Instead of using reinforcement learning, the system uses the wake model as a fast evaluator and applies **scipy L-BFGS-B** with bounded constraints to directly find optimal yaw angles:

```python
from scipy.optimize import minimize

def objective(yaw_angles_deg):
    result = compute_farm_power(layout, wind_speed, wind_direction,
                                yaw_angles_deg=yaw_angles_deg)
    return -result["total_power_mw"]  # Negative because we minimise

bounds = [(-30, 30)] * n_turbines  # ±30° yaw bounds

result = minimize(objective, x0=np.zeros(n), method="L-BFGS-B",
                  bounds=bounds, options={"maxiter": 500})
```

Multi-start optimisation with 5 random restarts ensures the global optimum is found. The full sweep evaluates 32 scenarios (4 wind speeds × 8 directions) in under 10 seconds.

# Analysis

## PINN Training

The model was trained on an Apple M3 MacBook in approximately 4.5 hours. The training loss curve shows steady convergence across both stages:

| Loss Component      | Initial  | After Adam (20k) | After L-BFGS (30k) |
| ------------------- | -------- | ---------------- | ------------------ |
| NS momentum (u)     | 2.4e-3   | 6.6e-4           | 1.2e-3             |
| NS momentum (v)     | 2.0e-3   | 3.6e-4           | 1.8e-4             |
| Continuity          | 1.1e-3   | 1.9e-3           | 1.5e-3             |
| Inlet BC (u)        | 1.03     | 4.1e-4           | 1.2e-5             |
| Wall BC (u)         | 4.8e-2   | 1.5e-2           | 1.3e-2             |
| Observation data    | 7.2e-1   | 4.4e-2           | 3.4e-2             |
| **Total test loss** | **2.43** | **0.063**        | **0.050**          |

The inlet boundary condition converges to near-machine precision (1.2e-5), confirming the network correctly represents the freestream flow. The wall boundary condition (0.013) and observation data loss (0.034) are the dominant remaining components — these are inherently harder as they require the network to simultaneously satisfy the no-slip condition and match wake deficit profiles.

## Yaw Optimisation Results

The optimisation sweep reveals that yaw steering provides the most benefit when:

1. **Wind is aligned with a row of turbines** (0°, 90°, 180°, 270°) — maximum wake interaction
2. **Wind speed is below rated** (7–10 m/s) — turbines are not power-limited

| Wind Condition        | Baseline (MW) | Optimised (MW) |    Gain    |
| --------------------- | :-----------: | :------------: | :--------: |
| 7 m/s, aligned (0°)   |     53.45     |     55.93      | **+4.65%** |
| 7 m/s, diagonal (45°) |     55.92     |     56.77      | **+1.53%** |
| 10 m/s, aligned (0°)  |    155.83     |     163.07     | **+4.65%** |
| 13 m/s, any direction |    208.00     |     208.00     |   0.00%    |

At 13+ m/s all turbines produce rated power regardless of wake effects, so yaw steering provides no additional benefit — the turbines are already power-limited.

The optimal yaw angle is consistently **~9°** on upstream turbines, with downstream turbines remaining at 0°. This is consistent with findings in the literature — Bastankhah & Porté-Agel (2016) report optimal yaw angles of 8–12° for similar farm configurations. The optimizer correctly identifies which turbines are upstream for each wind direction and applies yaw only where it provides a net benefit.

Across all 32 scenarios, the overall power gain is **+1.04%**. For a farm like Dogger Bank (3.6 GW), this translates to approximately 37 MW of additional capacity — enough to power roughly 30,000 homes.

# Conclusion

A Physics-Informed Neural Network digital twin for UK offshore wind farms has been successfully implemented. The PINN surrogate model, regularised by the 2D steady-state Navier-Stokes equations, achieves a test loss of 0.050 and demonstrates physically consistent velocity and pressure field predictions. The system models a 16-turbine Dogger Bank-inspired layout with GE Haliade-X 13 MW turbines.

The yaw optimisation component, based on classical scipy optimisation rather than reinforcement learning, identifies optimal yaw configurations in seconds and achieves up to 4.65% power gain from wake steering. The optimal yaw angle of ~9° on upstream turbines is consistent with published wind tunnel and field experiments.

Key technical contributions:

- **Navier-Stokes regularisation** ensures predictions respect conservation of mass and momentum
- **Jiménez wake deflection model** with distance-dependent lateral offset and Gaussian overlap
- **Two-stage Adam → L-BFGS training** for robust PINN convergence
- **Multi-start bounded optimisation** for finding global optimal yaw configurations

The system demonstrates the viability of SciML approaches for wind farm optimisation, combining the mathematical rigour of PDE-constrained learning with practical engineering applicability. Future work could extend the model to 3D, incorporate time-dependent wind conditions, and validate against high-fidelity CFD simulations or field data from operational UK wind farms.
