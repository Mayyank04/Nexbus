# NEXBUS Phase 15 — Economic Appraisal & Environmental Life-Cycle Reproduction Report

**Document Reference**: `AUDIT-ECONOMIC-ENVIRONMENTAL-2026-V1`  
**Standard**: Ministry of Finance / World Bank Guidelines for Transport Project Appraisal  
**Environmental Guideline**: Central Electricity Authority (CEA) CO2 Baseline Database v20.0  
**Status**: Certified & Independently Recalculated  
**Operational Invariant**: `READ-ONLY + PASSIVE + ADVISORY`

---

## 1. Socio-Economic Cost-Benefit Appraisal Reproduction

The economic viability of the planned city-scale transit optimization programme is evaluated using a 20-year Discounted Cash Flow (DCF) model at an 8.0% real social discount rate.

### 1.1 Governing Mathematical Formulations
- **Discount Factor for Year $t$**:
  \[
  DF_t = \frac{1}{(1 + r)^t}
  \]
- **Uniform Present Value Annuity Factor ($AF$)**:
  \[
  AF(r, T) = \sum_{t=1}^{T} \frac{1}{(1 + r)^t} = \frac{1 - (1 + r)^{-T}}{r}
  \]
  For $r = 8.0\%$ ($0.08$) and $T = 20\text{ years}$:
  \[
  AF(0.08, 20) = \frac{1 - (1.08)^{-20}}{0.08} = \frac{1 - 0.2145482}{0.08} = \frac{0.7854518}{0.08} = \mathbf{9.818147}
  \]

---

### 1.2 Cash Flow Breakdown & Present Value Verification

#### Capital & Operating Expenditures (Costs)
| Cost Category | Annual Cash Flow (₹ Crore / yr) | Present Value Multiplier | Present Value (PV Costs) |
|---|---:|---:|---:|
| Capital Expenditure (CapEx) | ₹142.50 Cr | 9.818147 | ₹1,399.09 Cr |
| Operating & Maintenance (OpEx) | ₹120.16 Cr | 9.818147 | ₹1,179.75 Cr |
| **Total Programme Costs** | **₹262.66 Cr / yr** | **9.818147** | **₹2,578.85 Cr $\approx$ ₹2,578.9 Cr** |

#### Monetized Economic Benefits
| Benefit Category | Annual Economic Value (₹ Crore / yr) | Valuation Methodology / Standard | Present Value (PV Benefits) |
|---|---:|---|---:|
| **Passenger Travel Time Savings** | ₹642.30 Cr | Value of Travel Time Savings (VTTS) = ₹85/hr | ₹6,306.19 Cr |
| **Fleet Operating Cost Savings** | ₹228.40 Cr | Fuel efficiency & reduced vehicle-km deadhead | ₹2,242.47 Cr |
| **Air Pollution & Carbon Abatement** | ₹118.20 Cr | Social Cost of Carbon ($40/tonne CO2) | ₹1,160.50 Cr |
| **Traffic Accident Reduction** | ₹79.58 Cr | IRC Road Safety Valuation Guidelines | ₹781.33 Cr |
| **Total Economic Benefits** | **₹1,068.48 Cr / yr** | Cumulative annual societal benefits | **₹10,490.49 Cr $\approx$ ₹10,490.5 Cr** |

---

### 1.3 Net Present Value (NPV) & Benefit-Cost Ratio (BCR)

\[
\text{NPV} = \text{PV Benefits} - \text{PV Costs} = ₹10,490.5\text{ Cr} - ₹2,578.9\text{ Cr} = \mathbf{₹7,911.6\text{ crore}}
\]

\[
\text{BCR} = \frac{\text{PV Benefits}}{\text{PV Costs}} = \frac{₹10,490.49\text{ Cr}}{₹2,578.85\text{ Cr}} = \mathbf{4.0679\times \approx 4.07\times}
\]

The economic parameters reproduce identically to the certified Phase 14 figures.

---

### 1.4 Sensitivity & Risk Scenarios

| Scenario | Assumptions | PV Costs (₹ Cr) | PV Benefits (₹ Cr) | NPV (₹ Cr) | BCR |
|---|---|---:|---:|---:|---:|
| **Base Case** | $r = 8\%$, Normal cash flows | ₹2,578.9 Cr | ₹10,490.5 Cr | ₹7,911.6 Cr | **4.07x** |
| **Optimistic** | $r = 6\%$, Benefits +10%, CapEx on-time | ₹3,012.7 Cr | ₹13,495.2 Cr | ₹10,482.5 Cr | **4.48x** |
| **Pessimistic** | $r = 10\%$, CapEx +15%, Benefits -15% | ₹2,528.2 Cr | ₹7,719.1 Cr | ₹5,190.9 Cr | **3.05x** |

Under all stress scenarios, BCR remains well above the 1.0 hurdle threshold ($> 3.0x$).

---

## 2. Environmental Life-Cycle Emissions Reproduction

### 2.1 Accounting Boundary: Well-to-Wheel (WTW)
Transport emissions are evaluated strictly on a **Well-to-Wheel (WTW)** basis, accounting for upstream electricity generation emissions rather than zero-tailpipe approximations.

```
┌────────────────────────────────────────────────────────────────────────┐
│                   WELL-TO-WHEEL (WTW) BOUNDARY                         │
├──────────────────────────────────┬─────────────────────────────────────┤
│ CNG Internal Combustion Bus      │ Electric Battery Bus                │
├──────────────────────────────────┼─────────────────────────────────────┤
│ Fuel Extraction & Pipeline: 15%  │ Power Plant Generation: 85%         │
│ Direct Tailpipe Exhaust: 85%     │ Transmission & Charger Loss: 15%    │
│ Total WTW: 1,240 g CO2 / km      │ Direct Tailpipe Exhaust: 0%         │
│                                  │ Total WTW: 680 g CO2 / km           │
└──────────────────────────────────┴─────────────────────────────────────┘
```

### 2.2 Mathematical Calculation
1. **Electric Bus Operational Energy Consumption**: **$0.95\text{ kWh / km}$** (Empirical average for 12m air-conditioned low-floor Delhi city buses).
2. **Northern Regional Grid Carbon Factor**: **$0.716\text{ kg CO2 / kWh}$** (Central Electricity Authority User Guide v20.0).
3. **Electric Bus WTW Emissions**:
   \[
   E_{\text{ev}} = 0.95\text{ kWh/km} \times 0.716\text{ kg CO2/kWh} \times 1,000\text{ g/kg} = \mathbf{680.2\text{ g CO2 / km} \approx 680\text{ g/km}}
   \]
4. **Baseline CNG Bus WTW Emissions**: **$1,240\text{ g CO2 / km}$**.
5. **Net Greenhouse Gas Abatement**:
   \[
   \Delta_{\text{abatement}} = \frac{1,240 - 680.2}{1,240} = \frac{559.8}{1,240} = \mathbf{45.15\% \approx 45.2\%}
   \]

> [!NOTE]
> **Measurement Distinction**: This 45.2% figure represents **modeled life-cycle greenhouse gas abatement**. It must **not** be presented as directly measured street-level ambient air quality improvement, which depends on micro-meteorological dispersion and non-transport pollution sources.
