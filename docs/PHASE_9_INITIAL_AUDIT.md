# NEXBUS Phase 9 — Mandatory Repository & Baseline Audit

**Audit Date**: 2026-11-15T09:42:00Z  
**Auditor**: Principal Systems Architect & Transportation Data Scientist  
**Repository**: `https://github.com/Mayyank04/Nexbus.git`  
**Current Branch**: `main`  
**Audited Commit**: `bb5d5e1f7cb3c56c2982e75809db24c0ae191e96`  
**Preceding Milestones**: Phase 8 (`bb5d5e1`), Phase 7 (`02889be`), Phase 6 (`90c525f`), Phase 5 (`2f40461`)

---

## 1. Baseline Verification & Execution Results

All automated verification gates pass against the starting commit:

| Verification Gate | Command | Expected | Observed | Status |
| :--- | :--- | :---: | :---: | :---: |
| Test Suite | `npm test` | 55/55 Passed | 55/55 Passed | **PASS** |
| Multimodal Integration | `node scripts/test-multimodal-network.mjs` | 34/34 Passed | 34/34 Passed | **PASS** |
| Static Type Analysis | `npx tsc --noEmit` | 0 errors | 0 errors | **PASS** |
| Production Build | `npm run build` | 33 routes compiled | 33 routes compiled (881ms) | **PASS** |
| Git Ancestry Check | `git log -n 5 --oneline` | Clean ancestry chain | Verified | **PASS** |

---

## 2. Inventory of Implemented Functionality (Phase 8 Baseline)

### 2.1 Services & Engines
1. **Multimodal Network Graph (`src/lib/multimodal/networkGraph.ts`)**:
   - In-memory topological graph integrating 16 DTC/DIMTS bus stops, 21 DMRC Metro stations across 5 lines (Yellow, Blue, Pink, Violet, Airport Express), and 8 multimodal interchange complexes.
2. **Multimodal Journey Engine (`src/lib/multimodal/journeyEngine.ts`)**:
   - Multi-criteria Dijkstra search computing Generalized Urban Travel Cost:
     $$C = T_{\text{in-veh}} + w_{\text{wait}} T_{\text{wait}} + w_{\text{walk}} T_{\text{walk}} + P_{\text{transfer}} + P_{\text{rel}}$$
   - Generates 3 options: `FASTEST`, `LEAST_TRANSFERS`, and `BUS_ONLY`.
3. **Interchange Friction Index (IFI) Service (`src/lib/multimodal/interchangeAnalytics.ts`)**:
   - Quantitative evaluation of pedestrian transfer friction across 8 major hubs (Kashmere Gate, Rajiv Chowk, AIIMS, Dhaula Kuan, Anand Vihar, Lajpat Nagar, Sarai Kale Khan, Janakpuri West).
4. **Network Resilience Engine (`src/lib/multimodal/networkResilience.ts`)**:
   - Passive stress-testing simulating graph efficiency degradation ($\Delta E/E_0$) under 4 preset disruption scenarios.
5. **Geographic Accessibility Service (`src/lib/multimodal/accessibilityService.ts`)**:
   - 400m and 800m pedestrian catchment buffers across Delhi NCT administrative zones.
6. **Adaptive ML Forecaster (`src/lib/ml/adaptiveForecaster.ts`) & Evaluation Dossier (`src/lib/mlEvaluation.ts`)**:
   - Spatiotemporal Graph Neural Network (ST-GNN surrogate `v1.4.2-stgnn`) benchmarked against Historical Average (HA) and AR-Ridge baselines with Bayesian 95% credible intervals.
7. **Shadow Operations Engine (`src/lib/shadow/shadowOperationsEngine.ts`)**:
   - Bounded corridor shadow tracking on Aurobindo Marg (`corridor-radial-south`) and Ring Road (`corridor-ring-road`).

---

## 3. Discrepancies, Methodological Risks & Audit Findings

The following critical scientific and institutional issues were uncovered during the Phase 8 audit:

