# NEXBUS: PUBLIC CLAIMS & EVIDENCE REGISTER
## Systematic Audit of All Public-Facing Technical & Empirical Assertions

**Document Identifier:** `NEXBUS-CLAIMS-REGISTER-PHASE21`  
**Audit Baseline:** Release Phase 21 Baseline Commit `e94751d`  
**Safety Invariant:** `READ-ONLY + PASSIVE + ADVISORY` (Absolute Invariant)  
**Taxonomy Standard:** 9-Tier Evidence Classification Taxonomy (`src/lib/evidence/evidenceClassification.ts`)  
**Audit Purpose:** Ensure every claim made in the proposal, README, website, and competition submission is truthful, verifiable, and strictly bounded by empirical limitations.

---

## 1. CLAIMS AUDIT SUMMARY

| Claim Domain | Total Claims Audited | Classified `OBSERVED` | Classified `DERIVED`/`ESTIMATED` | Classified `PREDICTED`/`SIMULATED` | Publication Status |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Platform Architecture & Testing** | 4 | 4 | 0 | 0 | 🟢 SAFE TO PUBLISH |
| **Geographic Scope & Network Size** | 2 | 2 | 0 | 0 | 🟢 SAFE TO PUBLISH (With explicit boundary disclaimer) |
| **Journey Planning & Alternatives** | 3 | 1 | 2 | 0 | 🟢 SAFE TO PUBLISH |
| **Headway Reliability & Waiting Time**| 3 | 0 | 2 | 1 | 🟢 SAFE TO PUBLISH (With mathematical disclosure) |
| **Crowding Density & ML Performance**| 3 | 0 | 0 | 3 | 🟢 SAFE TO PUBLISH (Disclosed as ST-GNN surrogate) |
| **Simulation Lab (Elasticity & CO2)** | 3 | 1 | 1 | 1 | 🟢 SAFE TO PUBLISH (Disclosed as parametric model) |
| **Data Freshness & External Feeds**  | 2 | 1 | 1 | 0 | 🟢 SAFE TO PUBLISH (Explicit degradation status) |
| **Civic Privacy & Security**         | 3 | 3 | 0 | 0 | 🟢 SAFE TO PUBLISH |

---

## 2. DETAILED REGISTER OF AUDITED CLAIMS

### Category 1: Platform Architecture, Reproducibility & Testing

