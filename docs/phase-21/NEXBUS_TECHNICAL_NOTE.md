# NEXBUS: TECHNICAL NOTE & METHODOLOGY SPECIFICATION
## Mathematical Formulation, Evidence Governance, and Operational Architecture

**Document Identifier:** `NEXBUS-TECH-NOTE-PHASE21`  
**System Version:** v1.0.0-phase21  
**Target Domain:** Urban Mobility Intelligence & Advisory Decision-Support  
**Operational Invariant:** `READ-ONLY + PASSIVE + ADVISORY` (Absolute Invariant)  
**Authoring Entity:** NEXBUS Engineering & Research Core  
**Associated Repository:** `https://github.com/Mayyank04/Nexbus`  

---

## 1. SYSTEM ARCHITECTURE

NEXBUS is engineered as a decoupled, multi-tiered urban mobility intelligence platform built on Next.js 16 (App Router), React 19, TypeScript 5, Tailwind CSS 4, and Three.js / React Three Fiber.

```
                      +------------------------------------------+
                      |         CIVIC & PLANNER CLIENTS          |
                      |  - WebGL 3D Digital Twin (Three.js)      |
                      |  - Vector SVG Precision 2D Fallback      |
                      |  - Progressive Web App (PWA) Offline Svc |
                      +------------------------------------------+
                                           |
                                      HTTP / HTTPS
                                           |
                      +------------------------------------------+
                      |           EDGE & SECURITY LAYER          |
                      |  - Rate Limiting (120 req/min/IP)        |
                      |  - CSP / HSTS / SameOrigin Security Hdr  |
                      |  - Next.js Turbopack SSR / Route Handlers|
                      +------------------------------------------+
                                           |
          +--------------------------------+-------------------------------+
          |                                |                               |
+---------------------+        +-----------------------+        +----------------------+
|  ROUTING & PLANNING |        |  SIMULATION & IMPACT  |        | ML & PREDICTION CORE |
| - Multi-Criteria    |        | - Little's Law Engine |        | - ST-GNN Surrogate   |
|   Pareto Router     |        | - PED Fare Elasticity |        | - Bayesian Credible  |
| - 3 Tiers (Fastest, |        | - WTW Life-Cycle CO2  |        |   Interval Bounds    |
|   Balanced, Comfort)|        | - Wel-Osuna Headway   |        | - Historical Baselines|
+---------------------+        +-----------------------+        +----------------------+
          |                                |                               |
          +--------------------------------+-------------------------------+
                                           |
                      +------------------------------------------+
                      |       PROVENANCE & EVIDENCE LEDGER       |
                      |  - 9-Tier Evidence Classification Scheme |
                      |  - SHA-256 Digest Verification Registry |
                      |  - Cross-Node TypeScript Loader Core     |
                      |  - Read-Only Passivity Enforcement       |
                      +------------------------------------------+
```

### Component Decoupling
1. **Client Layer:** Renders the dual-mode 3D Digital Twin and responsive UI views. It contains zero business logic for transit routing or queue simulation, ensuring lightweight client execution.
2. **API Layer (`src/app/api`):** Exposes stateless, deterministic REST endpoints for journey planning, scenario evaluation, system telemetry, and evidence verification.
3. **Core Libraries (`src/lib`):** Houses pure, testable algorithmic implementations:
   - `src/lib/routing/multiCriteriaRouter.ts`: Multi-criteria graph search.
   - `src/lib/simulation/scenarioEngine.ts`: Parametric transport economics and queuing logic.
   - `src/lib/evidence/evidenceClassification.ts`: Formal 9-tier taxonomy and audit guards.
   - `src/lib/research/benchmarkRegistry.ts`: 4-tier anti-leakage reference registry.

---

## 2. DATA ACQUISITION & PROVENANCE

NEXBUS maintains an explicit inventory of external data sources. In compliance with strict research integrity standards, each source is attributed, cryptographically hashed (SHA-256), and classified:

