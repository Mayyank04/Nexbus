# NEXBUS — PHASE 10 GEOSPATIAL DIGITAL TWIN ARCHITECTURE
**Document ID:** `DOC-P10-TWIN-001`  
**Milestone:** Phase 10 — Milestone 5 (`feat: enhance geospatial mobility digital twin`)  
**Status:** Certified & Production Integrated  
**Operational Invariant:** Read-Only + Passive + Advisory (No physical actuators or signal commands)

---

## 1. Executive Summary & Purpose

The NEXBUS Phase 10 Geospatial Digital Twin provides an interactive, web-based 3D/2D representation of the Delhi National Capital Territory (NCT) transit and multimodal transport system. It is designed for transportation planners, network controllers, and policy researchers to visualize:
- City-scale multimodal network topology (DMRC Metro, DTC/DIMTS bus corridors, Indian Railways terminals).
- Passenger demand desire lines and origin-destination trip matrices.
- Dynamic corridor capacity utilization and load stress.
- Multi-hazard urban vulnerability (Yamuna river floodplain flooding, underpass waterlogging, corridor disruption incidents).
- Pedestrian accessibility isochrones and population density equity patterns.

All visual layers operate under strict provenance disclosures: features are categorized as **OBSERVED**, **CALIBRATED ESTIMATE**, or **SYNTHETIC / SIMULATED**.

---

## 2. Three.js Architectural Rendering Principles

### 2.1 Coordinate System & Spatial Transformation
The digital twin anchors the geographic center of Delhi at **Connaught Place** ($28.6328^\circ\text{N}, 77.2197^\circ\text{E}$), transformed into local Three.js coordinates $(X, Y, Z)$ using a planar Mercator-scaled projection:
$$X = (\text{Longitude} - 77.2197) \times 160.0$$
$$Z = -(\text{Latitude} - 28.6328) \times 160.0$$
$$Y = \text{Elevation above datum (meters scaled)}$$

### 2.2 Hierarchical Grouping & Zero-Allocation Layer Toggling
To ensure 60 FPS performance on standard hardware, layer switching does **not** destroy and re-instantiate Three.js geometries:
- 10 distinct `THREE.Group` instances are created at initialization (`metroGroup`, `busesGroup`, `interchangesGroup`, `accessibilityGroup`, `demandGroup`, `flowGroup`, `utilizationGroup`, `disruptionGroup`, `floodRiskGroup`, `demographicsGroup`).
- Toggling the active layer simply toggles `.visible = true / false` on the corresponding groups.
- Shared materials and buffer geometries prevent WebGL context re-allocations and garbage collection pauses.

---

## 3. The 10 Analytical Geospatial Layers

| Layer ID | Name | Visual Representation | Data Provenance |
| :--- | :--- | :--- | :--- |
| `all` | Multimodal Composite | All metro lines, bus corridors, and interchange hubs | `VERIFIED_EXTERNAL` (GTFS Static) |
| `metro` | DMRC Metro Rail | 3D polyline corridors color-coded by official DMRC line branding (Red, Yellow, Blue, Magenta, Violet, Airport) | `VERIFIED_EXTERNAL` |
| `buses` | Arterial DTC Conduits | 3D road ribbons with simulated fleet vehicle movements | `DERIVED` / `CALIBRATED ESTIMATE` |
| `interchanges` | Multimodal Hubs & Terminals | Pulsing beacon cylinders at 15 surveyed transit hubs | `OBSERVED` (Physical Surveys) |
| `demand` | Origin-Destination Zones | Extruded hexagonal/polygonal columns representing zone trip generation | `SIMULATED` (Gravity Model $T_{ij}$) |
| `flow` | Passenger Desire Lines | 3D quadratic Bezier arcs connecting top OD pairs | `SIMULATED` |
| `utilization` | Corridor Load & Congestion | Glow tubes colored by volume-to-capacity ratio (Red: $>85\%$, Amber: $65-85\%$, Green: $<65\%$) | `DERIVED` |
| `accessibility` | Walk Catchment Isochrones | Concentric planar discs (5-min, 15-min, 30-min walking buffers) | `DERIVED` (Circuity $\bar{\gamma} = 1.31$) |
| `disruption` | Hazard Incidents | High-contrast pulsating red hazard rings and vertical locator pins | `SYNTHETIC` (Scenario Modeling) |
| `flood_risk` | Yamuna Flood & Waterlogging | 3D river water tube, 6.0m buffer ribbon, and underpass waterlogging hazard markers | `VERIFIED_EXTERNAL` (Yamuna CWC / PWD) |
| `demographics` | District Population Density | Transparent density discs scaled by Census 2011 projected density | `VERIFIED_EXTERNAL` (Census of India) |

---

## 4. Dual Projection System (3D Isometric vs 2D Nadir)

The digital twin supports instantaneous switching between analytical perspectives:

### 4.1 3D Isometric View
- **Camera Vector:** $(48, 54, 62)$ looking towards origin $(0, 0, 0)$.
- **Field of View:** Perspective FOV $45^\circ$.
- **Analytical Utility:** Provides depth, altitude separation between elevated metro viaducts and surface buses, and parabolic flow arc trajectory visualization.

### 4.2 2D Nadir (Top-Down) View
- **Camera Vector:** $(0, 88, 0.01)$ looking directly downwards at $(0, 0, 0)$.
- **Analytical Utility:** Eliminates perspective distortion for accurate geometric distance estimation, district boundary alignment, and GIS spatial comparison.

---

## 5. Safety & Operational Integrity Governance

1. **Passive Observation Only:** The digital twin does not accept control inputs to modify bus dispatch, signaling interlocks, or road access.
2. **Provenance Watermark:** All rendered viewports display an unambiguous banner: `ANALYTICAL DIGITAL TWIN — SIMULATED / ESTIMATED / OBSERVED VISUALIZATION • READ-ONLY + PASSIVE + ADVISORY`.
3. **No Fabricated Real-Time Telemetry:** Simulated vehicle positions are explicitly tagged as `CALIBRATED ESTIMATE` and never masquerade as authenticated live GPS pings.
