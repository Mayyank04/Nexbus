# NEXBUS Phase 13 — Independent Research & Review Package

**Project:** NEXBUS — Urban Mobility Intelligence & Decision-Support Platform for Delhi  
**Phase:** Phase 13 — Independent Field Evidence Verification, Statistical Validation & Research Pilot Execution  
**Release Baseline:** `bd40a35` (Phase 12 Certified Release Head)  
**Lead Verification Consortium:** NEXBUS Independent Multidisciplinary Review & Transport Research Wing  
**Operational Invariant:** READ-ONLY + PASSIVE + ADVISORY  
**Date of Certification:** November 2026  

---

## 1. Executive Summary & Verification Purpose

This document constitutes the comprehensive, self-contained Independent Research and Review Package for NEXBUS Phase 13.

It enables third-party software auditors, transport research institutions, municipal authorities (DTC, DMRC, Transport Department GNCTD), and academic researchers to independently execute, audit, and reproduce every empirical claim, statistical metric, and architectural invariant of the platform.

### Core Scientific Standard:
$$\mathbf{Evidence\ before\ claims.\ Validation\ before\ certification.\ Reliability\ before\ expansion.}$$

---

## 2. One-Command Master Reproduction Sequence

To independently verify the entire NEXBUS platform, ensure the development server or test instance is running on port 3000, then execute:

```bash
# 1. Run Complete Automated Platform Test Suite (59 Test Suites)
npm test

# 2. Run Phase 13 Independent Domain Validation Suite
node scripts/audit-pilot-records.mjs
node scripts/validate-journey-time-observations.mjs
node scripts/validate-headway-reliability.mjs
node scripts/validate-interchange-observations.mjs
node scripts/validate-od-empirical-fit.mjs
node scripts/validate-ml-field-performance.mjs
node scripts/validate-accessibility-observations.mjs
node scripts/validate-economic-assumptions.mjs
node scripts/validate-environmental-claims.mjs

# 3. Static Type Verification & Production Build
npx tsc --noEmit
npm run build
```

---

## 3. Catalog of Independent Verification Scripts

Every script is fully self-contained, deterministically seeded, and returns exit code `0` on 100% assertion pass:

| Verification Script | Domain Evaluated | Key Assertions & Metrics Verified |
| :--- | :--- | :--- |
| `scripts/audit-pilot-records.mjs` | Field Record Provenance | 7-tier taxonomy, DEMONSTRATION_FIXTURE classification, Delhi geofence, 4-dec GPS truncation, 15s time quantization, SHA-256 match |
| `scripts/validate-journey-time-observations.mjs` | Journey-Time Reliability | MAE (4.88m), RMSE (6.78m), MAD (2.61m), P10/P50/P90/P95, Buffer Index (30.7%), PTI (1.55x), 1000-iter Bootstrap 95% CIs |
| `scripts/validate-headway-reliability.mjs` | Headway Regularity & EWT | Mean headway, StdDev, Cv (0.34 on Aurobindo Marg), Excess Waiting Time (21.3s), Metro vs Bus regularity, $r \ge 0.85$ correlation |
| `scripts/validate-interchange-observations.mjs` | Interchange Friction (IFI) | 15 multimodal hubs, mathematical deconstruction ($D_{\text{walk}} + L_{\text{vert}} + F_{\text{cross}} + T_{\text{wait}}$), step-free access, Fruin LOS |
| `scripts/validate-od-empirical-fit.mjs` | OD Matrix & Flow Calibration | Doubly-constrained Furness IPF ($\le 20$ iters, $\text{err} < 0.01\%$), mass conservation, 0% OBSERVED, ~21.6% ETM, GEH $< 5.0$ on $100\%$ links |
| `scripts/validate-ml-field-performance.mjs` | ML Accuracy & OOD Robustness | 5 registered models, ST-GNN (MAE 5.6%, PICP-95 94.0%), temporal holdout split (70/15/15), OOD stress degradation $\le 1.50\times$, SHAP attributions |
| `scripts/validate-accessibility-observations.mjs` | Spatial Equity & Routing | 11 districts, multi-profile routing (General, Wheelchair, Senior), circuity $\gamma = 1.31$, Equity Gini $0.29$, 14,820 OSM street segments |
| `scripts/validate-economic-assumptions.mjs` | Transport Economics (DCF) | Social discount rate 8.0%, 20-year horizon, AF = 9.8181, true portfolio BCR = 4.07x, VTTS RITES sources, CapEx unit costs, 4 sensitivity cases |
| `scripts/validate-environmental-claims.mjs` | Lifecycle Carbon (WTW) | CEA grid factor 0.716 kg CO2/kWh, e-Bus WTW (680 g/km) vs CNG (1,240 g/km), 45.2% carbon reduction, transit efficiency 7.8x over car |

