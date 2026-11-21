# NEXBUS Phase 24 — Data Provenance & Trust Explainability Audit

**Component:** `src/components/ui/ProvenanceIndicator.tsx`  
**Classification Standard:** 9-Tier Evidence Classification & 6-Tier Freshness Status  
**Audit Date:** November 21, 2026

---

## 1. Transparency as an Engineering Ethic

In urban mobility analytics, presenting synthetic estimates alongside sensor measurements without clear labeling destroys institutional trust. NEXBUS systematically tags every metric with its **Evidence Provenance Tier** and **Freshness Status**.

In Phase 24, each classification was augmented with a **`plainLabel`** and a **`childLabel`** to ensure that everyone from a grade-school student to a World Bank transport auditor understands the source and limitations of every data point.

---

## 2. The 9-Tier Evidence Provenance Classification

| Tier ID | Technical Tier Name | Commuter Plain Label | Child-Friendly Label | Description |
| :--- | :--- | :--- | :--- | :--- |
| `L1_SYNTHETIC` | Level 1: Synthetic Simulation | Computer Model Estimate | Made by Computer | Calculated by our math equations when no sensor exists. |
| `L2_HEURISTIC` | Level 2: Engineering Heuristic | Rule-of-Thumb Estimate | Smart Guess | Estimated using established urban planning rules. |
| `L3_HISTORICAL` | Level 3: Historical Aggregate | Past Travel History | Yesterday's Numbers | Based on average records collected over past months. |
| `L4_BENCHMARK` | Level 4: Calibrated Benchmark | Tested City Standard | Checked with Official Books | Matched against official Delhi transit survey tables. |
| `L5_CROSS_VALIDATED`| Level 5: Cross-Validated Model | Double-Checked Model | Checked Twice | Verified by comparing two independent calculations. |
| `L6_OBSERVED_SAMPLE`| Level 6: Sampled Field Observation| Real Field Sample | Counted in Real Life | Directly recorded at real bus stops during field studies. |
| `L7_HYBRID` | Level 7: Telemetry-Calibrated Hybrid| Sensor-Tuned Estimate | Real Sensors + Model | Combines live bus GPS breadcrumbs with timetable models. |
| `L8_AUDITED` | Level 8: Third-Party Audited | Officially Audited Data | Approved by Experts | Independently inspected and verified by transit authorities. |
| `L9_GROUND_TRUTH` | Level 9: Real-World Sensor Truth | Real Live Sensor Reading | Live Physical Sensor | Direct reading from physical vehicle onboard unit or sensor. |

---

## 3. The 6-Tier Data Freshness Status

| Freshness Status | Plain-Language Label | Color Indicator | Max Age Threshold | Operational Meaning |
| :--- | :--- | :--- | :--- | :--- |
| `FRESH` | Just Updated | Emerald (`#10b981`) | $< 5\text{ minutes}$ | Data represents current operational state. |
| `AGING` | Updated Recently | Amber (`#f59e0b`) | $5 - 30\text{ minutes}$ | Slightly delayed; still reliable for general planning. |
| `STALE` | Older Data | Orange (`#f97316`) | $30 - 120\text{ minutes}$ | Delayed; advisory estimates may differ from actuals. |
| `EXPIRED` | Needs Refresh | Red (`#ef4444`) | $> 120\text{ minutes}$ | Feed has disconnected; fallback models active. |
| `UNKNOWN` | Time Unknown | Zinc (`#71717a`) | N/A | Timestamp missing from upstream feed. |
| `UNAVAILABLE` | Signal Disconnected | Slate (`#64748b`) | N/A | Sensor offline or undergoing depot maintenance. |
