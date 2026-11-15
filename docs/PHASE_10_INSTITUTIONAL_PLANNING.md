# NEXBUS — PHASE 10 INSTITUTIONAL SCENARIO PLANNING METHODOLOGY
**Document ID:** `DOC-P10-PLAN-001`  
**Milestone:** Phase 10 — Milestone 8 (`feat: add institutional scenario planning`)  
**Status:** Certified & Production Integrated  
**Operational Invariant:** Read-Only + Passive + Advisory (No physical actuation, official government project claims, or expenditure approvals)

---

## 1. Executive Summary & Purpose

The NEXBUS Phase 10 Institutional Scenario Planning Engine provides transport authorities, municipal bodies, and infrastructure financiers with an empirical decision-support platform to evaluate multi-year capital interventions across Delhi NCT.

Instead of evaluating infrastructure projects in isolation, the engine models system-wide network effects:
- Commuter travel-time reductions across competing transit modes.
- Friction elimination at multi-tier multimodal interchanges.
- Spatial population coverage expansion within 800m pedestrian walking catchments.
- Greenhouse gas (GHG) emissions offset ($\text{tCO}_2\text{e}$/yr) from diverted private vehicle kilometers.
- 20-year discounted Benefit-Cost Ratio (BCR) under an $8\%$ social discount rate.
- Distributional equity impacts assessing welfare gains across lower-income peripheral districts.

**Non-Negotiable Institutional Disclosure:**
> `ILLUSTRATIVE INTERVENTION — NOT AN APPROVED GOVERNMENT PROJECT. ADVISORY DECISION SUPPORT ONLY.`  
> All scenario projections are counterfactual research models designed for comparative analysis. NEXBUS does not represent the Government of NCT of Delhi, DMRC, DTC, or the Ministry of Housing and Urban Affairs (MoHUA).

---

## 2. Institutional Interventions Catalog

### 2.1 East-West Dedicated Bus Rapid Transit (BRT) Corridor (`intervention-brt-vikas-marg`)
- **Scope:** 14.2 km median busway from ITO Bridge to Anand Vihar ISBT across Vikas Marg.
- **Key Interventions:** Center-lane physical segregation, level platform boarding, off-board smart ticketing, and green-extension signal preemption at 11 cross-streets.
- **CAPEX:** ₹420.0 Cr | **Annual OPEX:** ₹28.5 Cr | **Implementation:** 24 Months
- **Impacts:** $-14.5$ min avg commuter travel time, $+340,000$ citizens within 800m catchment, $24,500\text{ tCO}_2\text{e}$/yr avoided, $\text{BCR} = 3.42\times$.
- **Primary Welfare Share:** East Delhi ($44\%$), Shahdara ($30\%$), Central Delhi ($26\%$).

### 2.2 Sarai Kale Khan Multimodal Elevated Concourse & RRTS Skywalk (`intervention-skywalk-sarai-kale-khan`)
- **Scope:** Climate-controlled multi-tier pedestrian concourse linking Hazrat Nizamuddin Railway Station, Pink Line Metro, and Delhi-Meerut Regional Rapid Transit System (RRTS).
- **Key Interventions:** 8 moving walkways, 12 escalators, direct turnstile interlocks, eliminating a 680m outdoor exposed conflict across arterial road ramps.
- **CAPEX:** ₹280.0 Cr | **Annual OPEX:** ₹12.0 Cr | **Implementation:** 18 Months
- **Impacts:** $-9.8$ min travel time, $-7.4$ min transfer penalty, $+120,000$ within 800m, $18,200\text{ tCO}_2\text{e}$/yr avoided, $\text{BCR} = 4.15\times$.
- **Primary Welfare Share:** South East Delhi ($42\%$), South Delhi ($32\%$), East Delhi ($26\%$).

### 2.3 Network-Wide Rapid Transit & Feeder Headway Synchronization (`intervention-headway-synchronization`)
- **Scope:** Automated timetable synchronization compressing DMRC Pink and Yellow line peak headways to 2.5 minutes with coordinated pulse feeder bus departures.
- **Key Interventions:** Dynamic transfer holds ($\le 90$ seconds) at major interchange nodes to capture arriving train passenger surges.
- **CAPEX:** ₹95.0 Cr | **Annual OPEX:** ₹45.0 Cr | **Implementation:** 8 Months
- **Impacts:** $-8.2$ min travel time, $-4.5$ min transfer penalty, $+210,000$ within 800m, $21,000\text{ tCO}_2\text{e}$/yr avoided, $\text{BCR} = 3.88\times$.
- **Primary Welfare Share:** Central Delhi ($35\%$), South Delhi ($35\%$), North Delhi ($30\%$).