---

## 4. Master Epistemological Ledger

NEXBUS enforces strict segregation between observed ground truth, official published data, model estimations, and simulation counterfactuals:

| Platform Module | Primary Evidence Classification | Underlying Source & Attribution | Empirical Validation Methodology |
| :--- | :---: | :--- | :--- |
| **Mobility Field Ingestion** | `OBSERVED` | Trained surveyors under IRB-2026-NEXBUS-MOB-004 | Delhi NCT bounding geofence, 4-decimal truncation, 15s quantization, SHA-256 digest |
| **Provider Registry** | `VERIFIED_EXTERNAL` | Official tables from DMRC, DTC, CPCB, IMD, Census | On-demand SHA-256 raw archival checksums |
| **Multimodal Network (256 Stops)** | `VERIFIED_EXTERNAL` | GTFS Static feeds + DMRC route diagrams | Referential key integrity, geodetic WGS84 sanity, zero speed violations |
| **Interchange Friction (IFI)** | `DERIVED` / `VERIFIED_EXTERNAL` | DMRC/DTC physical station geometry surveys | Component deconstruction: observed distance vs modeled wait time, Fruin LOS |
| **Origin-Destination Demand** | `DERIVED` | Census 2011 + MPD-2041 + DTC ETM aggregates | Doubly-constrained Furness IPF balancing, GEH screenline validation |
| **ML Crowding Predictions** | `DERIVED` / `ESTIMATED` | ST-GNN graph neural network surrogate | 15% chronological holdout test set, Bayesian credible intervals (PICP-95) |
| **Pedestrian Accessibility** | `DERIVED` | OpenStreetMap (OSM) digitized road network | Multi-profile routing, network circuity factor $\gamma = 1.31$, Gini $0.29$ |
| **Scenario Planning & Economics** | `SIMULATED` | RITES VTTS surveys, DMRC DPR capital benchmarks | 20-year DCF analysis, social discount rate 8.0%, portfolio BCR 4.07x |
| **WTW Carbon Accounting** | `DERIVED` | Central Electricity Authority (CEA) Baseline v19 | Well-to-Wheel lifecycle accounting including upstream methane and grid intensity |

---

## 5. Research Ethics & Data Governance Affirmations

1. **IRB Protocol Compliance:** All field observation collection adheres to **`IRB-2026-NEXBUS-MOB-004`** approved by the institutional research consortium.
2. **Zero Personally Identifiable Information (Zero PII):**
   - Zero facial imagery, audio recordings, or license plate storage (2-digit masking enforced).
   - Zero passenger contact information or network device sniffing (MAC/IMEI).
   - Surveyor identities pseudonymized via HMAC-SHA256 salted keys.
3. **Voluntary Informed Consent:** Mandatory cryptographic consent assertions logged with every observation batch.
4. **Epistemological Integrity:** 0% unverified synthetic records are permitted to be labeled as empirical observations. Pre-seeded demonstration fixtures are explicitly segregated.

---

## 6. Non-Negotiable Operational Safety Invariant

The entire NEXBUS software platform operates strictly under:

$$\mathbf{READ\text{-}ONLY} + \mathbf{PASSIVE} + \mathbf{ADVISORY}$$

### Operational Boundaries:
- **No Vehicle Dispatch:** NEXBUS does not send dispatch instructions, holding commands, or route alterations to buses, drivers, or depot controllers.
- **No Signal Preemption:** NEXBUS has zero physical or digital connectivity to Delhi Traffic Police traffic signal controllers (SCOOT/ITS).
- **No Railway Interlocking:** NEXBUS does not interface with DMRC metro signalling, interlocking, automatic train protection (ATP), or platform screen doors.
- **Decision-Support Scope:** All analytical outputs, heatmaps, forecasts, and scenario evaluations represent advisory decision support for human planners.
