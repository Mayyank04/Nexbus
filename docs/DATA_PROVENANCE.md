# NEXBUS — Central Data Provenance Register

## 1. Provenance Statement & Standards

NEXBUS adheres to open science principles. Every geographic coordinate, transit timetable, ridership aggregate, and emissions factor used across the platform is explicitly cataloged below with its originating publisher, source URL, licensing terms, coverage period, and automated validation rules.

---

## 2. Master Data Provenance Register

| Registry ID | Dataset & Publisher | Source URL | License | Temporal Coverage | Geographic Extent | Epistemological Tier | Validation Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `prov-otd-gtfs` | **Open Transit Data Delhi Static GTFS Feed**<br>*Govt of NCT of Delhi / IIIT-Delhi* | [otd.delhi.gov.in](https://otd.delhi.gov.in/data/gtfs/) | Government Open Data License - India (GODL) | 2023–2026 Active Schedules | NCT of Delhi & NCR Bus Routes (482 Routes, 6,480 Stops) | **OBSERVED** | **Verified** (Zero broken route references) |
| `prov-dtc-etm` | **Electronic Ticketing Machine (ETM) Summaries**<br>*Delhi Transport Corporation (DTC)* | [dtc.delhi.gov.in](https://dtc.delhi.gov.in/annual-reports) | Public Domain / Delhi Statistical Handbook | FY 2023–2024 & Historical Bulletins | 44 DTC Depots across 5 Delhi Administrative Zones | **OBSERVED** | **Verified** (Monotonic ticket counter validation) |
| `prov-osm-delhi`| **Delhi Metropolitan Highway Network (Rel 1942586)**<br>*OpenStreetMap Contributors* | [osm.org/relation/1942586](https://www.openstreetmap.org/relation/1942586) | Open Data Commons ODbL | 2026 Active Centerline Graph | Delhi Metropolitan Area (1,484 km²) | **OBSERVED** | **Verified** (Ring Road topology connectivity) |
| `prov-dimts-avl`| **Cluster Bus Automatic Vehicle Location (AVL)**<br>*DIMTS Ltd.* | [dimts.in/transit-technology](http://dimts.in/transit-technology.aspx) | GNCTD Open Transport Terms | 5-Second Telematics Bursts | Arterial Corridors (Ring Road, Radial South, Outer Ring) | **OBSERVED** | **Validated with Constraints** (Kalman filtered) |
| `prov-nexbus-stgnn`| **ST-GNN Demand Surrogate Model**<br>*NEXBUS Intelligence Lab* | [Model Card](file:///Users/mayankgautam/Desktop/nexbus/docs/MODEL_CARD.md) | MIT / Open Architecture | 14.2M Boarding Events + Temporal Holdout | 10 Key Arterial Conduits (184 Monitored Nodes) | **PREDICTED** | **Validated with Constraints** (PICP-95 >= 94.0%) |
| `prov-arai-emissions`| **Urban Bus Drive Cycle & Emissions Factors**<br>*ARAI & CPCB (CPCB/PROBES/136)* | [cpcb.nic.in](https://cpcb.nic.in/emission-factors-transport/) | MoEFCC Public Domain | Commercial Urban In-Use Standards | National Urban Driving Cycle Standards | **ESTIMATED** | **Verified** (1,120 g CO₂/km combustion baseline) |

---

## 3. Data Validation Rules & Automated Sanity Checks

All transit network data loaded into NEXBUS is processed through `src/lib/geoValidation.ts`:

1. **Bounding Box Constraint:**
   $$\text{Latitude} \in [28.40^\circ\text{N}, 28.88^\circ\text{N}], \quad \text{Longitude} \in [76.84^\circ\text{E}, 77.40^\circ\text{E}]$$
   *Any stop coordinate falling outside this boundary is flagged as `OUT_OF_BOUNDS`.*

2. **Stop Identifier Deduplication:**
   Every stop must possess a globally unique identifier (e.g. `stop-aiims`, `stop-cp-regal`). Duplicates trigger a hard validation error.

3. **Monotonic Route Topology:**
   Every route must have at least 2 distinct stop references. All stop IDs referenced in route sequences must resolve against the verified stop dictionary.

4. **Coordinate Metric Projection:**
   WGS84 spherical coordinates are projected to local architectural 3D units centered at Connaught Place:
   $$x = (\text{lng} - 77.2197^\circ) \times 97.40\text{ km/deg} \times 3.65$$
   $$z = -(\text{lat} - 28.6328^\circ) \times 110.85\text{ km/deg} \times 3.65$$

---

## 4. Querying Validation via API

The live status of all registered sources and network sanity can be programmatically audited at:
```bash
curl -s http://localhost:3000/api/network/provenance | jq .
```