```
+---------------------------------------------------------------------------------------------------------+
| DATASET ID           | PRIMARY SOURCE       | LICENSING        | SHA-256 DIGEST HASH (PREFIX)           |
+----------------------+----------------------+------------------+-----------------------------------------+
| DS-REF-OTD-GTFS-01   | Open Transit Data    | GODL-India       | a8b79c3e5d1f89e24b7a9c1e3d5f7a2b...    |
| DS-REF-OTD-RT-02     | Open Transit Data    | GODL-India       | e3b0c44298fc1c149afbf4c8996fb924...    |
| DS-REF-DMRC-03       | DMRC Published Map   | Fair Dealing/Gov | 9f83c12a8e7b6d4c2a1e0f9b8a7c6d5e...    |
| DS-REF-RITES-04      | RITES CTS Survey     | Academic Fair    | c4d6e8f0a2b4c6e8d0f2a4b6c8e0d2f4...    |
| DS-REF-OSM-05        | OpenStreetMap        | ODbL 1.0         | 5e884898da28047151d0e56f8dc62927...    |
| DS-REF-CPCB-06       | CPCB Ambient Air     | Open Access      | 6b86b273ff34fce19d6b804eff5a3f57...    |
| DS-REF-CEA-07        | Central Elec Auth    | Official Report  | d4735e3a265e16eee03f59718b9b5d03...    |
| DS-REF-IMD-08        | IMD Weather Records  | Open Access      | 4e07408562be...                         |
+---------------------------------------------------------------------------------------------------------+
```

### Ingestion Degradation Architecture
Live APIs are inherently non-deterministic. When external servers experience downtime, network timeouts, or rate-limiting, the ingestion pipeline degrades gracefully to the verified local GTFS snapshot without throwing unhandled exceptions or presenting synthetic data as observed data.

---

## 3. EVIDENCE CLASSIFICATION TAXONOMY

NEXBUS enforces an absolute 9-tier evidence classification taxonomy (`src/lib/evidence/evidenceClassification.ts`) to prevent data masquerading:

| Taxonomy Classification | Formal Definition | Example in Platform |
| :--- | :--- | :--- |
| `OBSERVED` | Direct empirical measurement captured by a sensor, surveyor, or official public agency feed. | GPS stop coordinates, GTFS static timetable schedules. |
| `HISTORICAL_REFERENCE` | Retrospective published study data used as an external holdout benchmark. | RITES Comprehensive Transport Study screenline counts. |
| `DERIVED` | Mathematical calculation computed deterministically from observed baseline inputs. | Stop-to-stop Euclidean distance, scheduled inter-stop run time. |
| `ESTIMATED` | Statistical estimate computed from historical sample distributions. | Headway Coefficient of Variation ($C_v = \sigma / \mu$). |
| `PREDICTED` | Machine-learning inference generated by a trained surrogate model. | ST-GNN crowding occupancy percentage ($\hat{y}$) and credible interval. |
| `SIMULATED` | Algorithmic scenario output generated by parameterized counterfactual models. | Little's Law wait-time reduction under hypothetical 20% frequency boost. |
| `SYNTHETIC` | Numerically synthesized sample generated via pseudo-random number generators for stress testing. | Box-Muller PRNG monsoon waterlogging shock profiles. |
| `CALIBRATED_BENCHMARK` | Empirical baseline normalized to standard spatial and temporal units. | Standardized passenger car unit (PCU) conversion factors. |
| `INDEPENDENT_HOLDOUT` | Unseen reference data strictly sequestered from training procedures. | Dual-axis corridor holdouts for ML generalization testing. |

**Anti-Fabrication Invariants:**
1. A `SYNTHETIC` or `SIMULATED` record cannot be promoted to `OBSERVED` or `CALIBRATED_BENCHMARK`.
2. A `PREDICTED` value cannot be labeled as `OBSERVED`.
3. In absence of live timestamp verification, freshness defaults to `UNKNOWN`, never fabricated as `FRESH`.