### 2.4 Peripheral Transit Desert Feeder Fleet Deployment (`intervention-feeder-fleet-periphery`)
- **Scope:** 500 low-floor 9m air-conditioned electric mini-buses serving unorganized settlements across North West, North East, and South West Delhi peripheries.
- **Key Interventions:** High-frequency (5-min peak) feeder loops connecting Sangam Vihar, Burari, Narela, and Najafgarh directly to rapid transit trunk lines.
- **CAPEX:** ₹375.0 Cr | **Annual OPEX:** ₹58.0 Cr | **Implementation:** 12 Months
- **Impacts:** $-18.2$ min commuter travel time, $+780,000$ citizens within 800m catchment, $36,800\text{ tCO}_2\text{e}$/yr avoided, $\text{BCR} = 4.62\times$, Equity Score $96/100$.
- **Primary Welfare Share:** North West Delhi ($45\%$), North East Delhi ($32\%$), South West Delhi ($23\%$).

---

## 3. Mathematical Evaluation Formulations

### 3.1 Modal Shift Logit Formulation
Commuter probability of shifting from private motor vehicles (cars, two-wheelers) to enhanced public transport is modeled via multinomial logit:

$$P_{\text{transit}} = \frac{1}{1 + \exp\left(-\beta \cdot (\Delta C + \text{VOT} \cdot \Delta T)\right)}$$

Where:
- $\beta = 0.082$ (calibrated sensitivity coefficient for Delhi commuters).
- $\text{VOT} = \text{Value of Time}$ ($₹180/\text{hour}$ for peak arterial commuters).
- $\Delta T = \text{Door-to-door travel-time reduction}$ (in hours).
- $\Delta C = \text{Perceived out-of-pocket cost delta}$ (fuel, parking vs transit fare).

### 3.2 20-Year Discounted Benefit-Cost Ratio (BCR)
The economic Benefit-Cost Ratio evaluates the present value of societal benefits against lifecycle expenditures over a 20-year horizon:

$$\text{BCR} = \frac{\sum_{t=1}^{20} \frac{B_t}{(1 + r)^t}}{\text{CAPEX} + \sum_{t=1}^{20} \frac{\text{OPEX}_t}{(1 + r)^t}}$$

Where:
- $r = 0.08$ ($8\%$ standard social discount rate for Indian urban infrastructure projects).
- $B_t = \text{Annual economic benefits} = \text{TimeSavings} + \text{AccidentReduction} + \text{SocialCarbonValue} + \text{OperatingRelief}$.
- Social Cost of Carbon benchmarked at $₹3,200/\text{tonne CO}_2\text{e}$.

### 3.3 Multi-Criteria Decision Ranking
Interventions are prioritized using a weighted composite multi-criteria index:

$$\text{Score} = \left(0.40 \times \text{BCR} + 0.35 \times \frac{\text{Equity}}{100} \times 3.5 + 0.25 \times \frac{\Delta T_{\text{avg}}}{20} \times 2.5\right) \times 10$$

---

## 4. Cumulative Portfolio Analysis

When all four interventions are co-deployed:
- **Net Travel Time Reduction:** $-15.4$ min per commuter trip (incorporating non-linear network diminishing returns).
- **Net 800m Walking Expansion:** $+1,334,000$ residents brought into high-frequency transit catchments.
- **Annual GHG Abatement:** $95,475\text{ tonnes CO}_2\text{e}$/year avoided.
- **Total Portfolio CAPEX:** ₹1,170.0 Cr.
- **Annual Portfolio OPEX:** ₹143.5 Cr/yr.
- **Composite 20-Year BCR:** $4.02\times$.
- **Overall Spatial Equity Index:** $85 / 100$.

---

## 5. Non-Intervention Safety & Advisory Governance

NEXBUS functions strictly as an **advisory simulation tool**. It has no authority or interface to commit municipal budgets, sign procurement contracts, or alter physical transport infrastructure.
