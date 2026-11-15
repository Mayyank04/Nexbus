# NEXBUS Phase 13 — Machine Learning Field Performance & Robustness Validation Report

**Phase:** Phase 13 — Independent Field Evidence Verification, Statistical Validation & Research Pilot Execution  
**Subject:** Empirical Predictive Evaluation, Temporal Split Governance, OOD Stress Robustness & SHAP Explainability  
**Active Production Model:** Spatio-Temporal Graph Neural Network Surrogate (ST-GNN v1.4.2)  
**Operational Invariant:** READ-ONLY + PASSIVE + ADVISORY  

---

## 1. Executive Summary

This report establishes the independent statistical validation of machine learning predictive models deployed within the NEXBUS platform. The evaluation certifies model accuracy, temporal split integrity (eliminating look-ahead data leakage), Bayesian prediction interval calibration, and out-of-distribution (OOD) robustness across operational stress scenarios.

### Primary Validation Findings:
1. **Temporal Holdout Governance:** 8,760 hourly observations (1 complete operational year) partitioned chronologically into Training ($70.0\%$, 6,132 hrs), Validation ($15.0\%$, 1,314 hrs), and Strict Temporal Holdout Test ($15.0\%$, 1,314 hrs) with **zero look-ahead leakage**.
2. **Accuracy Hierarchy Confirmed:**
   - **Historical Average (HA Baseline):** $\text{MAE} = 14.8\%, \text{RMSE} = 19.4\%, \text{MAPE} = 16.2\%$.
   - **AR-Ridge Linear Baseline:** $\text{MAE} = 9.2\%, \text{RMSE} = 12.6\%, \text{PICP-95} = 87.4\%$.
   - **ST-GNN Surrogate (Production):** $\mathbf{\text{MAE} = 5.6\%}, \mathbf{\text{RMSE} = 7.7\%}, \mathbf{\text{PICP-95} = 94.0\%}, R^2 = 0.89$.
3. **Out-of-Distribution Robustness:** Tested against severe operational shocks (Monsoon Waterlogging, Corridor Blockage, Sensor Blackout); the model demonstrates graceful degradation with degradation ratios $\le 1.50\times$ and Bayesian interval coverage $\ge 89.4\%$.
4. **SHAP Feature Attribution:** Global feature importance confirms that predictions are predominantly driven by upstream queue propagation, headway variance, and peak-hour diurnal cycles.
5. **Operational Safety Invariant:** Formally certified as `READ-ONLY + PASSIVE + ADVISORY`.

---

## 2. Temporal Split Governance & Leakage Prevention

Standard random $k$-fold cross-validation is mathematically invalid for urban mobility time-series due to temporal auto-correlation. NEXBUS enforces **Strict Chronological Holdout Partitioning**:

```
[0 hrs] ──────────────────── [6,132 hrs] ─────────────── [7,446 hrs] ─────────────── [8,760 hrs]
           TRAINING (70.0%)                  VALIDATION (15.0%)            HOLDOUT TEST (15.0%)
           (Months 1 to 8.4)                 (Months 8.5 to 10.2)          (Final 55 Days)
```

- **Causal Cutoff Invariant:** The model is evaluated strictly on the final 55 operational days of the year. No future data points or backward-smoothed statistics are available during feature construction.
- **Data Leakage Audit:** Verified that all graph lag matrices ($t - 15\text{m}, t - 30\text{m}, t - 60\text{m}$) are strictly backward-looking.

---

## 3. Comparative Benchmark Performance Evaluation

### Table 1: Model Accuracy Metrics on Final 15% Temporal Holdout Set ($N = 1,314$ hours)
| Model Architecture & Tier | Mean Absolute Error (MAE) | Root Mean Square Error (RMSE) | Mean Absolute Percentage Error (MAPE) | 95% Bayesian Coverage (PICP-95) | Goodness of Fit ($R^2$) | Inference Latency |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Historical Average (HA)** | $14.8\%$ | $19.4\%$ | $16.2\%$ | N/A (Point lookup) | $0.58$ | $0.8\text{ ms}$ |
| **Autoregressive Ridge (AR-Ridge)** | $9.2\%$ | $12.6\%$ | $9.8\%$ | $87.4\%$ | $0.76$ | $3.2\text{ ms}$ |
| **ST-GNN Surrogate (v1.4.2)** | **$5.6\%$** | **$7.7\%$** | **$5.1\%$** | **$94.0\%$** | **$0.89$** | **$14.5\text{ ms}$** |

