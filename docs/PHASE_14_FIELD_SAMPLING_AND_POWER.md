# NEXBUS PHASE 14 — FIELD SAMPLING DESIGN & STATISTICAL POWER ANALYSIS

**Protocol Reference:** `PILOT-2026-DEL-AUROBINDO-01`  
**Focus Area:** Sampling Strategy, Stratification, Statistical Power, and Sample Size Justification  
**Operational Invariant:** `READ-ONLY + PASSIVE + ADVISORY`  

---

## 1. Sampling Strategy & Temporal Stratification

The research design employs a **stratified random sampling strategy** across time-of-day and day-of-week dimensions to eliminate temporal bias:

### 1.1 Four Diurnal Strata
1. **Stratum 1 (AM Peak: 08:00 – 10:30 IST):** Heavy commuter radial inflow towards Connaught Place. Characterized by high bus occupancy ($>85\%$), bus bunching, and congestion bottlenecks at AIIMS flyover and INA.
2. **Stratum 2 (Midday Inter-Peak: 12:00 – 14:00 IST):** Relatively stable traffic conditions. Moderate bus frequency (14 buses/hr), providing a baseline for headway regularity and dwell time modeling.
3. **Stratum 3 (PM Peak: 17:00 – 19:30 IST):** Reverse outflow from central commercial zones towards southern residential nodes (Hauz Khas, Saket, Mehrauli). High passenger boarding friction.
4. **Stratum 4 (Off-Peak: 20:30 – 22:30 IST):** Low-congestion regime approaching free-flow kinematic speeds ($28\text{ km/h}$).

### 1.2 Weekly Strata
- **Weekday Commuting (Tuesday to Thursday):** Representative working days free of Monday morning surges or Friday evening early departures.
- **Weekend Commercial (Saturday):** Shopping and recreation traffic surges around INA Market (Dilli Haat) and Connaught Place.

---

## 2. Statistical Power Analysis & Sample Size Determination

### 2.1 Formal Hypothesis & Parameters
To evaluate whether NEXBUS journey-time predictions deviate significantly from observed travel times:
- Null Hypothesis ($H_0$): Mean difference between predicted and observed journey times $\Delta = 0\text{ minutes}$.
- Alternative Hypothesis ($H_1$): Model exhibits a detectable systematic bias $\Delta \ge 1.5\text{ minutes}$ (practically significant error in urban transit planning).
- Standard Deviation of Journey Times ($\sigma$): Estimated empirically at $5.25\text{ minutes}$ from baseline corridor archives.
- Significance Level ($\alpha$): $0.05$ (two-tailed, $z_{\alpha/2} = 1.96$).
- Desired Statistical Power ($1 - \beta$): $0.80$ ($z_\beta = 0.8416$).

### 2.2 Sample Size Formulation
The required sample size for a two-sample test (or paired difference test) is given by:
$$N = \frac{2 \cdot \left(z_{\alpha/2} + z_\beta\right)^2 \cdot \sigma^2}{\delta^2}$$
Substituting the empirical parameters:
$$N = \frac{2 \cdot (1.960 + 0.8416)^2 \cdot (5.25)^2}{(1.50)^2} = \frac{2 \cdot (2.8016)^2 \cdot 27.5625}{2.25}$$
$$N = \frac{2 \cdot 7.8490 \cdot 27.5625}{2.25} = \frac{432.66}{2.25} \approx \mathbf{192.3\text{ runs}}$$

### 2.3 Selected Pilot Target
- To ensure robustness against missing observations, bad GPS fixes, and operational cancellations, the target sample size is set to:
$$N_{\text{target}} = \mathbf{240\text{ corridor trip records}}$$
- At $N = 240$, the achieved statistical power rises to:
$$\text{Power} = 1 - \Phi\left(z_{\alpha/2} - \frac{\delta \sqrt{N}}{\sigma \sqrt{2}}\right) = 1 - \Phi\left(1.96 - \frac{1.50 \cdot 15.49}{5.25 \cdot 1.414}\right) \approx \mathbf{88.6\%}$$
This sample size provides substantial statistical power ($>88\%$) to detect even modest systematic estimation errors ($1.5\text{ min}$) at a $95\%$ confidence level.

---

## 3. Inclusion, Exclusion & Missing Data Governance

### 3.1 Inclusion Criteria
- Scheduled bus runs operating along routes 502, 505, 534, 548, or TMS radial legs.
- Observations recorded at designated survey stations within the statutory Delhi NCT geofence.
- Records possessing confirmed researcher consent assertions.

### 3.2 Exclusion Criteria
- Vehicles undergoing non-revenue deadhead trips or depot transfers.
- Incomplete trips aborted due to mechanical breakdown or sudden police diversions.
- Any record violating privacy constraints (e.g. unmasked license plates or personal identification).

### 3.3 Missing Observation Treatment
- Missing arrival or departure events exceeding 30 minutes of scheduled intervals are logged as `TRIP_CANCELLATION` and excluded from travel time error metrics.
- Missing timestamps are never imputed with synthetic values in empirical validation holdouts.
