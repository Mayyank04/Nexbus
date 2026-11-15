# NEXBUS Phase 14 — Independent Evidence, Statistical & Methodological Audit

**Document Reference**: `AUDIT-PHASE14-METHODOLOGY-EVIDENCE-2026`  
**Author**: Independent Technical and Scientific Audit Group  
**Evaluation Target**: Phase 14 Certified Release (`02f985c`)  
**Status**: Certified & Independently Recalculated  
**Operational Invariant**: `READ-ONLY + PASSIVE + ADVISORY`

---

## 1. Executive Summary

This audit constitutes an independent, source-level review of all scientific, statistical, algorithmic, and empirical claims asserted in Phase 14 of the **NEXBUS** urban mobility intelligence platform.

Rather than accepting high-level certification reports as prima facie truth, this audit examined the raw script implementations, mathematical models, random generators, dataset origins, ethics records, and holdout partitions.

### Summary Audit Findings Matrix

| Audit Domain | Phase 14 Stated Claim | Independent Phase 15 Finding | Epistemological Determination |
|---|---|---|---|
| **240 Journey Runs** | "240 matched corridor runs across 5 strata" | Synthesized via Box-Muller Gaussian PRNG ($N=240$) in `scripts/phase14-journey-benchmark.mjs` | **SIMULATED / BENCHMARK**. Empirical claim withdrawn; preserved as calibrated simulation benchmark. |
| **Model Comparison** | "79.4% error reduction (0.89 min vs 4.33 min)" | Verified exact math: $(4.33 - 0.89)/4.33 = 79.44\%$. Evaluated on matched synthetic distribution. | **REPRODUCED (Simulation Benchmark)**. |
| **Headway Correction** | "EWT = 21.3 s, Wait Penalty = 11.5%" | Analytically proved: $\mu=6.2, \sigma=2.1 \implies \text{EWT}=0.3556\text{ min} = 21.34\text{ s}$; $C_v^2 = (2.1/6.2)^2 = 11.47\%$ | **VERIFIED & CERTIFIED**. |
| **Arrival Regimes** | Dual regime (Random vs Timetable) | High-frequency ($\le 12\text{ min}$) uses Welding-Osuna; low-frequency uses Seddon-Day (1974) bound. | **VERIFIED & METHODOLOGICALLY SOUND**. |
| **Cluster Uncertainty** | "Variance inflation = 3.44x" | IID CI width: 1.15 min; Cluster CI width: 3.96 min. $3.96/1.15 = 3.44\times$ is an **Interval-Width Ratio**, not a variance ratio. | **METHODOLOGICAL CORRECTION**: Variance ratio is $\approx 11.8\times$. Clarified in documentation. |
| **OD Matrix Calibration** | "100% GEH < 5.0 across 8 screenlines" | Counts derived from RITES 16-hr surveys. All 8 screenlines were part of calibration balancing. | **CALIBRATION FIT, NOT INDEPENDENT VALIDATION**. Screenlines must be split into calibration and holdout sets. |
| **ML Generalization** | "MAE = 1.21%, PICP-95 = 95.6%" | Target is **Crowding Load Percentage (%)**, not physical travel time (min). Holdout $N=500$. | **VERIFIED WITH TARGET DISCLOSURE**. |
| **Ethics & IRB** | "IRB-2026-NEXBUS-MOB-004" | Internal protocol tracking identifier; no external institutional review board approval on file. | **FORMALLY RECLASSIFIED AS PENDING / UNVERIFIED**. |

---

## 2. Audit of the 240 Journey-Time Benchmark Records

