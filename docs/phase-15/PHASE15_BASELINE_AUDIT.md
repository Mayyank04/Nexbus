# NEXBUS Phase 15 — Baseline and Repository Control Audit

## 1. Executive Summary & Starting Baseline

This audit establishes the baseline technical, empirical, and evidentiary starting state of the **NEXBUS** urban mobility intelligence platform for **Phase 15: Controlled Field Execution, Independent Data Auditing & Institutional Research Validation**.

| Parameter | Baseline Value | Audit Verification |
|---|---|---|
| **Repository** | `https://github.com/Mayyank04/Nexbus.git` | Verified |
| **Starting HEAD Commit** | `02f985c` | Confirmed in Git history (`main`) |
| **Working Branch** | `phase-15-controlled-field-execution-and-independent-validation` | Created from `02f985c` |
| **Working Tree Status** | Clean (0 uncommitted changes at checkout) | Verified |
| **Previous Certified Phase** | Phase 14: Independent Scientific Reproduction & External Benchmarking | Head `02f985c` |
| **Pre-Phase 15 Test Status** | 61/61 automated tests passing | Verified |
| **Pre-Phase 15 Build Status** | Turbopack compilation clean (692ms, 44 routes) | Verified |
| **TypeScript Typecheck** | 0 errors (`npx tsc --noEmit`) | Verified |
| **Core Operational Invariant** | `READ-ONLY + PASSIVE + ADVISORY` | Strictly Enforced |

---

## 2. Inventory of Existing Phase 14 Benchmark & Fieldwork Artifacts

### 2.1 Benchmark Services & Code Modules
- **`src/lib/research/benchmarkRegistry.ts`**: Implements 8 external benchmark datasets (DTC GTFS Static, Delhi OTD Realtime, DMRC Metro GTFS, CPCB CAAQMS, IMD Mausam, OpenStreetMap, Census 2011, RITES Screenlines) with SHA-256 digests and tier partition separation (`MODEL_TRAINING`, `MODEL_CALIBRATION`, `INDEPENDENT_REFERENCE`, `FINAL_TEST_HOLDOUT`).
- **`src/lib/pilot/researchPilotService.ts`**: Implements the Aurobindo Marg / Janpath corridor pilot protocol (14.8 km, 5 physical checkpoints, 3 observation time-slots).
- **`src/lib/ingestion/fieldObservationService.ts`**: Provides privacy-preserving field data ingestion with pseudonymous salted hashing, spatial coordinate truncation (4 decimal places, ~11m), 15-second temporal quantization, and zero-PII guarantees.
- **`src/lib/analytics/corridorBenchmarks.ts`**: Provides 4 arterial corridor benchmark profiles (Aurobindo Marg, Ring Road, Outer Ring Road, Vikas Marg) with empirical kinematic parameters.
- **`src/lib/demand/odMatrixEngine.ts`**: Implements Doubly-Constrained Furness Iterative Proportional Fitting (IPF) balancing for Delhi's 15 multimodal hubs.
- **`src/lib/mlEvaluation.ts`**: Implements surrogate model evaluation dossiers with 95% Bayesian Credible Intervals.

### 2.2 Phase 14 Verification & Reproduction Scripts
- `scripts/phase14-journey-benchmark.mjs`: Journey-time evaluation across 5 models on $N=240$ runs.
- `scripts/phase14-headway-benchmark.mjs`: Headway variance, Excess Waiting Time ($EWT$), and dual arrival regimes (random vs Seddon-Day timetable-informed).
- `scripts/phase14-od-screenline-validation.mjs`: Doubly-constrained Furness IPF conservation and 8 screenlines GEH evaluation.
- `scripts/phase14-ml-independent-holdout.mjs`: Dual-axis temporal and geographic holdouts ($N=500$) for crowding load predictions.
- `scripts/phase14-statistical-corrections.mjs`: Arithmetic proof of $EWT = 21.3\text{ s}$ and wait penalty $11.5\%$.
- `scripts/phase14-reproduce-all.mjs`: Master reproduction runner for all Phase 14 benchmarks.
- `scripts/test-phase14-certification.mjs`: 12-test certification suite validating mathematical and operational invariants.