#### Claim 1.1: "NEXBUS has 74 automated tests passing with zero failures."
- **Exact Public Statement:** "74 automated tests passing across routes, API endpoints, data integrity, and simulation models."
- **Evidence Source:** `scripts/verify-platform.mjs` test output and GitHub Actions Run logs.
- **Evidence Classification:** `OBSERVED` (Deterministic CI execution trace).
- **Verification Method:** Run `npm test` locally and verify GitHub Actions runs ([44146730993](https://github.com/Mayyank04/Nexbus/actions/runs/44146730993)).
- **Limitations:** Automated test passage proves software logic consistency; it does not replace transportation field trials.
- **Safety Determination:** 🟢 **SAFE TO PUBLISH** without qualification.

#### Claim 1.2: "NEXBUS passes continuous integration across both Node.js 20.x and 22.x matrix runners."
- **Exact Public Statement:** "100% green CI build matrix across Node.js 20.x and 22.x."
- **Evidence Source:** GitHub Actions workflow telemetry (`.github/workflows/ci.yml`).
- **Evidence Classification:** `OBSERVED` (Remote virtual machine log output).
- **Verification Method:** Verified via GitHub Actions API for commit `40d9e97` / `e94751d`.
- **Limitations:** Tests execute in Ubuntu Linux runner environments; minor platform quirks may exist on other OS variants.
- **Safety Determination:** 🟢 **SAFE TO PUBLISH** without qualification.

---

### Category 2: Geographic Scope & Network Representation

#### Claim 2.1: "NEXBUS models Delhi's transit network across 67 nodes, 226 edges, and 15 interchange hubs."
- **Exact Public Statement:** "Models 67 transit stops, 226 directional edges, and 15 multimodal hubs across 4 arterial corridors."
- **Evidence Source:** `src/lib/gtfs/transitDataService.ts` and `src/app/api/gtfs/stops/route.ts`.
- **Evidence Classification:** `OBSERVED` (Static topology graph inventory).
- **Verification Method:** Query `/api/gtfs/stops` and count registered entities.
- **Limitations:** Represents an arterial corridor sample of Delhi (Aurobindo Marg, Ring Road, Old Delhi, Outer Ring Road), NOT the entire 500+ bus route network.
- **Safety Determination:** 🟢 **SAFE TO PUBLISH**, provided the 4-corridor sample boundary is explicitly stated. Never claim "entire Delhi bus network".

---

### Category 3: Multi-Criteria Journey Planning

#### Claim 3.1: "NEXBUS generates three distinct Pareto-optimal route tiers: Fastest, Balanced, and Comfort First."
- **Exact Public Statement:** "Computes three distinguishable route choices optimizing for duration, transfers, and crowding comfort."
- **Evidence Source:** `src/lib/routing/multiCriteriaRouter.ts` and `POST /api/journey/plan`.
- **Evidence Classification:** `DERIVED` (Computed via weighted multi-criteria graph traversal).
- **Verification Method:** Automated test asserting all three tiers exist and have distinct parameter weights.
- **Limitations:** Routes are computed over the modeled 4-corridor network graph.
- **Safety Determination:** 🟢 **SAFE TO PUBLISH**.

---

### Category 4: Headway Reliability & Excess Waiting Time

#### Claim 4.1: "Average bus excess waiting time on Aurobindo Marg is 21.3 seconds with a Wait Penalty of ~11.5%."
- **Exact Public Statement:** "Empirical headway variance ($C_v = 0.34$) incurs an Excess Waiting Time ($EWT$) of 21.3s and an 11.5% wait penalty."
- **Evidence Source:** Welding-Osuna formulation applied to published corridor headway statistics (`src/lib/research/benchmarkRegistry.ts`).
- **Evidence Classification:** `ESTIMATED` / `CALIBRATED_BENCHMARK`.
- **Verification Method:** Evaluated via `scripts/phase14-statistical-corrections.mjs`.
- **Limitations:** Headway variation is calibrated from historical survey snapshots; real-time daily traffic surges can cause larger headway spikes.
- **Safety Determination:** 🟢 **SAFE TO PUBLISH** with explicit citation of the Welding-Osuna equation ($\text{Penalty} = C_v^2$).

---

### Category 5: Crowding Prediction & Machine Learning

#### Claim 5.1: "ST-GNN surrogate predicts bus crowding with ~5.6% MAE and 95% Bayesian Credible Intervals."
- **Exact Public Statement:** "Pre-calibrated ST-GNN surrogate delivers 5.6% MAE on holdout corridors with 94.2% Bayesian coverage."
- **Evidence Source:** `src/app/api/ml/evaluation/route.ts` and `src/lib/ml/crowdingModel.ts`.
- **Evidence Classification:** `PREDICTED` (Surrogate neural network output).
- **Verification Method:** Query `GET /api/ml/evaluation` and verify empirical benchmark dossier.
- **Limitations:** ST-GNN outputs are computational surrogates approximating expected demand. They are NOT live physical infrared sensor tallies.
- **Safety Determination:** 🟢 **SAFE TO PUBLISH**, provided it is explicitly labeled as a pre-calibrated surrogate and never disguised as physical sensor telemetry.

---

### Category 6: Parametric Simulation & Environmental Impact

#### Claim 6.1: "Fleet electrification yields 25.3% net carbon reduction using Well-to-Wheel grid factors."
- **Exact Public Statement:** "Models full lifecycle carbon abatement (1.150 kg CO2/km diesel vs 0.859 kg CO2/km electric grid) using Central Electricity Authority Northern Grid baselines."
- **Evidence Source:** `src/lib/simulation/scenarioEngine.ts` utilizing CEA published emission factor ($0.716\text{ }kg\text{ }CO_2/kWh$).
- **Evidence Classification:** `CALIBRATED_BENCHMARK` (Grid factor) / `SIMULATED` (Scenario delta).
- **Verification Method:** Evaluated in `POST /api/simulation/evaluate` and verified in `scripts/verify-platform.mjs`.
- **Limitations:** Assumes consistent specific energy consumption ($1.20\text{ }kWh/km$); seasonal auxiliary loads (e.g. summer air-conditioning) may increase electricity consumption.
- **Safety Determination:** 🟢 **SAFE TO PUBLISH** with equation disclosure.

#### Claim 6.2: "Fare elasticity follows -0.30 empirical response curve."
- **Exact Public Statement:** "Evaluates ridership shifts via constant-elasticity demand model ($\epsilon = -0.30$)."
- **Evidence Source:** Published urban transport economics literature for South Asian developing megacities.
- **Evidence Classification:** `ESTIMATED` / `SIMULATED`.
- **Verification Method:** Code inspection of `src/lib/simulation/scenarioEngine.ts`.
- **Limitations:** Elasticity varies across socio-economic groups and trip purposes.
- **Safety Determination:** 🟢 **SAFE TO PUBLISH** as a parameter assumption.

---

### Category 7: Civic Privacy & Operational Safety

#### Claim 7.1: "NEXBUS operates strictly under READ-ONLY + PASSIVE + ADVISORY principles with Zero PII."
- **Exact Public Statement:** "Enforces an absolute READ-ONLY + PASSIVE + ADVISORY invariant with zero passenger surveillance and zero physical actuation."
- **Evidence Source:** Codebase-wide static audit (`scripts/test-phase20-governance.mjs`) confirming zero signal control endpoints, zero user tracking cookies, and spatial coordinate truncation.
- **Evidence Classification:** `OBSERVED` (Architectural invariant).
- **Verification Method:** Governance suite assertions in `scripts/test-phase20-governance.mjs`.
- **Limitations:** None. The architectural boundary is hardcoded and invariant.
- **Safety Determination:** 🟢 **SAFE TO PUBLISH** as a central pillar of the platform.
