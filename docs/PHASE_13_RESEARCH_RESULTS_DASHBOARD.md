# NEXBUS Phase 13 — Institutional Research Results Dashboard

**Phase:** Phase 13 — Independent Field Evidence Verification, Statistical Validation & Research Pilot Execution  
**Frontend Component:** `src/components/research/Phase13ResearchDashboard.tsx`  
**Host Route:** `src/app/control/page.tsx` (`/control` — Institutional Control & Analytics Center)  
**Design Standards:** Minimalist Institutional Typography, High Information Density, Zero Garish Gradients  
**Operational Invariant:** READ-ONLY + PASSIVE + ADVISORY  

---

## 1. Overview & Interface Architecture

The Phase 13 Institutional Research Dashboard provides transport planners, policy analysts, and independent auditors with a unified console to explore the empirical validation results and scientific findings across the Delhi transit network.

```
┌────────────────────────────────────────────────────────────────────────┐
│  PHASE 13 / INDEPENDENT FIELD EVIDENCE & SCIENTIFIC VALIDATION CONSOLE │
│  Urban Mobility Research & Empirical Calibration Intelligence          │
└────────────────────────────────────────────────────────────────────────┘
  │
  ├── [SAFETY INVARIANT] READ-ONLY + PASSIVE + ADVISORY (Enforced)
  │
  ├── [KPI RIBBON] MAE: 4.88m | PTI: 1.55x | Cv: 0.34 | EWT: 21.3s | GEH: 100% | Gini: 0.29
  │
  └── [INTERACTIVE TAB EXPLORER]
      ├── Tab 1: Journey-Time & Headway Reliability (P10-P95, Bootstrap CI, Rail vs Bus)
      ├── Tab 2: Interchange Friction Index (15 Hubs, Walk, Levels, Crossings, IFI)
      ├── Tab 3: OD Gravity & Screenline GEH Fit (Furness IPF, GEH < 5.0, Desire Lines)
      └── Tab 4: Universal Accessibility & Circuity (General, Wheelchair, Senior, Deserts)
```

---

## 2. Component Design & Features

### 2.1 Live Validation Metric Ribbon
Six top-level metrics give immediate insight into empirical platform health:
- **Journey Time MAE:** $4.88\text{ minutes}$ (Median $P_{50} = 35.2\text{ min}$, $\text{RMSE} = 6.78\text{ min}$).
- **Planning Time Index:** $1.55\times$ (Buffer Index: $30.7\%$).
- **Headway Regularity ($C_v$):** $0.34$ on Aurobindo Marg (Pearson correlation $r = 0.88$).
- **Excess Waiting Time (EWT):** $21.3\text{ seconds}$ ($+11.5\%$ wait penalty under Poisson commuter arrivals).
- **Screenline GEH Fit:** $100.0\%$ of critical arterial links achieve $\text{GEH} < 5.0$.
- **Spatial Equity Gini:** $0.29$ with network circuity factor $\gamma = 1.31$.

### 2.2 Tab 1: Journey-Time & Headway Reliability
- Visualizes the empirical travel time percentiles along the Aurobindo Marg axis ($14.2\text{ km}$):
  * $P_{10} = 30.4\text{ min}$, $P_{50} = 35.2\text{ min}$, $P_{90} = 44.9\text{ min}$, $P_{95} = 47.3\text{ min}$.
  * Displays the 1,000-iteration non-parametric Bootstrap 95% credible interval ($[35.45, 36.86]\text{ min}$).
- Multimodal comparison table contrasting DMRC Yellow Line Metro ($C_v = 0.12, \text{EWT} = 1.4\text{ s}$) against surface bus corridors ($C_v \approx 0.34 - 0.37$).

### 2.3 Tab 2: Interchange Friction Index (IFI) Deconstruction
- Surfaces all 15 multimodal transit hubs in Delhi.
- Deconstructs physical survey measurements:
  * Walking Distance ($D_{\text{walk}}$)
  * Vertical Level Changes ($L_{\text{vert}}$)
  * Street Crossings ($F_{\text{cross}}$)
  * Weather-covered walkway flag ($\mathbb{I}_{\text{covered}}$)
- Computes $\text{IFI}_{\text{raw}}$ and scaled Friction Score ($0 - 100$) with assigned service grades (A through E).

### 2.4 Tab 3: Origin-Destination Gravity & GEH Fit
- Details the doubly-constrained Furness IPF balancing convergence across the 13 statutory planning zones.
- Displays top morning peak desire lines with modeled hourly passenger flows ($M$), calibrated benchmark counts ($C$), and calculated GEH statistics confirming $100.0\%$ compliance ($\text{GEH} < 5.0$).

### 2.5 Tab 4: Universal Accessibility & Circuity
- Compares population transit coverage across General Pedestrian ($69.8\%$), Wheelchair Accessible ($43.2\%$), and Senior Commuter ($59.4\%$) mobility profiles.
- Outlines the 6 designated transit deserts and specific first/last-mile feeder interventions.

---

## 3. Operational Safety Invariant

The research dashboard is visually stamped and programmatically constrained to:

$$\mathbf{READ\text{-}ONLY} + \mathbf{PASSIVE} + \mathbf{ADVISORY}$$

It displays empirical research observations, validated models, and diagnostic statistics without offering any controls to manipulate physical infrastructure, alter bus schedules, or dispatch transit vehicles.