---

## 3. Audit of Existing Fieldwork & Approval Status

Phase 14 documented the status of the planned field research pilot as follows:

| Evidence Category | Phase 14 Reported Status | Phase 15 Baseline Finding |
|---|---:|---|
| Planned pilot sessions | 24 | Confirmed scheduled protocol slots |
| Submitted observation records | 8 | Prototype submissions in ledger |
| Valid schema records | 8 | Passed schema validation |
| Independently verified field records | 0 | **No in-vivo physical surveyor records verified** |
| Unverified records | 4 | Pending independent audit |
| Demonstration fixtures | 4 | Hardcoded prototype fixtures |
| Calibrated simulation records | 184 | Parametrically generated via Box-Muller |
| Verified fieldwork completion | 0% | **Fieldwork remains unexecuted pending formal authorization** |

### 3.1 Ethics Approval Status Audit
- **Referenced Identifier**: `IRB-2026-NEXBUS-MOB-004`.
- **Finding**: No external documentary institutional review board approval letter exists from an accredited university or institutional research ethics board. The identifier was created as an internal research protocol tracking code.
- **Phase 15 Rectification**: Under scientific integrity principles, NEXBUS must not claim accredited IRB approval. The ethics status must be formally classified as:
  ```ts
  ETHICS_APPROVAL_STATUS = 'PENDING' | 'UNVERIFIED'
  ```
- **Fieldwork Execution Status**: Must be held in:
  ```ts
  FIELDWORK_EXECUTION_STATUS = 'READY_FOR_FIELDWORK' | 'BLOCKED_PENDING_AUTHORIZATION'
  ```

---

## 4. Known Technical & Evidentiary Limitations

1. **Journey-Time Benchmark Dataset ($N=240$)**: Generated parametrically using a Box-Muller normal sampler calibrated on historical transit distributions. These runs represent a **simulation benchmark evaluation**, not 240 physical vehicles tracked by ground observers.
2. **Headway EWT Formula Applicability**: The classical Welding-Osuna formulation $EWT = \frac{\sigma^2}{2\mu}$ strictly assumes independent Poisson/random passenger arrivals, valid only for high-frequency services ($\mu \le 12\text{ min}$). Low-frequency or suburban routes require timetable-coordinated arrival models (e.g. Seddon & Day, 1974).
3. **OD Matrix Screenline Validation**: The 8 RITES screenline counts used in Phase 14 to compute $\text{GEH} < 5$ were historically calibrated against the same corridors. Presenting 100% $\text{GEH} < 5$ as "independent validation" is epistemologically flawed unless screenlines are strictly divided into calibration and independent holdout sets.
4. **ML Generalization Target Variable**: The reported MAE of 1.21% in Phase 14 measures **crowding occupancy load percentage points**, not physical travel time in minutes.
5. **Physical Accessibility Surveys**: Observations at Kashmere Gate, AIIMS, INA, and Hauz Khas represent discrete point-in-time physical surveys of specific entrances, not comprehensive automated city-wide coverage.

---

## 5. Non-Negotiable Operational Safety Invariants

As mandated throughout the NEXBUS platform lifecycle:
1. **READ-ONLY + PASSIVE + ADVISORY**: The platform performs no dispatching, no signal alteration, no railway route interlocking, and no automated physical operations.
2. **Evidence Transparency**: Every datum and output must be tagged with its authentic classification: `OBSERVED`, `VERIFIED_EXTERNAL`, `DERIVED`, `ESTIMATED`, `SIMULATED`, `SYNTHETIC`, `UNAVAILABLE`, or `AUTH_REQUIRED`.
3. **Zero Fabrication**: No simulated or synthetic data may be labeled as observed field data.
