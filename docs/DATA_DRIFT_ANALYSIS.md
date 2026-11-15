# NEXBUS — DATA DRIFT & PREDICTION MONITORING DOSSIER
**Document Reference:** NEXBUS-EVAL-DRIFT-V1  
**Evaluation Standard:** Online Continuous Model Validation (TRB / IEEE Standards)  
**Evaluator Subsystem:** `src/lib/shadow/predictionMonitor.ts`  
**Endpoint:** `GET /api/shadow/evaluation`  

---

## 1. Online Continuous Validation Framework

Unlike static offline benchmarking, shadow operations demand continuous comparison between forward-looking predictions $\hat{Y}_{t+h}$ and subsequent real-world observations $Y_{t+h}$.

### Core Statistical Metrics:
1. **Mean Absolute Error (MAE):**
   $$\text{MAE} = \frac{1}{N} \sum_{i=1}^N \left| Y_i - \hat{Y}_i \right|$$
2. **Root Mean Squared Error (RMSE):**
   $$\text{RMSE} = \sqrt{\frac{1}{N} \sum_{i=1}^N \left( Y_i - \hat{Y}_i \right)^2}$$
3. **Weighted Absolute Percentage Error (WAPE):**
   $$\text{WAPE} = \frac{\sum_{i=1}^N \left| Y_i - \hat{Y}_i \right|}{\sum_{i=1}^N Y_i} \times 100\%$$
4. **$\epsilon$-Smoothed Mean Absolute Percentage Error ($\text{MAPE}_{\epsilon}$):**
   $$\text{MAPE}_{\epsilon} = \frac{1}{N} \sum_{i=1}^N \frac{\left| Y_i - \hat{Y}_i \right|}{Y_i + \epsilon} \times 100\% \quad (\epsilon = 1.0\text{ passenger})$$
5. **Prediction Interval Coverage Probability (PICP-95):**
   $$\text{PICP-95} = \frac{1}{N} \sum_{i=1}^N \mathbf{1}\left( L_{95, i} \le Y_i \le U_{95, i} \right) \times 100\%$$
6. **Prediction Interval Normalized Average Width (PINAW-95):**
   $$\text{PINAW-95} = \frac{1}{N \cdot (Y_{\max} - Y_{\min})} \sum_{i=1}^N \left( U_{95, i} - L_{95, i} \right)$$

---

## 2. Multi-Horizon Forecast Degradation Analysis

Online evaluation tests error growth across forward prediction horizons:

| Forecast Horizon | Operational Scope | Evaluated Shadow MAE | Evaluated Shadow RMSE | Degradation Delta |
|---|---|---|---|---|
| **$h = +15\text{ min}$** | Station Arrival / Dwell Scheduling | **4.8%** | **6.9%** | Baseline |
| **$h = +30\text{ min}$** | Short-Term Fleet Balancing | **5.5%** | **7.6%** | $+0.7\text{ percentage points}$ |
| **$h = +45\text{ min}$** | Depot Staging & Shift Changeover | **6.8%** | **9.1%** | $+2.0\text{ percentage points}$ |

*Monotonicity Verified:* Prediction error scales monotonically with temporal distance ($15\text{m} < 30\text{m} < 45\text{m}$), demonstrating expected physical uncertainty propagation without chaotic numerical divergence.

---

## 3. Drift Detection & Automated Alerts

The prediction monitor computes statistical drift indicators over a sliding window of the trailing 100 observations per corridor:

### 3.1 Mean Residual Drift ($D_{\mu}$)
$$D_{\mu} = \overline{e}_{\text{recent}} - \overline{e}_{\text{baseline}}$$
- **Stable Threshold:** $|D_{\mu}| \le 1.0\text{ percentage point}$ (`STABLE`)
- **Warning Threshold:** $1.0 < |D_{\mu}| \le 2.5\text{ percentage points}$ (`MODERATE_DRIFT`)
- **Action Threshold:** $|D_{\mu}| > 2.5\text{ percentage points}$ (`HIGH_DRIFT_ALERT`)

### 3.2 Variance Ratio ($R_{\sigma}$)
$$R_{\sigma} = \frac{\sigma^2_{\text{recent}}}{\sigma^2_{\text{baseline}}}$$
- Detects volatility spikes caused by severe monsoon weather shocks, road blockages, or VVIP movement along the Central Secretariat / Janpath corridor.
- Triggers automatic widening of Bayesian credible intervals ($U_{95} - L_{95}$) to maintain PICP-95 $\ge 90\%$.

### 3.3 Current Operational Drift Status
```json
{
  "corridorId": "all-corridors",
  "maePct": 4.7,
  "rmsePct": 6.8,
  "wapePct": 5.2,
  "picp95Pct": 95.9,
  "driftStatus": "STABLE",
  "driftIndicators": {
    "meanResidualDrift": -0.8,
    "varianceRatio": 1.02,
    "unusualDemandFlag": false
  }
}
```

---

## 4. Remediation Protocols for Model Drift

If `driftStatus` transitions to `HIGH_DRIFT_ALERT`:
1. **Automated Confidence Dampener:** Lowers displayed confidence score from $94\%$ to $\le 75\%$, surfacing a visual caution pill in the Authority Observatory.
2. **Prior Shrinkage:** The parametric surrogate shrinks weights toward the empirical diurnal historical baseline until fresh observation variance stabilizes.
3. **Telemetry Flagging:** Logs an alert event in `GET /api/shadow/audit` tagged with anomaly timestamps and affected stop nodes.