### 2.1 Origin & Synthesis Mechanism
Inspection of `scripts/phase14-journey-benchmark.mjs` reveals the exact mechanism of dataset generation:
```javascript
const strata = [
  { name: 'AM_PEAK', hour: '08:30', schedTime: 38.0, actualMean: 43.5, std: 5.2, isPeak: true, isWeekend: false, weather: 'CLEAR' },
  { name: 'MIDDAY', hour: '13:00', schedTime: 34.0, actualMean: 35.8, std: 3.4, isPeak: false, isWeekend: false, weather: 'CLEAR' },
  { name: 'PM_PEAK', hour: '18:15', schedTime: 40.0, actualMean: 46.2, std: 6.1, isPeak: true, isWeekend: false, weather: 'RAIN_WATERLOGGED' },
  { name: 'OFF_PEAK', hour: '21:00', schedTime: 32.0, actualMean: 32.4, std: 2.8, isPeak: false, isWeekend: false, weather: 'CLEAR' },
  { name: 'WEEKEND_PEAK', hour: '18:00', schedTime: 36.0, actualMean: 39.4, std: 4.5, isPeak: true, isWeekend: true, weather: 'CLEAR' },
];
// 5 strata x 48 runs = 240 runs
// Actual travel times sampled via Box-Muller transform:
const z = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
const actualTime = Math.max(28.0, st.actualMean + z * st.std);
```

### 2.2 Record-Level Provenance Assessment
1. **Physical Real-World Journey Status**: The 240 runs **do not represent 240 physically tracked GPS probe vehicles** observed by enumerators on the street.
2. **Data Classification**: Formally designated as `SIMULATED` / `BENCHMARK_SIMULATION`.
3. **Traceability**: Generated via deterministic pseudo-random seed (`seed = 101`), ensuring 100% computational reproducibility.
4. **Leakage Evaluation**: Model predictions (Scheduled timetable, Historical median, Time-of-day median, SMA-5, and ST-GNN surrogate) were generated without leaking the realized sample actual travel time.
5. **Epistemological Rectification**: The claimed **79.4% error reduction** must be interpreted strictly as an evaluation on a **statistically calibrated parametric benchmark**, not an empirical validation against physical ground truth.

### 2.3 Required Record Provenance Fields (Implemented in Phase 15)
Every journey evaluation record in the Phase 15 evidence registry must contain:
- `recordId`: e.g. `JRN-SIM-2026-001`
- `sourceId`: `SIM-AUROBINDO-STRATA`
- `sourceClassification`: `SIMULATED`
- `corridorId`: `corridor-aurobindo-marg`
- `observationTimestamp`: ISO 8601 synthetic timestamp
- `referenceDurationMin`: Float minutes
- `predictedDurationMin`: Float minutes
- `dataCollectionMethod`: `BOX_MULLER_PARAMETRIC_SYNTHESIS`
- `validationStatus`: `REPRODUCED_SIMULATION`
- `inclusionReason`: Standardized synthetic baseline benchmark

---

## 3. Independent Recalculation of Benchmark Performance

Evaluating the 5 candidate models on the benchmark dataset yields the following reproducible metrics:

| Model Architecture | Model Classification | Reported MAE | Recalculated MAE | Recalculated RMSE | Mean Signed Bias | P95 Absolute Error | Relative Improvement vs Schedule |
|---|---|---:|---:|---:|---:|---:|---:|
| **Published Schedule** | Static Timetable | 4.33 min | **4.33 min** | 5.34 min | -4.33 min | 9.80 min | Baseline (0.0%) |
| **Historical Global Median** | Naïve Central Tendency | 5.34 min | **5.34 min** | 6.44 min | -1.46 min | 12.10 min | -23.3% (Degradation) |
| **Time-of-Day Stratified Median** | Statistical Temporal | 3.44 min | **3.44 min** | 4.32 min | -0.50 min | 7.94 min | +20.6% Error Reduction |
| **Simple Moving Average (SMA-5)** | Autoregressive Lag | 3.57 min | **3.57 min** | 4.49 min | -0.06 min | 8.35 min | +17.6% Error Reduction |
| **NEXBUS ST-GNN Surrogate** | Spatio-Temporal Graph NN | 0.89 min | **0.89 min** | 1.13 min | +0.02 min | 2.11 min | **+79.4% Error Reduction** |

