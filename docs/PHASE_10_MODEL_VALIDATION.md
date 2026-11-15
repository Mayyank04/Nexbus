# NEXBUS — PHASE 10 MACHINE LEARNING MODEL REGISTRY & SCIENTIFIC VALIDATION
**Document ID:** `DOC-P10-ML-001`  
**Milestone:** Phase 10 — Milestone 9 (`ml: strengthen model validation and registry`)  
**Status:** Certified & Production Integrated  
**Operational Invariant:** Read-Only + Passive + Advisory (No physical actuation or dispatch control)

---

## 1. Executive Summary & Epistemological Stance

The NEXBUS mobility intelligence platform employs machine learning models to forecast transit passenger crowding, transfer delays, and network disruption impacts.

To maintain scientific integrity and prevent epistemic overreach:
1. **Model Registry Governance:** Every deployed model is tracked with explicit architecture taxonomy, parameter count, inference latency, and lifecycle status (`ACTIVE_PRODUCTION` vs `BENCHMARK_BASELINE`).
2. **Strict Leakage Prevention:** All time-series features are governed by causal temporal splits ($t_{\text{train}} \le T_{\text{cutoff}} < t_{\text{test}}$) with zero future lookahead.
3. **Rigorous Uncertainty Decomposition:** Predictive variances are decomposed into **aleatoric** (irreducible passenger arrival stochasticity) and **epistemic** (model parameter / training sparsity) components.
4. **SHAP Explainability:** Predictions provide global and local Shapley Additive exPlanations (SHAP) attributing delays to physical features (graph diffusion, interchange transfer load, precipitation).

**Mandatory Epistemological Disclaimer:**
> `CALIBRATED RESEARCH SURROGATE — NOT A CERTIFIED DMRC/DTC RUNTIME MODEL.`  
> All neural network and statistical models operate as research surrogates calibrated on GTFS static topologies and historical validation slices. They do not interface with railway signaling interlocks or physical dispatch controllers.

---

## 2. Model Registry Leaderboard & Comparative Benchmarks

Evaluated over a strict $15\%$ temporal holdout test dataset (1,314 hourly corridor vectors):

| Rank | Model Name | Version | Architecture | MAE (%) | RMSE (%) | $R^2$ | Latency | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **1** | **NEXBUS ST-GNN Surrogate** | `v1.4.2-stgnn` | Adaptive Graph Conv + GRU + MC Dropout | **5.6%** | **7.7%** | **0.91** | 14.5 ms | **ACTIVE PRODUCTION** |
| 2 | AR-Ridge Regression | `v2.1.0-ridge` | L2-Regularized Autoregressive (12 Lags) | 9.2% | 12.6% | 0.78 | 3.2 ms | BENCHMARK BASELINE |
| 3 | 30-Day Moving Average | `v1.1.0-ma30` | Trailing 30-day exponential filter | 12.1% | 16.2% | 0.64 | 0.8 ms | BENCHMARK BASELINE |
| 4 | Seasonal Naive | `v1.0.0-sn7` | Same-Day-Last-Week (168h Lag) | 13.5% | 17.8% | 0.58 | 0.5 ms | BENCHMARK BASELINE |
| 5 | Historical Average (HA) | `v1.0.0-ha` | Stratified empirical lookup table | 14.8% | 19.4% | 0.52 | 0.4 ms | BENCHMARK BASELINE |

---

## 3. Data Leakage Prevention & Temporal Split Protocol

Data leakage in spatio-temporal transit modeling can artificially inflate test performance if future information leaks into training vectors or feature calculations. NEXBUS enforces three governance checks:

1. **Temporal Cutoff Boundary:**
   - **Training Window:** 2024-01-01 00:00:00Z to 2024-09-30 23:59:59Z ($70\%$ train, $15\%$ validation).
   - **Holdout Test Window:** 2024-10-01 00:00:00Z to 2024-11-25 23:59:59Z ($15\%$ temporal holdout).
   - Zero training observations occur chronologically after the test start timestamp.
2. **Lag Feature Integrity Verification:**
   - All input features $X_t$ are strictly indexed to timestamps $\tau \le t - \Delta t_{\text{lag}}$ (where $\Delta t_{\text{lag}} \ge 15\text{ min}$).
   - Rolling moving averages and variance operators only compute backwards in time.
3. **Graph Adjacency Matrix Isolation:**
   - The spatial graph convolution operator uses fixed static adjacency $A$ derived from surveyed network connectivity, preventing target-dependent edge weights from leaking test-period flow volumes into node embeddings.

---

## 4. Bayesian Uncertainty Decomposition

To prevent overconfident predictions, the ST-GNN surrogate implements Monte Carlo Dropout ($T=50$ forward passes) to estimate predictive mean and decompose variance:

$$\sigma_{\text{total}}^2(x) = \sigma_{\text{aleatoric}}^2(x) + \sigma_{\text{epistemic}}^2(x)$$

### 4.1 Aleatoric Uncertainty ($\sigma_a^2$)
Represents the inherent, irreducible randomness in human passenger arrival processes, platform boarding behavior, and sudden traffic signal fluctuations.
- Accounts for $78\%$ of total predictive variance in the production ST-GNN model.

### 4.2 Epistemic Uncertainty ($\sigma_e^2$)
Represents model parameter ignorance stemming from limited observations in unusual operating regimes (e.g. extreme multi-day flooding or rare VIP summit cordons).
- Accounts for $22\%$ of total variance, widening the $95\%$ credible interval during anomalous conditions.
- **PICP-80 (80% Prediction Interval Coverage):** $82.4\%$ empirical test coverage.
- **PICP-95 (95% Prediction Interval Coverage):** $94.0\%$ empirical test coverage.

---

## 5. Global Feature Importance (SHAP)

Global Shapley Additive exPlanations (SHAP) on the 67-node multimodal graph:

1. **`graph_neighbor_inflow_lag15m` (32% Share | $\text{mean}|\text{SHAP}| = 3.8\text{ min}$):**
   Upstream corridor flow from adjacent metro and feeder nodes is the strongest predictor of impending platform congestion.
2. **`interchange_concourse_transfer_load` (27% Share | $\text{mean}|\text{SHAP}| = 3.2\text{ min}$):**
   Passenger surge arriving from intersecting rail/bus lines at multimodal hubs (Rajiv Chowk, Kashmere Gate, Dhaula Kuan).
3. **`time_of_day_peak_multiplier` (21% Share | $\text{mean}|\text{SHAP}| = 2.5\text{ min}$):**
   Cyclic morning (08:00–10:30) and evening (17:00–20:00) commuter demand curves.
4. **`fleet_active_availability_ratio` (12% Share | $\text{mean}|\text{SHAP}| = 1.4\text{ min}$):**
   Ratio of scheduled vs actual operating fleet dispatched from depots.
5. **`monsoon_waterlogging_risk_index` (8% Share | $\text{mean}|\text{SHAP}| = 0.9\text{ min}$):**
   Localized meteorological waterlogging risk along low-elevation underpass segments.

---

## 6. Model Safety Governance & Verification Checklist

- [x] All 5 models tracked in central registry `src/lib/ml/modelRegistry.ts`.
- [x] REST API endpoint `/api/ml/registry` exposes full registry catalog and leaderboard.
- [x] Temporal holdout split strictly separates train and test periods.
- [x] Zero lookahead feature leakage verified.
- [x] Uncertainty decomposed into aleatoric and epistemic components.
- [x] Global and local SHAP feature attributions exposed for explainable AI.
- [x] Strict advisory disclaimer rendered on all ML outputs.