### Finding 1: Subjective Weighting in Generalized Journey Cost
- **Issue**: Phase 8 hardcoded $w_{\text{wait}} = 1.5$ and $w_{\text{walk}} = 2.0$ without documenting empirical survey grounding or local Delhi commuter sensitivity curves.
- **Risk**: Presentation of fixed parameters as universal facts rather than behavioral assumptions.
- **Phase 9 Remedy**: Introduce documented alternative behavioral parameter sets (e.g. Wardman 2004 meta-analysis, UK DfT TAG unit M2, and Indian Ministry of Housing & Urban Affairs - MoHUA urban transport guidelines) with sensitivity curves.

### Finding 2: Dimensional Inconsistency & Arbitrary Normalization in IFI
- **Issue**: The Phase 8 IFI formula combined meters, level counts, crossing counts, and minutes with additive weights ($0.35, 0.25, 0.20, 0.20$) multiplied by $22$, resulting in ungrounded 0–100 scaling.
- **Risk**: Lack of physical dimension conservation and undefined behavior under extreme inputs ($D_{\text{walk}} > 1000\text{ m}$).
- **Phase 9 Remedy**: Rigorously normalize all IFI variables into dimensionless standard scores $[0, 1]$ anchored to physical human performance bounds, and incorporate Fruin's Level of Service (LOS A–F) for pedestrian concourse capacity.

### Finding 3: Conflation of Land-Area Coverage with Population Accessibility
- **Issue**: Phase 8 reported $83.2\%$ territory 800m catchment coverage without weighting by census population density or employment zones.
- **Risk**: An uninhabited ridge forest or riverbed within 800m of a road was treated identically to high-density resettlement colonies (e.g., Sangam Vihar, Burari).
- **Phase 9 Remedy**: Explicitly differentiate **Geographic Land-Area Catchment** from **Population-Weighted Accessibility** using Delhi Master Plan 2041 ward-level population estimates.

### Finding 4: Simplified Carbon Accounting Assumptions
- **Issue**: Phase 8 assumed a uniform $0.105\text{ kg CO}_2/\text{pax-km}$ offset based solely on private petrol cars vs average transit.
- **Risk**: Ignores India's coal-dominated electricity grid emission factor ($0.71\text{ kg CO}_2/\text{kWh}$ per Central Electricity Authority) which powers the DMRC metro and electric buses, as well as CNG bus tailpipe factors.
- **Phase 9 Remedy**: Implement formal life-cycle carbon accounting incorporating CEA grid emission intensity, vehicle occupancy rates, and modal substitution elasticity.

### Finding 5: Limited Transport Network Coverage
- **Issue**: Only 16 bus stops and 21 metro stations were modeled. Several critical trunk corridors (Magenta Line, Red Line, Green Line, Delhi-Meerut RRTS Namo Bharat, Najafgarh feeder) were absent.
- **Phase 9 Remedy**: Expand network topology to include major missing metro lines, regional rail connections, and extended DTC feeder radials.

### Finding 6: Missing Passenger Demand Dynamics
- **Issue**: The platform lacked a dedicated passenger demand service analyzing directional split, peak-hour factor ($PHF$), passenger concentration (Gini coefficient), and boardings/alightings.
- **Phase 9 Remedy**: Construct `PassengerDemandService` with privacy-preserving $k$-anonymity aggregations, directional imbalance analytics, and explicit `SYNTHETIC` testing flags where real ticketing streams are unverified.

### Finding 7: Lack of Model Explainability (XAI)
- **Issue**: The ST-GNN prediction surrogate produced point forecasts and credible intervals without explaining *why* a particular corridor experienced congestion or *which* features drove the uncertainty.
- **Phase 9 Remedy**: Develop `ModelExplainabilityService` providing SHAP feature attributions, partial dependence curves, and local explanation waterfalls.

---

## 4. Architectural Boundaries & Operational Invariants

The strict NEXBUS operational invariant is confirmed:
$$\text{Platform State} \equiv \text{READ-ONLY} \land \text{PASSIVE} \land \text{ADVISORY}$$
NEXBUS has zero physical actuation interfaces, does not interface with signaling interlocking systems, does not control bus fleet dispatch, and issues only analytical intelligence.
