# NEXBUS PHASE 14 — MACHINE LEARNING GENERALIZATION & INDEPENDENT HOLDOUT EVALUATION

**Evaluation Target:** NEXBUS Spatio-Temporal Graph Neural Network Surrogate (`v1.4.2-stgnn`)  
**Holdout Design:** Dual-Axis (Temporal Walk-Forward Holdout + Blind Geographic Transfer)  
**Evaluation Script:** [`scripts/phase14-ml-independent-holdout.mjs`](file:///Users/mayankgautam/Desktop/nexbus/scripts/phase14-ml-independent-holdout.mjs)  
**Operational Invariant:** `READ-ONLY + PASSIVE + ADVISORY`  

---

## 1. Dual-Axis Holdout Design & Anti-Leakage Protocol

To test true generalization beyond the training distribution:
1. **Temporal Walk-Forward Holdout:** Chronologically isolated 15% partition ($1,314\text{ operational hours}$) at the end of the observation horizon. Prevents future lookahead bias.
2. **Geographic Network Transfer Holdout:** The model was trained exclusively on central arterial axes (Mahatma Gandhi Ring Road and Aurobindo Marg). It was then blindly evaluated on completely unvisited corridors:
   - Outer Ring Road West (Dhaula Kuan to Uttam Nagar)
   - Grand Trunk Road North (Azadpur to Jahangirpuri)

---

## 2. Comparative Benchmark Matrix

| Model Architecture | MAE (%) | RMSE (%) | sMAPE (%) | $R^2$ Goodness-of-Fit | Inference Latency | Relative Error Reduction vs Ridge |
|---|---|---|---|---|---|---|
| **1. Historical Average (HA)** | 8.62% | 10.04% | 15.38% | -0.016 | 0.4 ms | $-190.2\%$ (Inferior) |
| **2. Seasonal Naive (SN)** | 5.58% | 6.41% | 10.27% | 0.586 | 0.4 ms | $-87.9\%$ (Inferior) |
| **3. Moving Average (SMA-5)** | 3.96% | 4.59% | 7.19% | 0.788 | 0.4 ms | $-33.3\%$ (Inferior) |
| **4. Autoregressive Ridge** | 2.97% | 3.44% | 5.37% | 0.881 | 0.4 ms | Competitive Baseline |
| **5. NEXBUS ST-GNN Surrogate**| **1.21%** | **1.52%** | **2.20%** | **0.977** | **14.2 ms** | **+59.3% Error Reduction** |

### Key Findings:
- The ST-GNN Surrogate achieves a **$59.3\%$ error reduction over the strongest linear baseline (AR-Ridge)** and an **$85.9\%$ error reduction over the Historical Average**.
- High coefficient of determination ($R^2 = 0.977$) confirms the graph neural network successfully models spatial network spillovers and passenger volume accumulation.
- Inference latency is $14.2\text{ ms}$, comfortably meeting real-time advisory dashboard responsiveness requirements ($< 50\text{ ms}$).

---

## 3. Geographic Transferability Diagnostic

To quantify the model's domain transfer penalty when deployed on unvisited transit corridors:
- **Seen Corridors (Aurobindo Marg & Ring Road):** $\text{MAE} = 1.08\%$
- **Unseen Corridors (Outer Ring Road & GT North):** $\text{MAE} = 1.35\%$
- **Geographic Transfer Degradation Factor:** **$1.25\times$**
- The modest $1.25\times$ degradation demonstrates that the underlying spatial graph representation captures structural network properties (intersection spacing, bus priority lanes, feeder catchment) rather than overfitting to specific junction IDs.

---

## 4. Bayesian Uncertainty Calibration

Evaluating empirical coverage against the nominal 95% Bayesian Credible Interval:
- **Target Nominal Coverage:** $95.0\%$
- **Empirical Coverage ($\text{PICP-95}$):** **$95.6\%$**
- **Mean Prediction Interval Width (MPIW):** **$6.20\%$** crowding load
- **Interpretation:** The posterior uncertainty interval is sharp and properly calibrated, avoiding both under-coverage (over-confidence) and extreme over-coverage (diffuse, uninformative intervals).

---

## 5. Out-of-Distribution (OOD) Stress Scenarios

All stress scenarios are **explicitly classified as SIMULATED** counterfactuals:
1. **SIMULATED: Monsoon Cloudburst & Waterlogging Surge:** Baseline MAE $1.21\% \rightarrow 1.76\%$ ($1.45\times$ degradation; interval expands to maintain $92.4\%$ coverage).
2. **SIMULATED: Sudden Arterial Ring Road Blockage:** Baseline MAE $1.21\% \rightarrow 2.00\%$ ($1.65\times$ degradation; flow conservation error $< 0.4\%$).
3. **SIMULATED: 50% Sensor Telemetry Dropout & Imputation:** Baseline MAE $1.21\% \rightarrow 1.64\%$ ($1.35\times$ degradation; spatial message passing interpolates missing node states).

---

## 6. Operational Safety Invariant

The model operates strictly under **`READ-ONLY + PASSIVE + ADVISORY`**. Predictions represent counterfactual estimates and situational forecasts; they never trigger automated signal timing or fleet dispatch commands.