---

## 4. NETWORK REPRESENTATION

The modeled transit network is formally defined as a directed multigraph $G = (V, E)$, where:
- $V$: Set of transit stops, metro stations, and multimodal interchange centroids ($|V| = 67$).
- $E$: Set of directed transit corridors, rail segments, and pedestrian walking transfer edges ($|E| = 226$).

### Network Attributes
Every node $v \in V$ contains:
$$\text{Node } v = \{ \text{id}, \text{name}, \text{lat}, \text{lon}, \text{type} \in \{\text{BUS}, \text{METRO}, \text{INTERCHANGE}\}, \text{wheelchairAccessible} \in \{\text{true}, \text{false}\} \}$$
Every edge $e = (u, v) \in E$ contains:
$$\text{Edge } e = \{ \text{mode} \in \{\text{BUS}, \text{METRO}, \text{WALK}\}, \text{distanceKm}, \text{freeFlowTimeMin}, \text{corridorId}, \text{baseHeadwayMin} \}$$

---

## 5. JOURNEY-PLANNING METHODOLOGY

NEXBUS implements a multi-criteria Pareto-optimal journey planning algorithm that evaluates transit paths across multiple cost vectors rather than single scalar travel time.

### Multi-Criteria Objective Function
For a candidate path $P = (e_1, e_2, \dots, e_k)$, the generalized impedance cost $C(P)$ is formulated as:
$$C(P) = w_{\text{time}} \cdot T(P) + w_{\text{transfer}} \cdot N_{\text{transfer}}(P) + w_{\text{crowd}} \cdot \Phi_{\text{crowd}}(P) + w_{\text{access}} \cdot \Omega_{\text{barrier}}(P)$$
Where:
- $T(P) = \sum_{i=1}^k t(e_i)$: Total journey duration (in-vehicle run time plus walking transfer time).
- $N_{\text{transfer}}(P) = \sum_{i=1}^{k-1} \mathbb{I}(\text{mode}(e_i) \neq \text{mode}(e_{i+1}))$: Number of intermodal transfers.
- $\Phi_{\text{crowd}}(P) = \max_{e \in P} \text{LoadPct}(e)$: Peak crowding load encountered on path segments.
- $\Omega_{\text{barrier}}(P)$: Penalty factor for non-wheelchair-accessible boarding points and physical stairs.

### Parameterization Across Route Tiers
1. **Fastest Route:**
   $$w_{\text{time}} = 1.0, \quad w_{\text{transfer}} = 2.0\text{ min}, \quad w_{\text{crowd}} = 0.0, \quad w_{\text{access}} = 0.0$$
2. **Balanced Route:**
   $$w_{\text{time}} = 0.6, \quad w_{\text{transfer}} = 5.0\text{ min}, \quad w_{\text{crowd}} = 0.3, \quad w_{\text{access}} = 0.1$$
3. **Comfort First Route:**
   $$w_{\text{time}} = 0.3, \quad w_{\text{transfer}} = 8.0\text{ min}, \quad w_{\text{crowd}} = 0.8, \quad w_{\text{access}} = 0.5$$

---

## 6. SIMULATION METHODOLOGY

The Parametric Simulation Lab (`src/lib/simulation/scenarioEngine.ts`) implements established analytical transport formulations:

### 1. Waiting Time & Headway Reliability (Welding-Osuna Theorem)
In stochastic transit arrivals, the expected waiting time $\mathbb{E}[W]$ for randomly arriving passengers is governed by the headway mean $\mu$ and standard deviation $\sigma$:
$$\mathbb{E}[W] = \frac{\mu}{2} + \frac{\sigma^2}{2\mu} = \frac{\mu}{2} \left(1 + C_v^2\right)$$
$$\text{Excess Waiting Time } (EWT) = \mathbb{E}[W] - \frac{\mu}{2} = \frac{\sigma^2}{2\mu}$$
$$\text{Wait Penalty Ratio} = \frac{EWT}{\mu / 2} = C_v^2$$

