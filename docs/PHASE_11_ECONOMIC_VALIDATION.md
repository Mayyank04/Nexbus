# PHASE 11 — TRANSPORT ECONOMICS & COST-BENEFIT VALIDATION

**Platform:** NEXBUS — Urban Mobility Intelligence & Decision-Support Platform  
**Target Region:** National Capital Territory of Delhi (NCT) & Satellite Corridors  
**Appraisal Standard:** Social Cost-Benefit Analysis (SCBA) & Transport Appraisal Framework (IRC / World Bank)  
**Classification:** Counterfactual Scenario Modeling (`SIMULATED` / `DERIVED`)  
**Operational Invariant:** `READ-ONLY + PASSIVE + ADVISORY`  

---

## 1. MATHEMATICAL FORMULATION: PORTFOLIO BCR RECONSTRUCTION

> [!CAUTION]
> **CORRECTION OF PORTFOLIO BCR AGGREGATION:**  
> Previous platform milestones reported an aggregate 20-year BCR calculated as an unweighted arithmetic mean of individual ratios ($\frac{1}{n} \sum_{i=1}^n \text{BCR}_i$).  
>  
> In transport economics and public finance, averaging benefit-cost ratios is mathematically invalid: it assigns equal weight to a small ₹50 Cr intervention and a massive ₹1,000 Cr project, severely distorting capital prioritization.  
>  
> Phase 11 replaces ratio averaging with true discounted cash flow (DCF) aggregation:
> $$\text{Portfolio BCR} = \frac{\sum_{i=1}^n \text{PV}(\text{Benefits}_i)}{\sum_{i=1}^n \text{PV}(\text{Costs}_i)}$$

### Discounting & Time Horizon Parameters
- **Social Discount Rate ($r$):** $8.0\%$ per annum (conforming to Ministry of Finance guidelines for Indian infrastructure projects).
- **Project Appraisal Lifespan ($T$):** $20\text{ years}$.
- **Uniform Present Worth Annuity Factor ($\text{AF}$):**
  $$\text{AF}(r=0.08, T=20) = \frac{1 - (1 + r)^{-T}}{r} = \frac{1 - 1.08^{-20}}{0.08} = 9.8181$$
- **Present Value of Costs:**
  $$\text{PV}(\text{Costs}_i) = \text{CAPEX}_i + \text{OPEX}_{i, \text{annual}} \times 9.8181$$
- **Present Value of Social Benefits:**
  $$\text{PV}(\text{Benefits}_i) = \text{BCR}_i \times \text{PV}(\text{Costs}_i)$$

---

## 2. SOCIAL WELFARE PARAMETERS & VALUATION

The economic appraisal applies welfare valuations calibrated to NCT of Delhi socio-economic demographics:

1. **Value of Travel Time Savings (VTTS):**
   - *Commuting / Work Trips:* $₹150\text{ / passenger-hour}$ (calibrated to mean hourly income of Delhi working population).
   - *Non-Work / Social Trips:* $₹75\text{ / passenger-hour}$ ($50\%$ of work travel time valuation).
2. **Transfer Friction Penalty:**
   - Transfer walking time is weighted at $1.5\times$ in-vehicle travel time.
   - Unreliable waiting time is weighted at $2.0\times$ in-vehicle travel time.
3. **Shadow Price of Carbon Abatement:**
   - *Baseline Social Cost of Carbon:* $₹1,800\text{ / metric tonne }\text{CO}_2$ ($~\$22/\text{tCO}_2$).
   - *High-Ambition Climate Priority:* $₹3,500\text{ / metric tonne }\text{CO}_2$ ($~\$42/\text{tCO}_2$).
4. **Local Air Pollutant Abatement (PM2.5 / NOx):**
   - Health co-benefit valuation: $₹420\text{ / avoided private vehicle kilometre}$.

---

## 3. FOUR PRIORITY CAPITAL INTERVENTIONS APPRAISAL

The four counterfactual interventions (`src/lib/simulation/scenarioPlanningService.ts`) were systematically audited:

| Intervention | CAPEX (₹ Cr) | OPEX (₹ Cr/yr) | 20-Yr PV Cost (₹ Cr) | Individual BCR | 20-Yr PV Benefit (₹ Cr) | Net Present Value (₹ Cr) |
|---|---|---|---|---|---|---|
| **1. Vikas Marg Dedicated BRT** | 420.0 | 28.5 | 699.8 | 3.42x | 2,393.4 | +1,693.6 |
| **2. Sarai Kale Khan Skywalk & Concourse** | 280.0 | 12.0 | 397.8 | 4.15x | 1,650.9 | +1,253.1 |
| **3. Headway Synchronization** | 95.0 | 45.0 | 536.8 | 3.88x | 2,082.8 | +1,546.0 |
| **4. Peripheral Feeder Fleet (500 EVs)** | 375.0 | 58.0 | 944.5 | 4.62x | 4,363.4 | +3,418.9 |
| **COMPLETE COMBINED PORTFOLIO** | **1,170.0** | **143.5** | **2,578.9** | **4.07x** | **10,490.5** | **+7,911.6** |

**Audited Portfolio BCR:** **4.07x** (Net Present Value = ₹7,911.6 Crores over 20 years).

---

## 4. PARAMETRIC SENSITIVITY STRESS TESTING

To evaluate resilience against macroeconomic shocks, construction delays, and demand shortfalls, the scenario engine executes 4 parametric sensitivity stress tests:

| Scenario | Assumptions | PV Costs (₹ Cr) | PV Benefits (₹ Cr) | Sensitivity BCR | NPV (₹ Cr) | Viability Assessment |
|---|---|---|---|---|---|---|
| **Base Case** | Nominal CAPEX, $r=8\%$, on-time delivery | 2,578.9 | 10,490.5 | **4.07x** | +7,911.6 | Highly Viable |
| **Pessimistic Stress Test** | $+25\%$ CAPEX Overrun, $-20\%$ Demand Realization | 2,871.4 | 8,392.4 | **2.92x** | +5,521.0 | Robustly Positive ($>1.0$) |
| **Optimistic Mode Shift** | $+15\%$ Transit Diversion, On-Budget Delivery | 2,578.9 | 12,064.1 | **4.68x** | +9,485.2 | Maximum Benefit |
| **Climate Priority** | Shadow Price of Carbon @ ₹3,500/tonne | 2,578.9 | 10,658.3 | **4.13x** | +8,079.4 | Elevated Environmental Return |

Even under the severe pessimistic stress test ($+25\%$ capital cost overrun and $-20\%$ demand failure), the composite portfolio maintains a BCR of **2.92x**, demonstrating that the proposed multimodal interventions provide robust social returns under uncertain execution conditions.

---

## 5. DOUBLE-COUNTING AVOIDANCE AUDIT

The economic evaluation methodology incorporates strict safeguards against double-counting:
1. **Modal Shift Isolation:** Commuter travel time savings and operating cost savings are calculated only on diverted vehicle kilometers, without double-crediting road space clearance as direct passenger utility.
2. **Decoupled Carbon Accounting:** Greenhouse gas abatement credits are derived strictly from avoided tailpipe combustion; upstream grid emissions from electric bus charging are netted out.
3. **No Dual Infrastructure Attribution:** Time savings from BRT right-of-way and metro headway synchronization along overlapping corridors (e.g. Anand Vihar) are subject to a non-linear diminishing returns dampening factor ($\delta = 0.85$).
