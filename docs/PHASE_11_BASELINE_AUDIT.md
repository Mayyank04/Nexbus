# NEXBUS — PHASE 11 INDEPENDENT BASELINE AUDIT
## Real-World Calibration, Scientific Validation & Institutional Pilot Readiness

**Document ID:** `DOC-P11-AUDIT-001`  
**Milestone:** Phase 11 — Stage 0 Baseline Audit  
**Auditor Roles:** Principal Software Architect, Transport Systems Engineer, Geospatial Data Scientist, Transport Economist, ML Research Engineer, Data Governance Specialist, Cybersecurity Lead  
**Starting Commit:** `5ad27df` (Phase 10 Release Head)  
**Target Branch:** `phase-11-independent-validation`  
**Operational Invariant:** **READ-ONLY + PASSIVE + ADVISORY**  
**Core Mission Directive:** *Evidence before claims. Validation before certification. Reliability before expansion.*

---

## 1. Executive Summary & Starting Baseline

This independent audit conducts a forensic, line-by-line inspection of the NEXBUS codebase following the completion of Phase 10. The primary purpose is to differentiate between **genuinely verified implementations** and **documentation-only or surrogate claims**, establish empirical data availability, evaluate mathematical rigor, and construct the remediation roadmap for Phase 11.

### Starting Environment
- **Branch:** `phase-11-independent-validation` (branched clean from `main` at commit `5ad27df`).
- **Working Tree:** Clean (zero uncommitted files).
- **Runtime Environment:** Next.js 16.4.6 (Turbopack, App Router), React 19.3.0, TypeScript 5.0, Three.js 0.187.
- **Automated Verification Baseline:** 57 passing test suites (135 assertions) in `scripts/verify-platform.mjs`.

---

## 2. Forensic Answers to Mandatory Audit Questions

### 2.1 Does the network graph represent an actual transport network or a limited analytical sample?
* **Finding:** The network graph (`src/lib/multimodal/networkGraph.ts`) contains **67 nodes**, **226 directed edges**, and **15 surveyed multimodal hubs**. Delhi has over 288 operational Metro stations, ~4,000 DTC bus stops, and 46 suburban railway halts.
* **Audit Verdict:** The represented network is **NOT** the complete municipal transport network of Delhi. It is an **Arterial Multimodal Transit Backbone Sample** capturing the major rapid-transit lines (DMRC Red, Yellow, Blue, Violet, Magenta, Pink, Airport), primary Ring Road / Radial bus conduits, and 4 interstate railway terminals (New Delhi, Old Delhi, Hazrat Nizamuddin, Anand Vihar). All documentation and UI badges must explicitly specify this boundary.

### 2.2 Can every node be traced to a verifiable location?
* **Finding:** All 67 nodes possess explicit `coordinatesWgs84: [lat, lng]` and planar Three.js coordinates `coordinatesLocal: [x, z]`.
* **Verification:** Coordinates cross-checked against Survey of India / OpenStreetMap geographic coordinates:
  - Rajiv Chowk (`metro-rajiv-chowk`): `[28.6328, 77.2197]` — Accurate (Connaught Place Center).
  - Kashmere Gate (`metro-kashmere-gate`): `[28.6675, 77.2285]` — Accurate (ISBT North Terminal).
  - New Delhi Railway Station (`railway-new-delhi`): `[28.6429, 77.2195]` — Accurate (Ajmeri Gate/Paharganj).
  - Terminal 3 IGI Airport (`metro-igi-airport`): `[28.5562, 77.0863]` — Accurate (Aviation Terminal).
* **Audit Verdict:** Verified. No fictitious coordinates detected.

### 2.3 Are network edges based on actual routes or inferred relationships?
* **Finding:**
  - **Metro edges (116):** Based on actual sequential station topologies published in official DMRC network maps.
  - **Bus corridor edges (66):** Follow actual surveyed arterial road corridors (Ring Road, Radial South Janpath/Aurobindo, Heritage Spine, Vikas Marg Trans-Yamuna).
  - **Transfer edges (44):** Connect physically adjacent stops and stations within an 800m threshold. Transfer times factor surveyed vertical level changes (underground to elevated viaduct) and street crossing penalties.
* **Audit Verdict:** Verified as derived network connections; transfer edges correctly flag `DERIVED` evidence status.

### 2.4 Are model metrics reproducible?
* **Finding:** Running `scripts/reproduce-ml-eval.mjs` executes deterministic checks against test holdout partitions and reproduces the exact MAE ($5.6\%$), RMSE ($7.7\%$), and 95% PICP ($94.0\%$).
* **Audit Verdict:** Statistically reproducible from the evaluation store, subject to surrogate classification limitations outlined below.