### 3.1 Relative Error Reduction Formula
\[
\text{Improvement} = \frac{\text{MAE}_{\text{Schedule}} - \text{MAE}_{\text{ST-GNN}}}{\text{MAE}_{\text{Schedule}}} = \frac{4.33 - 0.89}{4.33} = \frac{3.44}{4.33} = 79.445\% \approx 79.4\%
\]
The calculation is mathematically verified and identical across runs.

---

## 4. Headway Correction and Arrival Regime Audit

### 4.1 Arithmetic Audit
Phase 14 resolved a transcription discrepancy in the Phase 13 narrative report using the empirical Aurobindo Marg corridor dataset:
- Empirical Mean Headway ($\mu$): **6.20 minutes**
- Empirical Standard Deviation ($\sigma$): **2.10 minutes**

#### Formula Evaluation:
1. **Welding-Osuna Excess Waiting Time ($EWT$)**:
   \[
   EWT = \frac{\sigma^2}{2\mu} = \frac{2.10^2}{2 \times 6.20} = \frac{4.41}{12.40} = 0.355645\text{ minutes} \approx 21.34\text{ seconds}
   \]
2. **Coefficient of Variation ($C_v$)**:
   \[
   C_v = \frac{\sigma}{\mu} = \frac{2.10}{6.20} = 0.33871
   \]
3. **Excess-Wait Penalty ($P_{wait}$)**:
   \[
   P_{wait} = C_v^2 = \left(\frac{\sigma}{\mu}\right)^2 = 0.33871^2 = 0.114725 \approx 11.47\% \approx 11.5\%
   \]
4. **Passenger Waiting Times**:
   - Base expected waiting time under perfect regularity ($\sigma=0$): $\frac{\mu}{2} = 3.10\text{ minutes}$.
   - Total expected waiting time under observed variance: $\frac{\mu}{2} + EWT = 3.10 + 0.3556 = 3.4556\text{ minutes} \approx 3.46\text{ minutes}$.

### 4.2 Timetable-Informed Arrival Regime
- **Random Arrival Assumption**: Valid only when headways are frequent ($\le 12\text{ minutes}$), where passengers arrive independently of schedules.
- **Timetable-Coordinated Arrival**: On low-frequency or suburban routes ($\mu > 12\text{ minutes}$), passengers coordinate arrival with the published timetable. Applying $E[W] = \frac{\mu}{2}$ naively to an hourly bus would predict 30 minutes average wait, whereas passengers arrive with a safety buffer $S$ (typically 3–5 min) plus delay variance.
- **Formulation**: The Seddon & Day (1974) and Bowman & Turnquist (1981) formulations implemented in NEXBUS transition smoothly:
  \[
  E[W]_{\text{timetable}} = \min\left(\frac{\mu}{2} + \frac{\sigma^2}{2\mu}, S + 0.4\sigma\right)
  \]
  This prevents unrealistic passenger wait penalties on outer radial routes.

---

## 5. Cluster-Aware Uncertainty Audit

### 5.1 Bootstrap Design
- **Clusters**: 5 operational strata (`AM_PEAK`, `MIDDAY`, `PM_PEAK`, `OFF_PEAK`, `WEEKEND_PEAK`).
- **Resampling Scheme**: Block-cluster resampling with replacement over strata clusters ($B = 1,000$ iterations).
- **IID 95% Confidence Interval**: $[4.15, 5.30]$ minutes (Width: $1.15$ minutes).
- **Cluster-Aware 95% Confidence Interval**: $[2.74, 6.70]$ minutes (Width: $3.96$ minutes).

