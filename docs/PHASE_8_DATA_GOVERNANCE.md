# NEXBUS Phase 8 — Data Governance, Epistemological Taxonomy & Provenance

## 1. Principles of Data Governance

NEXBUS adheres to strict data governance principles designed to guarantee empirical transparency, prevent hallucinated live feeds, and ensure institutional reproducibility:

1. **No Data Fabrication**: NEXBUS never fabricates live telemetry, sensor pings, passenger transactions, or institutional approvals.
2. **Epistemological Classification**: Every observation, graph edge, and simulation metric is marked with an unambiguous epistemological tier.
3. **Boundaries of Observation**: Synthetic or simulated data is explicitly tagged and never mixed into empirical operational archives.
4. **Spatial Invariant Enforcement**: All transit stops, stations, and GPS traces must satisfy strict Delhi NCT bounding box constraints ($28.40 \le \text{lat} \le 28.88$ and $76.84 \le \text{lng} \le 77.40$).

---

## 2. Seven Epistemological Classifications

| Tier | Name | Definition & Grounding | Applied In Phase 8 |
| :---: | :--- | :--- | :--- |
| **T1** | `OBSERVED` | Directly captured from physical onboard or wayside sensors with cryptographically verifiable timestamps and hardware device IDs. | Real-time AVL telemetry, GPS positions, ETM transaction logs. |
| **T2** | `VERIFIED_EXTERNAL` | Ingested directly from official transit authority open data repositories, static GTFS publications, or verified regulatory documents. | DMRC Metro station coordinates, line sequences, DTC bus stop registries, published fare charts. |
| **T3** | `DERIVED` | Mathematically calculated through deterministic, reproducible equations or network graph traversals from T1/T2 inputs. | Generalized journey cost, walking transfer times, Interchange Friction Index (IFI), carbon savings. |
| **T4** | `ESTIMATED` | Statistical inferences or machine learning surrogate predictions accompanied by formal uncertainty intervals (e.g. 95% Bayesian Credible Intervals). | Dwell time delay bounds, headway regularity variance, passenger seat probabilities. |
| **T5** | `SIMULATED` | Outputs generated through parametric counterfactual models under artificial or hypothesized boundary conditions. | Disruption scenario stress tests, flood detours, cut-vertex vulnerability scores. |
| **T6** | `SYNTHETIC` | Algorithmically generated data points strictly utilized for offline test harnesses, edge case validation, or benchmark unit testing. | Test harness stress suites, CI/CD mock requests. |
| **T7** | `UNAVAILABLE` | Explicit acknowledgment that data cannot be acquired due to missing sensors, upstream outage, or lack of authorization. | Missing real-time passenger counters on legacy bus models. |

---

## 3. Data Quality Scoring & Invariant Enforcement

Every incoming data record passes through the `evaluateDataQuality()` governance validator in `src/lib/evidence/evidenceClassification.ts`:

### 3.1 Freshness Lag Thresholds
- **Fresh**: $\text{Lag} \le 300\text{ seconds}$ (no score deduction).
- **Aging**: $300\text{ s} < \text{Lag} \le 3600\text{ s}$ ($-10$ points deduction; flagged as `AGING_DATA_BEYOND_5_MIN`).
- **Stale**: $\text{Lag} > 3600\text{ seconds}$ ($-25$ points deduction; flagged as `STALE_DATA_BEYOND_1_HOUR`).

### 3.2 Coordinate Sanity Bounds
- Coordinate records outside the geographic bounding rectangle of Delhi NCT:
  $$\text{Latitude} \in [28.40, 28.88], \quad \text{Longitude} \in [76.84, 77.40]$$
  are rejected with $-40$ points deduction and flagged as `COORDINATES_OUT_OF_DELHI_BOUNDS`.

### 3.3 Deduplication Ledger
- A sliding hash ledger evaluates `hash(sourceId + timestamp + lat + lng)`. Exact duplicates within a 1-hour window are discarded with $-20$ points deduction and flagged as `DUPLICATE_OBSERVATION_DROPPED`.

---

## 4. Source Capability Registry (Phase 8 Multi-Modal Additions)

| Source Identifier | Publisher | Data Mode | Epistemological Tier | Verification Status | Ingestion Frequency |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `DMRC-GTFS-STATIC-2026` | Delhi Metro Rail Corp | Heavy Rail / Rapid Transit | `VERIFIED_EXTERNAL` | Official Public Feed | Static (Quarterly) |
| `DTC-GTFS-STATIC-2026` | Transport Dept GNCTD | Surface Bus Corridors | `VERIFIED_EXTERNAL` | Official OTD Publication | Static (Monthly) |
| `OTD-REALTIME-VEHICLES` | Open Transit Data Delhi | GPS Vehicle Positions | `OBSERVED` | Dynamic Telemetry | Periodic Poll (10-30s) |
| `DIMTS-ETM-TRANSACTIONS` | DIMTS Operations | Ticketing & Passenger Flow | `OBSERVED` | Batch Operations Audit | Daily Audit |
| `NEXBUS-HUB-SURVEY-2026` | NEXBUS Mobility Labs | Pedestrian Hub Geometries | `DERIVED` | Field Survey Benchmark | Semi-Annual Audit |
| `NEXBUS-RESILIENCE-SIM` | NEXBUS Resilience Lab | Stress Testing & Scenarios | `SIMULATED` | Mathematical Simulation | On-Demand Execution |

---

## 5. Epistemological Transparency in User Interfaces

To prevent user misinterpretation, all passenger and dispatcher interfaces visibly present evidence classifications:
- **Itinerary Options**: Distinct badges identifying whether a route's running time is based on `VERIFIED_EXTERNAL` timetables or `ESTIMATED` traffic delays.
- **Interchange Cards**: Explicit `DERIVED` tags detailing the field survey metrics used to calculate the IFI score.
- **Resilience Simulator**: Prominent banner marking disruption metrics as `SIMULATED (ADVISORY ONLY)` with the Non-Intervention Safety Guarantee.