### Key Analytical Takeaways:
- ST-GNN reduces Mean Absolute Error by **$62.2\%$** relative to Historical Average and **$39.1\%$** relative to linear AR-Ridge.
- The 95% Bayesian Credible Interval coverage ($\text{PICP-95} = 94.0\%$) closely matches the nominal 95% target, certifying that uncertainty bounds are well-calibrated and neither under-confident nor over-confident.

---

## 4. Out-of-Distribution (OOD) Stress Scenarios

To ensure reliability during non-recurrent operational disruptions, the production ST-GNN model was subjected to three extreme real-world stress conditions:

### Table 2: OOD Stress Testing & Degradation Metrics
| Stress Scenario Description | Baseline MAE | Stressed MAE | Degradation Ratio | Stressed 95% CI Coverage | Resilience Assessment |
| :--- | :---: | :---: | :---: | :---: | :--- |
| **MONSOON_WATERLOGGING_SURGE** | $5.6\%$ | $7.2\%$ | **$1.28\times$** | **$91.8\%$** | Graceful degradation; uncertainty bounds widen appropriately |
| **SUDDEN_CORRIDOR_BLOCKAGE** | $5.6\%$ | $8.4\%$ | **$1.50\times$** | **$89.4\%$** | Graph convolution redirects demand to adjacent arterial links |
| **PEAK_HOUR_SENSOR_BLACKOUT** | $5.6\%$ | $6.9\%$ | **$1.23\times$** | **$92.6\%$** | Autoregressive temporal priors compensate for missing spatial pings |

**Resilience Finding:** In all stress regimes, the error degradation ratio remains $\le 1.50\times$ (well below the $2.0\times$ safety ceiling), and Bayesian interval coverage remains $\ge 89.4\%$.

---

## 5. SHAP (Shapley Additive exPlanations) Feature Explainability

Using tree-based and graph-gradient SHAP attribution methods, the relative feature importance driving model forecasts was quantified:

### Table 3: Global Feature Importance Rankings (Delhi Transit Network)
| Rank | Feature Identifier | Mean Absolute SHAP Impact | Description |
| :---: | :--- | :---: | :--- |
| **1** | `headway_variance_lag15m` | **$3.8\text{ min}$** | Upstream vehicle bunching and headway irregular spacing |
| **2** | `time_of_day_peak_multiplier` | **$3.2\text{ min}$** | Diurnal peak vs inter-peak schedule baseline |
| **3** | `upstream_feeder_congestion_ratio` | **$2.6\text{ min}$** | Bottleneck spillback from adjacent arterial feeders |
| **4** | `active_fleet_availability_pct` | **$2.1\text{ min}$** | Depot bus turnout ratio and fleet availability |
| **5** | `interchange_concourse_pedestrian_inflow` | **$1.7\text{ min}$** | Passenger boarding surge from connecting metro gates |
| **6** | `monsoon_precipitation_rate_mm` | **$1.1\text{ min}$** | Severe localized rain inducing kerbside friction |

---

## 6. Model Lifecycle Governance

The NEXBUS model registry classifies all assets into 5 formal lifecycle states:
- `RESEARCH`: Exploratory architectures undergoing ablation.
- `VALIDATION`: Models undergoing out-of-distribution benchmark testing.
- `APPROVED`: Models certified by research consortium for deployment.
- `ACTIVE`: Single production surrogate currently serving API endpoints (`model-stgnn-surrogate`).
- `DEPRECATED`: Legacy models retained for benchmark regression verification (`model-hist-avg`, `model-ar-ridge`).

---

## 7. Mandatory Epistemological Disclosure & Operational Invariant

The model registry and API payloads explicitly declare:

> **CALIBRATED RESEARCH SURROGATE — NOT A CERTIFIED DMRC/DTC RUNTIME MODEL.**  
> The ST-GNN surrogate is trained on empirical corridor samples and topological graphs for research and advisory scenario simulation. It does not constitute certified safety-critical interlocking or automated dispatch control software.

NEXBUS operates strictly under:

$$\mathbf{READ\text{-}ONLY} + \mathbf{PASSIVE} + \mathbf{ADVISORY}$$

No prediction, forecast, or uncertainty interval is capable of actuating vehicle acceleration, dispatching buses, or modifying signal aspects.
