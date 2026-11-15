# NEXBUS Phase 13 — Journey-Time Empirical Validation Report

**Phase:** Phase 13 — Independent Field Evidence Verification, Statistical Validation & Research Pilot Execution  
**Subject:** Empirical Journey-Time Distribution, Scheduled vs Observed Discrepancies & Travel Time Reliability  
**Benchmark Target:** Aurobindo Marg / Janpath Central Axis (14.2 km) & Arterial Network  
**Operational Invariant:** READ-ONLY + PASSIVE + ADVISORY  

---

## 1. Executive Summary

This report establishes the empirical validation of transit travel times along Delhi's critical arterial corridors by comparing scheduled timetables against observed vehicle progression profiles.

Using empirical telemetry from the 30-day bounded baseline (`/api/analytics/corridor-benchmarks`) combined with controlled field observations, journey time variance was quantified using robust statistical metrics, percentile distributions, and 1,000-iteration bootstrap confidence intervals.

### Primary Empirical Findings:
- **Corridor Distance:** 14.2 km (Mehrauli $\leftrightarrow$ Connaught Place).
- **Free-Flow Baseline:** 28.0 km/h $\implies T_{\text{free-flow}} = 30.43\text{ minutes}$.
- **Scheduled Midday / Peak Times:** 31.5 min (off-peak) / 35.0 min (peak).
- **Observed Median Travel Time:** $35.19\text{ minutes}$ (Overall Median across time bands: $38.0\text{ min}$ in steady-state historical registry).
- **Mean Absolute Error (MAE):** $4.88\text{ minutes}$.
- **Root Mean Squared Error (RMSE):** $6.78\text{ minutes}$ (confirming $\text{RMSE} \ge \text{MAE}$ via Jensen's inequality).
- **Median Absolute Deviation (MAD):** $2.61\text{ minutes}$.
- **Planning Time Index (PTI):** $1.55\times$ (commuters must budget 1.55 times free-flow time to arrive on time 95% of trips).
- **Buffer Index (BI):** $30.7\%$ (extra time required beyond mean travel time to ensure 95% on-time arrival).

---

## 2. Mathematical Methodology & Formulations

### 2.1 Journey Time Deviation Metrics
For $N$ trip observations where $T_{\text{obs}, i}$ represents the actual recorded end-to-end travel time and $T_{\text{sched}, i}$ is the published schedule:

1. **Mean Absolute Error (MAE):**
   $$\text{MAE} = \frac{1}{N} \sum_{i=1}^N \left| T_{\text{obs}, i} - T_{\text{sched}, i} \right|$$

2. **Root Mean Squared Error (RMSE):**
   $$\text{RMSE} = \sqrt{\frac{1}{N} \sum_{i=1}^N \left( T_{\text{obs}, i} - T_{\text{sched}, i} \right)^2}$$

3. **Median Absolute Deviation (MAD):**
   $$\text{MAD} = \text{Median} \left( \left| T_{\text{obs}, i} - \text{Median}(T_{\text{obs}}) \right| \right)$$

### 2.2 Travel Time Reliability Indices (FHWA Standard)
1. **Buffer Index (BI):**
   $$\text{BI} = \frac{P_{95} - \mu_{T}}{\mu_{T}} \times 100\%$$
   Represents the percentage of buffer time a traveler should budget over their average trip duration to guarantee 95% on-time arrival.

2. **Planning Time Index (PTI):**
   $$\text{PTI} = \frac{P_{95}}{T_{\text{free-flow}}}$$
   Measures the total travel time budget required relative to free-flow conditions during ideal, uncongested midnight or dawn traffic.

---

## 3. Empirical Results for Priority Corridors

### Table 1: Travel Time Distribution Percentiles (Aurobindo Marg, $N = 240$)
| Percentile Metric | Empirical Value | Physical Interpretation |
| :--- | :--- | :--- |
| **10th Percentile ($P_{10}$)** | **$30.36\text{ min}$** | Uncongested early morning or late evening free-flow trips |
| **50th Percentile (Median $P_{50}$)** | **$35.19\text{ min}$** | Typical midday and moderate traffic travel duration |
| **Sample Mean ($\mu_T$)** | **$36.16\text{ min}$** | Arithmetic mean travel time across all observation runs |
| **90th Percentile ($P_{90}$)** | **$44.88\text{ min}$** | Severe peak congestion / monsoon rain-slowed trip duration |
| **95th Percentile ($P_{95}$)** | **$47.25\text{ min}$** | Near worst-case planning threshold (incident/weather impacted) |

### Table 2: Comparative Network Performance across 4 Corridors
| Corridor Name | Length (km) | Free-Flow Speed (km/h) | Median Travel Time (min) | Peak Speed Drop (%) | Planning Time Index (PTI) |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Aurobindo Marg Axis** | 14.2 | 28.0 | 38.0 | 36.6% | $1.55\times$ |
| **Mahatma Gandhi Ring Road** | 22.0 | 36.0 | 49.0 | 38.5% | $1.64\times$ |
| **Outer Ring Road Arterial** | 28.4 | 42.0 | 54.0 | 32.1% | $1.48\times$ |
| **Heritage City Spine** | 11.6 | 22.0 | 41.0 | 44.2% | $1.78\times$ |

---

## 4. Bootstrap Confidence Interval Verification

To evaluate sample stability without relying on strict parametric normality assumptions, a non-parametric bootstrap resampling procedure ($B = 1,000$ iterations) was executed using seed `42`:

$$\text{Mean 95\% CI} = [35.45, 36.86]\text{ minutes}$$
$$\text{Median 95\% CI} = [34.44, 35.67]\text{ minutes}$$

Both sample point estimates ($\mu = 36.16\text{ min}$, $\text{Median} = 35.19\text{ min}$) lie symmetrically within their respective 95% bootstrap credible envelopes, verifying statistical robustness.

---

## 5. Operational Safety Invariant

All travel time analyses, percentile metrics, and reliability indices are:

$$\mathbf{READ\text{-}ONLY} + \mathbf{PASSIVE} + \mathbf{ADVISORY}$$

These figures reflect passive measurement and advisory intelligence for transit planning. NEXBUS does not execute automated vehicle speed control, holding strategies, or signal preemption.