### 5.2 Methodological Correction
- **Reported Ratio**: $\frac{3.96}{1.15} = 3.443\times$.
- **Finding**: In Phase 14 documentation, this $3.44\times$ multiplier was colloquially referred to as "variance inflation". In formal transport econometrics, the ratio of confidence interval widths is an **Interval-Width Ratio (Standard Error Inflation Factor)**, not a variance ratio!
- **True Variance Ratio**: $\text{VIF} = (\text{SEIF})^2 = 3.443^2 \approx 11.85\times$.
- **Correction**: All Phase 15 documentation and code comments explicitly distinguish between the Interval-Width Ratio ($3.44\times$) and the underlying empirical Variance Inflation Factor ($11.8\times$).

---

## 6. Origin-Destination (OD) Matrix & Screenline Audit

### 6.1 Calibration vs Independent Validation Separation
Phase 14 reported that all 8 strategic screenlines achieved $\text{GEH} < 5.0$.
- **Screenline Count Provenance**: RITES 16-Hour Classified Cordon & Screenline Surveys (2018–2021).
- **Finding**: The Doubly-Constrained Furness IPF balancing procedure utilized cordon count targets that encompassed all 8 corridors during model tuning.
- **Methodological Standard**: According to UK Department for Transport (DfT) Design Manual for Roads and Bridges (DMRB Volume 12) and US Federal Highway Administration (FHWA Travel Model Validation Manual):
  - A $\text{GEH} < 5.0$ threshold in $\ge 85\%$ of screenlines indicates good calibration fit.
  - However, testing the model on the *exact same* screenlines used in balancing measures **in-sample goodness-of-fit**, NOT independent predictive validity.
- **Phase 15 Holdout Partition**:
  - **Calibration Set (4 Screenlines)**: `SCR-01` Outer Ring Road, `SCR-02` NH48 Gurugram, `SCR-03` Ring Road AIIMS, `SCR-04` Vikas Marg ITO.
  - **Independent Holdout Set (4 Screenlines)**: `SCR-05` GT Karnal Road, `SCR-06` Mathura Road Badarpur, `SCR-07` Rohtak Road Tikri, `SCR-08` Mehrauli-Badarpur Road.

---

## 7. Machine Learning Generalization Audit

### 7.1 Target Variable Disclosure
Phase 14 reported holdout errors:
- MAE: 1.21%
- RMSE: 1.52%
- sMAPE: 2.20%
- $R^2$: 0.977
- PICP-95: 95.6%
- MPIW: 6.20%

**Audit Clarification**:
- The target variable $y_i$ is **Bus Passenger Crowding Load Percentage** ($\text{crowding\_load} \in [0, 100]\%$) derived from electronic ticketing and inferred passenger load.
- These error metrics are **percentage points of passenger crowding capacity**, NOT minutes of vehicle travel time.
- The geographic holdout evaluation was conducted on $N=500$ unseen samples across Outer Ring Road West and GT Road North, confirming zero data leakage from training corridors.

---

## 8. Ethics & Institutional Review Board (IRB) Audit

### 8.1 Findings on `IRB-2026-NEXBUS-MOB-004`
- **Origin**: Created during Phase 12 as an internal research ethics protocol and tracking code.
- **Accreditation**: No formal accreditation letter or independent Institutional Review Board committee charter is on file from an external statutory authority.
- **Rectification**: To maintain uncompromising institutional integrity:
  - NEXBUS does not claim accredited third-party IRB certification.
  - `ETHICS_APPROVAL_STATUS` is formally set to:
    ```ts
    ETHICS_APPROVAL_STATUS = 'PENDING' | 'UNVERIFIED'
    ```
  - The fieldwork protocol is held in:
    ```ts
    FIELDWORK_EXECUTION_STATUS = 'READY_FOR_FIELDWORK' | 'BLOCKED_PENDING_AUTHORIZATION'
    ```
  - Full execution requires documentary sign-off as defined in the Phase 15 Authorization Checklist.

---

## 9. Non-Negotiable Operational Safety Invariant

As always, NEXBUS operates strictly under:
```
READ-ONLY + PASSIVE + ADVISORY + NON-ACTUATING
```
No live dispatch instructions, signal preemption commands, or automated infrastructure controls may ever be issued by any component of this platform.
