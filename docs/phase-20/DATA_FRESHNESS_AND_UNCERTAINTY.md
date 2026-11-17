# NEXBUS PHASE 20 — DATA FRESHNESS, STALENESS & UNCERTAINTY GOVERNANCE

**Standard:** NEXBUS Phase 20 Freshness Specification  
**Implementation:** `src/lib/evidence/evidenceClassification.ts`  
**Safety Invariant:** `READ-ONLY + PASSIVE + ADVISORY`

---

## 1. THE SIX FRESHNESS STATES

Data freshness in NEXBUS is never treated as a binary "live vs dead" toggle. Datasets age according to their physical and operational collection cycles. Every dataset is evaluated into one of six states:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        NEXBUS FRESHNESS STATES                         │
├─────────────┬──────────────────────────────────────────────────────────┤
│ State       │ Definition & Operational Impact                          │
├─────────────┼──────────────────────────────────────────────────────────┤
│ FRESH       │ Data retrieved within normal expected interval. Active.  │
├─────────────┼──────────────────────────────────────────────────────────┤
│ AGING       │ Data exceeds nominal interval but remains analytically   │
│             │ valid with cautionary annotation.                        │
├─────────────┼──────────────────────────────────────────────────────────┤
│ STALE       │ Data exceeds reliability threshold. Displayed with       │
│             │ prominent staleness warning; automated fallbacks armed.  │
├─────────────┼──────────────────────────────────────────────────────────┤
│ EXPIRED     │ Data is obsolete. Real-time calculations suspend or fall │
│             │ back to historical schedule baselines.                   │
├─────────────┼──────────────────────────────────────────────────────────┤
│ UNKNOWN     │ Source provided no publication/collection timestamp.     │
│             │ Freshness cannot be fabricated.                          │
├─────────────┼──────────────────────────────────────────────────────────┤
│ UNAVAILABLE │ Upstream feed offline or disconnected. Telemetry paused. │
└─────────────┴──────────────────────────────────────────────────────────┘
```

---

## 2. CATEGORY-SPECIFIC FRESHNESS THRESHOLDS

Freshness thresholds are configured by dataset archetype rather than applying a blanket standard:

| Category | Archetype / Source | Fresh ($\le$) | Aging ($\le$) | Stale ($\le$) | Expired ($>$) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `REALTIME_TELEMETRY` | Bus GPS AVL, Headway Sensors | $30\text{ s}$ | $120\text{ s}$ (2m) | $600\text{ s}$ (10m) | $600\text{ s}$ |
| `HOURLY_INFERENCE` | ST-GNN Crowding Predictions | $3,600\text{ s}$ (1h) | $7,200\text{ s}$ (2h) | $14,400\text{ s}$ (4h)| $14,400\text{ s}$ |
| `DAILY_AGGREGATE` | ETM Depot Boarding Summaries | $86,400\text{ s}$ (1d)| $172,800\text{ s}$ (2d)| $604,800\text{ s}$ (7d)| $604,800\text{ s}$ |
| `SCHEDULE_STATIC` | GTFS Static Timetables | $60\text{ days}$ | $120\text{ days}$ | $180\text{ days}$ | $180\text{ days}$ |
| `RESEARCH_BENCHMARK` | RITES Household Travel Survey | $1\text{ year}$ | $2\text{ years}$ | $3\text{ years}$ | $3\text{ years}$ |
| `EMISSION_REGULATORY`| ARAI / CPCB Emission Factors | $2\text{ years}$ | $4\text{ years}$ | $6\text{ years}$ | $6\text{ years}$ |

---

## 3. ELIMINATION OF FABRICATED FRESHNESS METRICS

A pervasive flaw in civic dashboards is displaying artificial freshness indicators (e.g. displaying "Updated 2 seconds ago" based solely on when the browser polled an internal mock server).

### Audit & Corrections Enforced:
1. **No Client-Side Fabrication:** The `evaluateFreshness()` utility computes age strictly from the source timestamp:
   $$\text{Age} = \text{Date.now}() - \text{sourceTimestamp}$$
   If `sourceTimestamp` is missing or null, the function strictly returns `{ status: 'UNKNOWN', ageSeconds: null }`.
2. **Clock Skew & Future Timestamp Rejection:** In `sanitizeTimestamp()`, any timestamp located $> 5\text{ minutes}$ in the future is rejected with an explicit error:
   ```text
   Future timestamp detected beyond permissible clock skew (5m)
   ```
   Negative data ages (e.g. "-12 seconds ago") are strictly prohibited from rendering.

---

## 4. PREDICTIONS AND STATISTICAL UNCERTAINTY

Where the platform presents crowding predictions or travel time variance, it maintains strict statistical precision:

### 4.1 Bayesian Credible Intervals vs Confidence Intervals
- **ST-GNN Surrogate Predictions:** The platform displays a **$95\%$ Bayesian Credible Interval** derived from Gaussian Process regression surfaces over historical training windows:
  $$\hat{y} \pm 1.96 \cdot \sigma_{\text{Bayes}}$$
- **Empirical Coverage (PICP):** In independent holdout tests (`scripts/phase14-ml-independent-holdout.mjs`), this interval achieved a **Prediction Interval Coverage Probability ($\text{PICP}$) of $94.2\%$**, confirming calibrated uncertainty.
- **Plain-Language Communication:** The UI translates this as:
  *"$94\%$ Confidence: Bus load expected between $62\%$ and $74\%$."*
  It never claims absolute certainty.

---

## 5. CONCLUSION

By formalizing freshness contracts and uncertainty intervals, NEXBUS ensures commuters and analysts understand the exact temporal validity of transit data without misleading "real-time" illusions.
