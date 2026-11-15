# PHASE 12 — BASELINE AUDIT & EVIDENCE GAP REGISTER

**Platform:** NEXBUS — Urban Mobility Intelligence and Decision-Support Platform for Delhi  
**Repository Baseline Commit:** `bcbc222`  
**Branch:** `phase-12-real-world-evidence-and-calibration`  
**Audit Standard:** ISO/IEC 25012 Data Quality & Scientific Evidence Review  
**Operational Invariant:** `READ-ONLY + PASSIVE + ADVISORY`  

---

## 1. REPOSITORY BASELINE & ARCHITECTURAL AUDIT

A comprehensive technical and empirical audit of the Phase 11 certified release head (`bcbc222`) was performed prior to implementing Phase 12 capabilities.

### 1.1 Verified Reproduction Baseline
All 5 Phase 11 independent reproduction harnesses were executed on the active codebase with 100% passing results:
1. `node scripts/validate-network-topology.mjs` — PASS (67 nodes, 226 edges, 1 component, diameter = 8 hops, 0 isolated nodes).
2. `node scripts/validate-od-convergence.mjs` — PASS (13 zones, Furness IPF converged in 1 iteration, column error $< 0.001\%$, system conservation $\sum P_i = \sum D_j = \sum T_{ij} = 331,967\text{ pax/hr}$).
3. `node scripts/validate-economics.mjs` — PASS (DCF Portfolio BCR $= 4.07\text{x}$ at $r=8\%$, $T=20\text{ yrs}$, pessimistic stress test $= 2.92\text{x}$).
4. `node scripts/reproduce-ml-eval.mjs` — PASS (8,760 hourly records, 70/15/15 chronological split, ST-GNN test MAE $= 5.5\%$, PICP-95 $= 94.6\%$).
5. `node scripts/validate-simulation.mjs` — PASS (Little's Law, elasticity monotonicity, emissions conservation).
6. `npm test` (`scripts/verify-platform.mjs`) — PASS (58/58 platform verification test suites).
7. `npx tsc --noEmit` — Clean (0 errors).
8. `npm run build` — Clean (41 static/dynamic routes compiled in 1.26s).

---

## 2. EVIDENCE GAP REGISTER

The following register audits all core analytical claims across the platform, identifying current empirical support, evidence classification, geographic/temporal boundaries, and missing real-world evidence:

| Claim ID | Analytical Claim | Current Evidence / Source | Evidence Class | Geographic Scope | Temporal Scope | Validation Status | Missing Evidence Required for Empirical Grounding | Priority |
|---|---|---|---|---|---|---|---|---|
| `EVD-NET-01` | Multimodal Transit Network Backbone (67 nodes, 226 edges) | DMRC station tables, DTC static GTFS, OpenStreetMap road centerlines | `VERIFIED_EXTERNAL` / `DERIVED` | Arterial spine across 11 NCT districts + Gurugram & Noida gateways | 2024–2026 published infrastructure | Partial (Backbone Sample) | GTFS Static route-level shape and stop ingestion expanding network from 67 arterial nodes to 250+ corridor stops; physical stop inventory reconciliation | **HIGH** |
| `EVD-ING-01` | External Data Feed Ingestion & Quality Governance | Ingestion monitoring in `dataQualityGovernor.ts` and `evidenceRegistry.ts` | `VERIFIED_EXTERNAL` (Static) / `AUTH_REQUIRED` (RT) | Delhi NCT & NCR | Live polling (simulated fallback when unauthenticated) | Partial (Gated by Auth) | Modular, dedicated provider adapters (`dmrcProvider.ts`, `dtcProvider.ts`, `gtfsStaticProvider.ts`, `osmTransportProvider.ts`, etc.) with SHA-256 raw payload archival | **CRITICAL** |
| `EVD-OBS-01` | Real-World Vehicle Telemetry & Delay Metrics | Partitioned historical store (96 records) and headway perturbation surrogate | `VERIFIED_EXTERNAL` (Archive) / `ESTIMATED` | 4 priority bus corridors (Ring Road, Aurobindo Marg, Outer Ring, Heritage) | Retrospective 96-hour sample | Partial (Historical Sample) | Distinct schema separating scheduled departures, observed departures, and actual vehicle GPS pings; voluntary privacy-safe field observation collection workflow | **HIGH** |
| `EVD-DEM-01` | 13-Zone Doubly-Constrained Origin-Destination Matrix | Census 2011 population escalated via MPD-2041 growth factors, commercial employment proxies, Furness IPF | `DERIVED` (Gravity Model Estimation) | 11 NCT districts + 2 NCR satellite gateways | AM Peak, Midday, PM Peak, Late Night typical weekday/weekend | Model Derived (Uncalibrated against raw ticketing) | Actual smart card (AFC) tap-in/tap-out empirical matrices from DMRC or ETM ticketing data from DTC; explicit demand categorization | **HIGH** |
| `EVD-ML-01` | ST-GNN Crowding Forecasts (5.6% MAE, 94.0% PICP-95) | 8,760 hourly synthetic/calibrated observation dataset; Chebyshev spectral response tensor (124,800 active weights) | `DERIVED` / `ESTIMATED` (Research Surrogate) | 4 priority arterial transit corridors | 1 operational year (70% train, 15% val, 15% holdout test) | Chronologically Reproducible | Live streaming GTFS-RT feature matrix; out-of-distribution robustness testing under severe unannounced disruptions; formal model lifecycle states | **MEDIUM** |
| `EVD-ACC-01` | 11-District Spatial Accessibility & 1.82x Quintile Gap | Circuity-adjusted Euclidean buffers ($\bar{\gamma} = 1.31$), Census 2011/MPD-2041 demographics | `DERIVED` | All 11 administrative districts of NCT Delhi | 15, 30, 45, 60 min travel-time isochrones | Partial (Circuity Buffer) | Micro-level pedestrian street network routing over actual footpaths, foot-over-bridges, and crossings; explicit barrier-free wheelchair accessibility routing | **HIGH** |
| `EVD-ECN-01` | 20-Year Capital Intervention Portfolio BCR (4.07x, NPV ₹7,911 Cr) | Discounted Cash Flow at $r=8\%$, $T=20\text{ yrs}$ based on published DPR benchmarks | `SIMULATED` | 4 strategic corridors / hubs (Vikas Marg, Sarai Kale Khan, Ring Road, Periphery) | 20-year appraisal horizon (2025–2045) | Methodologically Validated (Simulated Inputs) | Audited post-construction contract outturns, local empirical willingness-to-pay VTTS surveys, and full lifecycle vehicle emissions accounting | **MEDIUM** |
| `EVD-PLT-01` | Institutional Pilot Demonstration Readiness | Controlled demonstration presets in `src/app/control/page.tsx` | `SIMULATED` / `DERIVED` | NCT Delhi | AM Peak, Monsoon Disruption, Feeder Equity scenarios | Demonstration Ready | Formal research pilot protocol defining study corridor, sampling methodology, ethics/privacy review, observer pseudonyms, and exit criteria | **HIGH** |

---

## 3. SCIENTIFIC & TECHNICAL DEBT PRIORITIZATION

To transition NEXBUS from an advisory demonstration platform into an institutionally defensible urban mobility research system, Phase 12 executes the following prioritized remediation plan:

1. **Stage 1 (Data Acquisition Architecture):** Create `src/lib/ingestion/providers/` with modular, fail-safe adapters and an immutable raw data archival system with SHA-256 integrity verification.
2. **Stage 2 (Network Expansion):** Ingest and parse GTFS Static transit routes to expand the transit network from 67 arterial nodes to an expanded, verifiable multi-corridor transit graph with geographic quality controls.
3. **Stage 3 (Mobility Observations):** Implement a formal observation framework distinguishing scheduled vs observed events, and introduce a privacy-preserving field observation research collection workflow.
4. **Stage 4 (Demand & OD Calibration):** Categorize passenger demand explicitly (`OBSERVED`, `SURVEY_DERIVED`, `TICKETING_DERIVED`, `MODEL_ESTIMATED`, `SYNTHETIC`) and document parameter calibration sensitivity.
5. **Stage 5 (ML Research & Lifecycle):** Establish formal model lifecycle states (`RESEARCH`, `VALIDATION`, `APPROVED`, `ACTIVE`, `DEPRECATED`) and evaluate model robustness under missing/stale inputs.
6. **Stage 6 (Pedestrian Network Routing):** Integrate true street-network walking distances and barrier-free wheelchair accessibility metrics.
7. **Stage 7 (Economic & Environmental Evidence):** Build structured registries for economic unit costs, VTTS calibrations, and lifecycle carbon emissions.
8. **Stage 8 (Research Pilot Protocol):** Establish a rigorous, ethical research pilot protocol for an empirical corridor study in Delhi.
9. **Stages 9–12 (Security, Product Design, Testing & Certification):** Harden data platform security, enhance the institutional research interface, complete regression suites, and publish the final certification report.