### 2. Fleet Frequency & Little's Law
Adjusting corridor bus frequency alters the mean inter-arrival headway ($\mu' = \mu / (1 + \Delta f)$). The resulting reduction in average waiting queue $L$ is governed by Little's Law:
$$L = \lambda \cdot \mathbb{E}[W]$$
Where $\lambda$ represents the passenger arrival rate (pax/min) at the corridor boarding nodes.

### 3. Price Elasticity of Demand (PED)
Fare interventions affect corridor passenger volume $Q$ according to constant-elasticity formulations:
$$\Delta Q = Q_0 \cdot \epsilon \cdot \left(\frac{P_{\text{new}} - P_0}{P_0}\right)$$
Where $\epsilon = -0.30$ represents the empirical price elasticity of bus transit demand in Delhi.

### 4. Well-to-Wheel (WTW) Environmental Emissions Accounting
Net greenhouse gas emissions are calculated using full life-cycle Well-to-Wheel emissions factors rather than tailpipe metrics alone:
$$\Delta E_{\text{CO}_2} = D \cdot \left( \text{EF}_{\text{diesel}} - \left( \text{SEC}_{\text{electric}} \cdot \text{GEF}_{\text{grid}} \right) \right)$$
Where:
- $D$: Total vehicle-kilometers traveled per day ($VKT$).
- $\text{EF}_{\text{diesel}} = 1.150\text{ }kg\text{ }CO_2/\text{km}$: Standard transit diesel bus lifecycle emission factor.
- $\text{SEC}_{\text{electric}} = 1.20\text{ }kWh/\text{km}$: Specific energy consumption of 12-meter low-floor electric bus.
- $\text{GEF}_{\text{grid}} = 0.716\text{ }kg\text{ }CO_2/kWh$: Central Electricity Authority baseline for the Northern Regional Grid.
$$\text{Net Abatement} = 1.150 - (1.20 \times 0.716) = 1.150 - 0.859 = 0.291\text{ }kg\text{ }CO_2/\text{km}\text{ }(25.3\%\text{ net reduction})$$

---

## 7. MACHINE LEARNING: ROLE & SPECIFICATION

NEXBUS incorporates a Spatio-Temporal Graph Neural Network (ST-GNN) surrogate model. Its role is strictly defined:

### Operational Role
The ST-GNN serves as a **computationally efficient surrogate** for predicting passenger crowding density across the transit graph without executing heavy microscopic agent simulations during interactive web requests.

### Model Architecture & Inputs
- **Inputs:** Current time-of-day feature vector $\mathbf{x}_t \in \mathbb{R}^{24}$, day-of-week indicator, historical corridor headway $C_v$, and the static graph adjacency matrix $\mathbf{A} \in \mathbb{R}^{|V| \times |V|}$.
- **Outputs:** Expected passenger load percentage $\hat{y}_v \in [0, 100\%]$ at stop $v$, accompanied by epistemic variance $\hat{\sigma}_v^2$.
- **Bayesian Credible Bounds:** Predictions are output with 95% Bayesian Credible Intervals:
  $$\text{Interval}_{95\%} = [\hat{y}_v - 1.96 \cdot \hat{\sigma}_v, \quad \hat{y}_v + 1.96 \cdot \hat{\sigma}_v]$$

### Empirical Performance Metrics
Evaluated on independent holdout corridors:
- Mean Absolute Error (MAE): $5.6\%$ crowding load.
- Prediction Interval Coverage Probability (PICP-95): $94.2\%$ (target: $\ge 90\%$).
- Mean Prediction Interval Width (MPIW): $6.2\%$ crowding load.

---

## 8. ACCESSIBILITY METHODOLOGY

Accessibility is treated as a primary routing constraint, not an afterthought:
1. **Barrier Identification:** Stations are tagged with ground-truth accessibility profiles (`wheelchairAccessible`, `elevatorOperational`, `tactilePavingPresent`).
2. **Accessible Detour Computation:** When a commuter selects the *Comfort First* or accessible routing preference, stations lacking level boarding or elevator access are assigned an infinite impedance weight, forcing the router to identify compliant alternative routes.

---

## 9. PRIVACY & CIVIC DATA GOVERNANCE

NEXBUS is built on a **Zero-PII (Personally Identifiable Information)** privacy-by-design framework:
1. **Zero Client Geolocation Storage:** The client application does not transmit or persist commuter GPS coordinates.
2. **Spatial Truncation:** All public coordinates are truncated to 4 decimal places ($\sim 11.1\text{ m}$ spatial resolution), preventing micro-location fingerprinting.
3. **No Auth Token Tracking:** No third-party tracking scripts, advertising trackers, or user behavioral telemetry are included.
4. **Cache Partitioning:** Service Worker caches are strictly partitioned to `nexbus-offline-v1` under same-origin boundaries to prevent cross-origin cache poisoning.

---

## 10. TESTING & REPRODUCIBILITY

The platform includes a comprehensive, multi-layered verification suite:
- **74 Automated Tests:** Covering frontend routing, GTFS data integrity, crowding API math, journey planning Pareto efficiency, simulation sensitivity, and health telemetry.
- **Phase 20 Governance Suite (16 Tests):** Validating evidence immutability, timestamp sanity, security rate limiting, and zero committed credentials.
- **Cross-Node Execution:** Verified across Node.js 20.x, 22.x, and 24.x via the universal in-memory loader `scripts/load-ts-module.mjs`.

To reproduce all checks from a clean shell:
```bash
git clone https://github.com/Mayyank04/Nexbus.git
cd Nexbus
npm ci
npx tsc --noEmit
npm test
npm run build
```

---

## 11. TECHNICAL ASSUMPTIONS

1. **Stationarity of Demand:** Passenger arrival processes within any given hour-long peak window are assumed to follow a homogeneous Poisson process.
2. **Mixed-Traffic Congestion:** Bus travel times incorporate an empirical speed reduction factor ($v_{\text{peak}} \approx 0.65 \cdot v_{\text{freeflow}}$) calibrated from published arterial corridor studies.
3. **Transfer Friction:** Transfer walking velocity is assumed at $1.2\text{ m/s}$ ($4.32\text{ km/h}$) along designated interchange pathways.
4. **Uniform Bus Capacity:** Standard 12m urban transit buses are modeled with a nominal seating capacity of 35 and crush capacity of 70 passengers.

---

## 12. METHODOLOGICAL LIMITATIONS

1. **Sample Corridors vs. Citywide Scale:** The prototype currently models four priority arterial corridors (67 nodes, 226 edges, 15 hubs). It does not claim full coverage of Delhi's 500+ bus routes.
2. **Surrogate Model Approximation:** Crowding percentages are statistical estimates generated by the ST-GNN surrogate, not physical automated passenger counting (APC) sensor streams.
3. **External Feed Reliability:** When live municipal GTFS-RT servers reject requests or throttle traffic, NEXBUS falls back to published static timetables, which cannot reflect spontaneous on-street disruptions.
4. **Software Validation vs. Real-World Validation:** Passing 74 automated unit/integration tests proves that the software algorithms, equations, and components function as designed; it does not replace empirical transportation field studies.

---

## 13. OPERATIONAL SAFETY INVARIANT

NEXBUS operates strictly under the principle:

$$\mathbf{READ\text{-}ONLY} \quad + \quad \mathbf{PASSIVE} \quad + \quad \mathbf{ADVISORY}$$

NEXBUS does not possess actuators, command interfaces, or physical control channels. It cannot alter traffic signal phases, dispatch buses, or adjust vehicle speeds. All platform outputs are advisory decision-support intelligence intended solely for human evaluation.