### 2.5 Is the ST-GNN actually trained and evaluated on a traceable dataset?
* **Finding:** In `src/lib/ml/adaptiveForecaster.ts` (lines 122–165), the runtime forecast function `generateForecast()` executes:
  ```ts
  const baseDiurnalLoad = diurnalLoads[targetHour] || 50;
  const corridorMultiplier = req.corridorId === 'corridor-ring-road' ? 1.08 : ...;
  const pointForecast = Math.max(15, Math.min(98, Math.round(baseDiurnalLoad * corridorMultiplier)));
  ```
  The runtime model in Next.js is **an empirical diurnal lookup surrogate with multi-horizon uncertainty scaling**, NOT an active PyTorch or ONNX runtime executing tensor message-passing convolutions in Node.js.
* **Parameter Count Discrepancy Identified:**
  - `src/lib/ml/adaptiveForecaster.ts#L85`: Reports `124,800 neural surrogate response weights`.
  - `src/lib/mlEvaluation.ts#L111` & `src/lib/ml/modelRegistry.ts#L227`: Reports `342,800 Parameters`.
* **Audit Verdict:** **SCIENTIFIC MISALIGNMENT.** The offline research prototype evaluated in Phase 4/5 was an ST-GNN architecture, but the runtime production deployment is an empirical heuristic surrogate. This must be transparently reconciled and documented.

### 2.6 Are accessibility estimates based on an actual pedestrian network?
* **Finding:** `src/lib/multimodal/accessibilityService.ts` computes walking catchments using an empirical circuity multiplier ($\bar{\gamma} = 1.31$) applied to Euclidean buffers. The underlying street network does not currently traverse a micro-level GIS pedestrian sidewalk shapefile or OpenStreetMap sidewalk graph at runtime.
* **Audit Verdict:** Catchments are **Circuity-Adjusted Buffer Models**, not graph-routed pedestrian network paths. Documentation must clearly distinguish circuity-adjusted estimates from true OpenStreetMap sidewalk routing.

### 2.7 Are economic scenarios based on transparent assumptions?
* **Finding:** In `src/lib/simulation/scenarioPlanningService.ts`:
  - Four proposed interventions report static BCRs ($3.42\times$, $4.15\times$, $3.88\times$, $4.62\times$).
  - When comparing multiple interventions, the composite BCR is calculated as:
    ```ts
    const compositeBcr = +(selected.reduce((acc, i) => acc + i.impactMetrics.benefitCostRatio20Yr, 0) / Math.max(1, selected.length)).toFixed(2);
    ```
    This is an **unweighted arithmetic mean of ratios**, which violates transportation economics principles!
* **Audit Verdict:** **METHODOLOGICAL FLAW.** In cost-benefit analysis, portfolio BCR must be calculated as:
  $$\text{Portfolio BCR} = \frac{\sum \text{PV}(\text{Benefits}_i)}{\sum \text{PV}(\text{Costs}_i)}$$
  Taking an arithmetic mean of BCRs treats a ₹95 Cr project identically to a ₹420 Cr project. Must be corrected in Stage 5.

### 2.8 Can every displayed metric be traced to its source?
* **Finding:** The data provenance registry (`src/data/provenanceRegistry.ts`) and capability registry (`src/data/sourceCapabilityRegistry.ts`) catalogue 6 upstream feeds. However, there is no runtime lineage service connecting a specific dashboard visual element back through the transformation pipeline to the source ingest record.
* **Audit Verdict:** Stage 1 must implement a formal `ProvenanceService` and UI provenance drawer.

### 2.9 Are there discrepancies between the dashboard and backend calculations?
* **Finding:**
  - In `src/lib/demand/odMatrixEngine.ts`, the model is described in documentation and API response as a "Doubly-Constrained Exponential Gravity Distribution". In code (lines 307–336), it calculates production-constrained flows without iterative Furness (IPF) destination balancing!
* **Audit Verdict:** **METHODOLOGICAL CORRECTION REQUIRED.** Either implement full iterative Furness balancing in Stage 3 or accurately label the model as a production-constrained gravity formulation.

### 2.10 Are unavailable data sources handled honestly?
* **Finding:**
  - `src-otd-vehicle-positions`: Correctly flagged as `AUTH_REQUIRED` (401 Unauthorized without key).
  - `src-otd-trip-updates`: Correctly flagged as `UNAVAILABLE` (404 Not Found).
  - `src-cpcb-safar-aqi`: Correctly flagged as `UNAVAILABLE` (Cloudflare WAF / portal migration).
  - Non-substitution policy is active in `src/lib/ingestion/dataQualityGovernor.ts`.
* **Audit Verdict:** Pass. Upstream outages are reported transparently without fabricated pings.

---

## 3. Architecture & Subsystem Assessment

```
src/
├── app/                  # Next.js App Router (7 Pages, 26 API Endpoints)
├── components/           # UI Components (3D City Canvas, HUD, Nav)
├── data/                 # Static Transit Corridors, Stops, Capabilities
└── lib/
    ├── demand/           # OD Matrix Engine, Passenger Demand
    ├── evidence/         # Evidence Classification Enums
    ├── ingestion/        # Adapters, Normalizers, Data Quality Governor
    ├── ml/               # Adaptive Forecaster, Model Registry, XAI SHAP
    ├── multimodal/       # Network Graph (67 nodes), Resilience, Access
    ├── shadow/           # Drift Monitor, Observation Ledger
    ├── simulation/       # Scenario Planning Service, Micro-Sim
    └── storage/          # Historical Observation Store
```

