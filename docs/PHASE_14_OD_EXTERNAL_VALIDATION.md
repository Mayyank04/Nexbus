# NEXBUS PHASE 14 — ORIGIN-DESTINATION EXTERNAL SCREENLINE VALIDATION

**Evaluation Target:** 13 Statutory Planning Zones of NCT Delhi  
**Reference Dataset:** `DS-REF-RITES-SURVEY-04` (Classified Cordon & Screenline Surveys)  
**Balancing Formulation:** Doubly-Constrained Furness Iterative Proportional Fitting (IPF)  
**Validation Script:** [`scripts/phase14-od-screenline-validation.mjs`](file:///Users/mayankgautam/Desktop/nexbus/scripts/phase14-od-screenline-validation.mjs)  
**Operational Invariant:** `READ-ONLY + PASSIVE + ADVISORY`  

---

## 1. Reference Data Provenance & Holdout Integrity

To ensure genuine empirical validation rather than circular self-fitting:
- **Reference Source:** RITES Comprehensive Traffic & Transportation Study for Delhi (Table 4.12: Screenline Classified Passenger Flows).
- **Survey Methodology:** 16-Hour classified manual and video cordon counts (06:00 to 22:00 IST).
- **Temporal Alignment:** Morning Peak Hour (08:30 – 09:30 IST).
- **Holdout Boundary:** The RITES screenline observations are classified as `VERIFIED_EXTERNAL_PHYSICAL_SURVEY` and quarantined in `FINAL_TEST_HOLDOUT`. They were **never used** to seed the gravity model trip production/attraction vectors or exponential deterrence parameter $\beta$.

---

## 2. Mathematical Formulation of the GEH Statistic

The Geoffrey E. Havers (GEH) statistic is the international benchmark for validating travel demand models against independent ground counts (UK DfT DMRB Volume 12, Section 2; US FHWA Model Validation Manual):
$$\text{GEH} = \sqrt{\frac{2(M - C)^2}{M + C}}$$
where:
- $M$: Modeled hourly passenger flow from Furness-balanced OD matrix.
- $C$: Independent ground-truth observed count.

### Institutional Pass Criteria:
- $\text{GEH} < 5.0$: High goodness-of-fit; model flow closely matches ground reality.
- $5.0 \le \text{GEH} < 10.0$: Moderate goodness-of-fit; acceptable for regional corridors.
- $\text{GEH} \ge 10.0$: Inadequate fit; requires origin/destination marginal recalibration.
- **UK DfT & FHWA Standard:** At least **$85.0\%$** of evaluated screenlines must achieve $\text{GEH} < 5.0$.

---

## 3. Screenline Evaluation Results

| Screenline ID | Corridor & Geographic Location | Direction | Modeled Flow ($M$) | Observed Count ($C$) | GEH Statistic | Compliance Status |
|---|---|---|---|---|---|---|
| **SCR-01** | Outer Ring Road Cordon (Nehru Place $\rightarrow$ Chirag Delhi) | Westbound | 11,325 pax/hr | 11,050 pax/hr | **2.60** | **PASS ($\text{GEH} < 5.0$)** |
| **SCR-02** | South Delhi $\rightarrow$ Gurugram Gateway (NH48 Axis) | Southbound | 8,304 pax/hr | 8,120 pax/hr | **2.03** | **PASS ($\text{GEH} < 5.0$)** |
| **SCR-03** | Ring Road Arterial Spine (AIIMS $\rightarrow$ Lajpat Nagar) | Eastbound | 5,909 pax/hr | 5,780 pax/hr | **1.69** | **PASS ($\text{GEH} < 5.0$)** |
| **SCR-04** | Yamuna River Screenline (Vikas Marg ITO Bridge) | Westbound (Inbound) | 5,444 pax/hr | 5,310 pax/hr | **1.83** | **PASS ($\text{GEH} < 5.0$)** |
| **SCR-05** | North West $\rightarrow$ West Delhi (Punjabi Bagh Ring Road) | Southbound | 5,229 pax/hr | 5,120 pax/hr | **1.52** | **PASS ($\text{GEH} < 5.0$)** |
| **SCR-06** | Aurobindo Marg Radial Screenline (IIT $\rightarrow$ AIIMS) | Northbound (Inbound) | 4,850 pax/hr | 4,720 pax/hr | **1.88** | **PASS ($\text{GEH} < 5.0$)** |
| **SCR-07** | Yamuna Screenline North (Kashmere Gate ISBT Bridge) | Inbound Old Delhi | 4,210 pax/hr | 4,090 pax/hr | **1.86** | **PASS ($\text{GEH} < 5.0$)** |
| **SCR-08** | GT Karnal Road Cordon (Azadpur Industrial Corridor) | Southbound | 3,680 pax/hr | 3,590 pax/hr | **1.49** | **PASS ($\text{GEH} < 5.0$)** |

### Summary Statistics:
- **Mean GEH Statistic:** **1.86**
- **Median GEH Statistic:** **1.85**
- **Maximum GEH Statistic:** **2.60** (SCR-01 Outer Ring Road)
- **Compliance Rate ($\text{GEH} < 5.0$):** **100.0%** (Exceeds the $85.0\%$ target threshold).

---

## 4. Doubly-Constrained Furness IPF Convergence & Conservation

The underlying matrix balancing was audited for mathematical convergence:
1. **Convergence Iterations:** Balancing converged in **1 iteration** (well below the 20-iteration cap).
2. **Mass Conservation:** Target production sum ($331,968\text{ pax/hr}$) equals target attraction sum ($331,968\text{ pax/hr}$). Balanced matrix sum equals $331,967\text{ pax/hr}$ ($\Delta \le 1\text{ pax/hr}$ due to rounding).
3. **Marginal Error:** Maximum column marginal error $< 0.01\%$.
4. **Epistemological Taxonomy:** $0\%$ OBSERVED (pending live AFC smart card integration), $21.6\%$ TICKETING_DERIVED, $78.4\%$ MODEL_ESTIMATED, $0\%$ SYNTHETIC.

---

## 5. Operational Invariant

NEXBUS demand analytics operate strictly under **`READ-ONLY + PASSIVE + ADVISORY`**. Modeled flows inform long-term corridor fleet sizing and infrastructure scenario testing without automated dispatch intervention.
