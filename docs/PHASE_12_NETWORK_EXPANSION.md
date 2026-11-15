# NEXBUS Phase 12 — Multimodal Network Expansion & Validation

## 1. Context & Architectural Rationale

In Phase 10 and Phase 11, NEXBUS certified a 67-node, 226-edge rapid transit multimodal backbone representing the principal rapid transit corridors of Delhi (40 Metro stations, 23 Bus stops, 4 Railway terminals across 15 interchange hubs). While structurally coherent and topologically sound, institutional research requires visibility into intermediate bus stops, feeder alignments, and district-level spatial accessibility across the National Capital Territory.

Phase 12 expands this architecture by introducing the **Expanded Multimodal Network Engine** (`src/lib/multimodal/expandedNetworkService.ts`), scaling coverage to **256 geocoded physical stops** across all 11 statutory revenue districts of Delhi.

---

## 2. Network Hierarchy & Dual-Tier Design

To prevent regressions against certified Phase 10/11 benchmark invariants while providing comprehensive spatial data for researchers, the platform establishes a clear dual-tier hierarchy:

1. **Tier 1 — Rapid Transit Arterial Backbone (`networkGraph.ts`):**
   - 67 nodes, 226 edges, 15 interchange hubs.
   - Preserves certified topological small-world metrics (diameter = 8 hops, average path length = 3.92 hops).
   - Serves as the primary rapid transit routing spine.
2. **Tier 2 — Expanded Multimodal Network (`expandedNetworkService.ts`):**
   - 256 physical transit stops across all 11 statutory NCT districts.
   - Complete GTFS Static relational model: Agency (`AGENCY_DTC`, `AGENCY_DIMTS`, `AGENCY_DMRC`, `AGENCY_NR`), Routes (12 major bus & metro lines), Trips, and StopTimes.
   - District-level spatial equity and feeder coverage analysis.

```
+-----------------------------------------------------------------------------------+
|                        NEXBUS MULTIMODAL NETWORK GRAPH                            |
+-----------------------------------------------------------------------------------+
         |                                                   |
         v                                                   v
+---------------------------------------+   +---------------------------------------+
| TIER 1: ARTERIAL BACKBONE (67 NODES)  |   | TIER 2: EXPANDED NETWORK (256 STOPS)  |
| - 40 DMRC Metro Rapid Stations        |   | - 256 Geocoded Corridor Stops         |
| - 23 High-Capacity Bus Terminals      |   | - 12 Strategic Bus/Metro Routes       |
| - 4 Inter-City Railway Terminals      |   | - Full GTFS Referential Integrity     |
| - 15 Field-Surveyed Interchange Hubs  |   | - District-Level Equity Audit         |
+---------------------------------------+   +---------------------------------------+
```

---

## 3. District-Level Spatial Distribution

The expanded network spans all 11 statutory revenue districts of Delhi:

| Statutory District | Stop Count | District Centroid | Primary Corridors & Hubs | Accessible Stops Pct |
|---|---|---|---|---|
| New Delhi | 26 | 28.614°N, 77.209°E | Connaught Place, Shivaji Stadium, Central Secretariat | 54% |
| South | 25 | 28.520°N, 77.205°E | Aurobindo Marg, Mehrauli Terminal, Saket | 48% |
| Central | 24 | 28.645°N, 77.225°E | Kashmere Gate, New Delhi Railway Station, Asaf Ali Marg | 50% |
| South-East | 24 | 28.560°N, 77.275°E | Nehru Place, Sukhdev Vihar, Badarpur Border | 46% |
| South-West | 24 | 28.590°N, 77.050°E | Dwarka Sub-city, Dhaula Kuan, Kapashera | 46% |
| West | 24 | 28.650°N, 77.100°E | Janakpuri, Uttam Nagar, Hari Nagar, Najafgarh Road | 46% |
| North | 23 | 28.700°N, 77.180°E | GT Karnal Road, Vishwavidyalaya, Wazirpur | 48% |
| North-West | 23 | 28.720°N, 77.110°E | Rohini Sectors, Pitampura, Mangolpuri | 48% |
| East | 23 | 28.630°N, 77.295°E | Anand Vihar ISBT, Vikas Marg, Mayur Vihar | 48% |
| Shahdara | 20 | 28.675°N, 77.290°E | Dilshad Garden, Shahdara Junction, GT Road | 45% |
| North-East | 20 | 28.710°N, 77.260°E | Seelampur, Gokulpuri, Wazirabad Bridge | 45% |
| **Total** | **256** | — | — | **47.6% (Mean)** |

---

## 4. GTFS Referential Integrity & Spatial Validation Suite

The `ExpandedNetworkService` implements automated audits for structural consistency:

1. **Agency-to-Route Foreign Key Validation**: Every route references an agency present in `agencies` table (`AGENCY_DTC`, `AGENCY_DIMTS`, `AGENCY_DMRC`, `AGENCY_NR`).
2. **Route-to-Trip Consistency**: Every scheduled trip strictly references an active route ID.
3. **Trip-to-StopTime Referential Binding**: Every stop time maps directly to an existing trip and valid physical stop ID.
4. **Sequence Monotonicity**: Trip stop times are strictly sorted and checked for monotonic increasing sequence (`stop_sequence[i] > stop_sequence[i-1]`).
5. **Geodetic Bounding Invariant**: Coordinates of all 256 stops are asserted within the NCR boundary (28.30°N to 28.95°N, 76.75°E to 77.45°E).
6. **Kinematic Speed Feasibility Auditing**: Implied velocities between consecutive stops are audited against a strict 100 km/h ceiling ($v = \frac{\Delta d}{\Delta t} \le 100\text{ km/h}$) to catch geocoding teleportation anomalies.

---

## 5. API Reference

- `GET /api/network/expanded`: Returns the full validation report, district coverage distribution, and paginated stops.
  - Query parameters:
    - `district`: Filter stops by district name (e.g. `?district=Central`).
    - `limit`: Number of stops returned (default 50).