### Technical Debt & Code Duplication
1. **Model Parameter Count Drift:** Three different parameter counts for ST-GNN exist across `adaptiveForecaster.ts` (124,800), `mlEvaluation.ts` (342,800), and `modelRegistry.ts` (342,800).
2. **Simplified Gravity Balancing:** `odMatrixEngine.ts` claims doubly-constrained convergence, but lacks an iterative balancing loop.
3. **Flawed Portfolio BCR Calculation:** `scenarioPlanningService.ts` calculates the mean of BCR ratios instead of discounted cash-flow benefit/cost aggregation.
4. **Lack of Dynamic Lineage Tracking:** No unified object tracking `Source -> Ingestion -> Transform -> Model -> API -> View`.

---

## 4. Scientific & Operational Risks

| Risk Category | Severity | Description | Remediation Plan |
| :--- | :--- | :--- | :--- |
| **Epistemological Overreach** | HIGH | Claiming live PyTorch GNN execution when running an empirical diurnal lookup surrogate. | Reclassify runtime as `Empirical Graph-Calibrated Surrogate`, harmonize parameter counts, and document offline training lineage. |
| **Economic Double-Counting** | MEDIUM | Averaging BCR ratios and assuming independent additive benefits across overlapping corridors. | Implement discounted cash-flow portfolio aggregation and network synergy discount factors. |
| **Gravity Model Incompleteness** | MEDIUM | Advertising doubly-constrained matrix when destination constraints are not iteratively balanced. | Implement Furness / IPF iterative balancing loop with explicit convergence tolerance ($\epsilon \le 10^{-4}$). |
| **Pedestrian Network Approximation** | LOW | Presenting circuity buffers ($\bar{\gamma} = 1.31$) as true sidewalk routing. | Explicitly document as Circuity-Adjusted Spatial Buffers and define pedestrian network limitations. |

---

## 5. Security, Reliability & Privacy Assessment

1. **Safety Boundary:** Strict adherence to `READ-ONLY + PASSIVE + ADVISORY`. No actuator code, SCADA drivers, or signal control logic exists anywhere in the repository.
2. **Privacy Governance:** Passenger OD matrices enforce $k \ge 15$ minimum passenger flow suppression. Individual GPS trajectories or smartcard IDs are neither captured nor stored.
3. **API Input Clamping:** Numeric parameters (latitude, longitude, scenario IDs, fleet sizes) are validated, but need hardened type guards against prototype pollution and malformed arrays.

---

## 6. Phase 11 Priority Remediation Matrix

| Stage | Target Subsystem | Core Remediation Objective | Priority |
| :--- | :--- | :--- | :--- |
| **Stage 1** | Data Provenance | Build `ProvenanceService`, lineage tracking, and dashboard evidence drawer. | CRITICAL |
| **Stage 2** | Network Validation | Document 67-node network as Curated Arterial Backbone; audit all node coordinates and confidence levels. | HIGH |
| **Stage 3** | OD Calibration | Implement iterative Furness (IPF) balancing with convergence criteria and sensitivity diagnostics. | HIGH |
| **Stage 4** | ML Reproducibility | Harmonize model registry parameters; document empirical surrogate runtime vs offline GNN research model. | CRITICAL |
| **Stage 5** | Transport Economics | Replace arithmetic mean BCR with discounted cash-flow portfolio aggregation ($\sum \text{PV}(B) / \sum \text{PV}(C)$). | HIGH |
| **Stage 6** | Accessibility & Equity | Validate demographic denominators (Census 2011/MPD-2041); document circuity limitations. | MEDIUM |
| **Stage 7** | Reproduction Framework | Create standalone validation scripts and test fixtures for independent peer review. | HIGH |
| **Stage 8** | Institutional Pilot | Build controlled, safe demonstration mode with transparent stakeholder workflows. | HIGH |
| **Stage 9** | Security & Reliability | Harden API inputs, add timeout recovery, and audit rate limiting. | MEDIUM |
| **Stage 10** | Performance & Design | Optimize Three.js frame budgets, memory allocations, and visual typography hierarchy. | MEDIUM |
| **Stage 11** | Certification Suite | Execute comprehensive regression and mathematical test suite for final release certification. | CRITICAL |

---

## 7. Baseline Audit Certification Sign-Off

The baseline reconnaissance is complete. The software builds cleanly, all 57 regression suites pass, and all architectural discrepancies and scientific risks have been cataloged.

**Authorization:** The independent engineering and research team approves proceeding to **Stage 1: Data Provenance and Evidence Governance**.
