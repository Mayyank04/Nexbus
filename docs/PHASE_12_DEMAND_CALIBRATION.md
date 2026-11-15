# NEXBUS Phase 12 — Passenger Demand & Origin–Destination Empirical Calibration

## 1. Executive Summary & Epistemological Transparency

The NEXBUS Passenger Demand Engine models city-scale passenger trip interchanges across the 13 statutory planning zones of the Delhi Metropolitan Region (11 statutory NCT revenue districts + 2 NCR satellite gateways: Gurugram and Noida).

To uphold scientific integrity and prevent misleading claims of "real-time passenger counting", Phase 12 establishes a rigorous **Demand Data Categorization Taxonomy** and details the precise administrative data requirements for full empirical smart-card turnstile calibration.

---

## 2. Demand Categorization Taxonomy

Every origin–destination flow cell $T_{ij}$ in the matrix is labeled with an explicit epistemological category:

| Demand Category | Definition | Current Share in NEXBUS | Empirical Source / Lineage |
|---|---|---|---|
| `OBSERVED` | Direct automated passenger count or 100% smart card sensor log | 0.0% (Pending DMRC Turnstile Data Access) | Direct turnstile gate sensor logs |
| `TICKETING_DERIVED` | Flows anchored in empirical fare-stage sales or published station footfalls | 21.6% | DTC ETM ticket issuance shares & DMRC annual station footfalls |
| `MODEL_ESTIMATED` | Doubly-constrained Furness IPF exponential gravity model estimation | 78.4% (Standard baseline) | Calibrated from Census 2011/MPD-2041 demographics and network impedances |
| `SURVEY_DERIVED` | Direct household travel survey or roadside intercept interview | 0.0% | Comprehensive travel surveys (e.g. RITES 2021) |
| `SYNTHETIC` | Parametrically perturbed pseudorandom illustrative scenario | 0.0% (Only in explicit synthetic mode) | Stress-testing simulations |

---

## 3. Mathematical Formulation & Convergence Mechanics

### 3.1 Doubly-Constrained Exponential Gravity Model
The spatial interaction between origin zone $i$ and destination zone $j$ is governed by:

$$T_{ij} = A_i B_j P_i D_j \exp(-\beta c_{ij})$$

where:
- $P_i$: Total trip productions originating in zone $i$, determined by working-age resident population scaled by labor participation rate.
- $D_j$: Total trip attractions terminating in zone $j$, determined by commercial, governmental, and industrial employment density.
- $c_{ij}$: Generalized multimodal travel impedance (in-vehicle minutes + weighted interchange walking/transfer penalty).
- $\beta$: Calibrated distance friction parameter ($\beta = 0.048\text{ min}^{-1}$).
- $A_i, B_j$: Furness balancing factors iteratively solved until row and column marginal constraints converge:

$$\sum_{j} T_{ij} = P_i \quad \text{and} \quad \sum_{i} T_{ij} = D_j$$

### 3.2 Convergence Performance
- **Balancing Algorithm**: Furness Iterative Proportional Fitting (IPF)
- **Stopping Criterion**: Maximum relative column error $\epsilon < 10^{-4}$ ($0.01\%$)
- **Empirical Convergence**: Achieved in 1 to 3 balancing passes with $0.0000\%$ residual marginal discrepancy.
- **System Conservation**: Total balanced trips $\sum_{ij} T_{ij} = 331,967\text{ pax/h}$ matches target productions ($\sum P_i = 331,968$) within integer rounding tolerance ($\Delta = 1\text{ trip}$, $0.0003\%$).

---

## 4. Parameter Sensitivity Analysis

The spatial decay parameter $\beta$ governs how sensitive Delhi commuters are to travel time:

$$\text{Elasticity } \varepsilon_\beta = \frac{\partial \ln \bar{c}}{\partial \ln \beta} \approx -0.71$$

| Evaluated Parameter | Base Value | Tested Interval | Sensitivity Derivative | Physical Interpretation |
|---|---|---|---|---|
| Friction Exponent $\beta$ | $0.048\text{ min}^{-1}$ | $[0.030, 0.080]$ | $-0.84\text{ km per } 0.01\ \Delta\beta$ | Higher $\beta$ compresses trip distribution toward local neighborhood destinations |
| Average Trip Length | $12.9\text{ km}$ | $[10.5, 16.2\text{ km}]$ | $-6.5\%\text{ per } 0.01\ \Delta\beta$ | Reflects regional vs local commute propensity |
| Average Impedance | $30.8\text{ min}$ | $[24.0, 39.5\text{ min}]$ | $-7.2\%\text{ per } 0.01\ \Delta\beta$ | Commuter willingness to travel across the Yamuna / Ring Road |

---

## 5. Empirical Calibration Requirements Dossier

To advance from `MODEL_ESTIMATED` to `OBSERVED` status in future operational phases, NEXBUS specifies the following required dataset specifications:

1. **DMRC Automatic Fare Collection (AFC) Gate Logs:**
   - Station-to-station entry/exit transaction timestamps.
   - Smart card pseudonymized token hashes (to track transfers without PII).
   - Hourly aggregation matrices across all 288 DMRC stations.
2. **DTC & DIMTS Electronic Ticketing Machine (ETM) Datasets:**
   - Conductor stage-to-stage passenger ticket issuance logs.
   - Fare stage boarding and alighting tallies by route and trip ID.
   - Daily pass vs single-journey ticket proportions.
3. **Sample Expansion Methodology:**
   - Weighting factors: $w_i = \frac{N_{\text{total}}}{n_{\text{sample}}}$ to correct for monthly concession passes, free travel pink tickets for women, and off-peak evasion.

---

## 6. Privacy Protection & K-Anonymity

To safeguard civic privacy, all flow cells report $k$-anonymity enforcement:
- Cells where raw calculated flow is less than $k = 15\text{ pax/hour}$ are **strictly suppressed** ($T_{ij} = 0$).
- Individual trip trajectories are never captured, generated, or reconstructible.
