# NEXBUS — Transit Authority & Municipal Pilot Guide

This guide describes how transport operators (DTC, DIMTS, GNCTD Transport Department) can leverage NEXBUS for network monitoring, corridor analysis, and policy simulation.

---

## 1. Executive Observatory (`/control`)

The Observatory consolidates empirical ridership telemetry and pipeline audit metrics:
- **Weekday vs Weekend Toggle:** Compares commuter distribution patterns.
- **Data Status Verification:** Every indicator displays its epistemological badge (`● OBSERVED`, `▲ ESTIMATED`, `◆ PREDICTED`, `★ HYPOTHETICAL`).
- **Telemetry Pipeline Audit:** Real-time sync rates for DTC AVL beacons (99.4%), GTFS-RT feed intervals (3.2s), and ETM transaction batch sync.

---

## 2. Generating & Exporting Reports

1. **Machine-Readable CSV Exports:**
   - Click **Export CSV** in the Observatory header or query `/api/analytics/export?type=corridors` to download corridor volume, frequency, and punctuality tables.
   - Query `/api/analytics/export?type=ml_validation` for complete ST-GNN error analysis by corridor.
   - Query `/api/analytics/export?type=hourly` for 24-hour load and boarding matrices.

2. **Official PDF Executive Briefing:**
   - Click **Print PDF Briefing** in the Observatory header.
   - The interface activates a specialized print stylesheet hiding navigation bars and formatting tables with official citations, data provenance metadata, and model limitations for executive briefings.

---

## 3. Running Policy Simulations (`/simulate`)

1. **Select Corridor:** Choose the target arterial corridor (e.g. *Mahatma Gandhi Ring Road*).
2. **Configure Interventions:**
   - **Additional Electric Buses:** Increase or decrease proposed fleet additions.
   - **Target Headway:** Compress peak headways (e.g. 12 min down to 6 min).
   - **Transit Signal Priority (TSP):** Toggle green light extension at key intersections.
3. **Inspect Consequences:**
   - View 3D split-screen visual comparison: **Scenario A (Baseline)** vs **Scenario B (Proposed)**.
   - Review platform wait time reduction, unallocated demand relief, and monthly avoided tailpipe $\text{CO}_2$ tonnage.
   - Audit parametric sensitivity tables to observe outcome sensitivity to commuter elasticity and depot turnaround rates.
