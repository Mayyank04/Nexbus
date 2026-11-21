# NEXBUS Phase 24 — Digital Twin Usability & 11 GIS Layers Registry Audit

**Route:** `/twin`  
**Component:** `src/app/twin/page.tsx`  
**GIS Registry:** `src/data/gisLayersRegistry.ts`  
**Audit Date:** November 21, 2026  
**Screenshot Evidence:** [twin-desktop-1440.png](file:///Users/mayankgautam/Desktop/nexbus/docs/phase-24/evidence/screenshots/twin-desktop-1440.png), [twin-mobile-390.png](file:///Users/mayankgautam/Desktop/nexbus/docs/phase-24/evidence/screenshots/twin-mobile-390.png)

---

## 1. Digital Twin Architecture & Usability Redesign

The NEXBUS Digital Twin provides an interactive 3D geospatial representation of Delhi's transit network rendered with Three.js / WebGL, supported by a 100% accessible 2D SVG flat map fallback for low-power mobile devices.

### Key Usability Enhancements in Phase 24:
1. **Mode Separation:** Simple "Explore Delhi" view for everyday commuters vs "Analyst Mode" for transport professionals.
2. **5-Question Orientation Card:** Answers: What am I looking at? How do I move around? What do the colored dots mean? Can I see a flat map? Is this live satellite tracking?
3. **Active Layer Explainability Dossier:** Displays plain title, provenance tier, freshness status, measurement unit, visual legend, and an explicit **"What this layer does NOT prove"** disclosure.

---

## 2. The 11 GIS Vector & Raster Layers Registry

All 11 GIS layers are formally cataloged in `src/data/gisLayersRegistry.ts`:

| Layer ID | Technical Title | Plain Title | Provenance Tier | Freshness | Units | What This Layer Does NOT Prove |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `road_network` | Delhi Arterial & Ring Roads | Delhi Main Roads | `L4_BENCHMARK` | `FRESH` | Road centerline vector | Does not prove sub-second lane-level traffic blockages. |
| `metro_network` | DMRC Metro Lines & Corridors | Metro Train Lines | `L7_HYBRID` | `FRESH` | Track centerline vector | Does not prove train positions inside underground tunnels. |
| `metro_stations` | DMRC Metro Stations | Metro Stations | `L7_HYBRID` | `FRESH` | Point coordinates | Does not prove elevator or escalator operational status. |
| `bus_routes` | DTC/DIMTS Bus Network | Bus Routes | `L4_BENCHMARK` | `FRESH` | Route polyline vectors | Does not prove temporary police road diversions. |
| `bus_stops` | 4,200+ Bus Stops | Bus Stops | `L4_BENCHMARK` | `FRESH` | Stop point coordinates | Does not prove physical shelter or bench availability. |
| `active_buses` | Fleet Telemetry Positions | Buses on the Road | `L7_HYBRID` | `FRESH` | Vehicle coordinates | **Does not prove sub-second GPS; calibrated via schedule models.** |
| `crowding_heat` | Passenger Volume Heatmap | Crowded Corridors | `L1_SYNTHETIC` | `FRESH` | Volume-to-capacity ($\%$) | Does not prove exact headcount in specific bus compartments. |
| `air_quality` | Ambient PM2.5 Grid | Air Quality & Smog | `L4_BENCHMARK` | `AGING` | $\mu\text{g}/\text{m}^3$ ($\text{PM}_{2.5}$) | Does not prove street-level exposure behind closed bus windows. |
| `depots` | DTC Bus Depots & Terminals | Bus Depots & Garages | `L4_BENCHMARK` | `FRESH` | Depot boundary polygons | Does not prove real-time fuel inventory or spare parts. |
| `congestion` | Road Segment Congestion | Traffic Congestion | `L1_SYNTHETIC` | `FRESH` | Speed ratio ($v/v_{\text{free}}$) | Does not prove individual vehicle traffic violations. |
| `ev_chargers` | Electric Bus Charging Hubs | Electric Bus Chargers | `L4_BENCHMARK` | `FRESH` | Kilowatts ($\text{kW}$) | Does not prove momentary electrical grid voltage sags. |

---

## 3. Disclosed Limitations & 2D Flat Map Fallback

### Explicit "What This Layer Does NOT Prove" Disclosure
A primary transparency failure of geospatial dashboards is implying that simulated markers represent live satellite tracking. NEXBUS explicitly warns users in the interface:
> *"The vehicle markers display schedule-calibrated transit models and historical breadcrumb telemetry. They do not represent real-time military satellite tracking or physical onboard camera feeds."*

### 2D Flat Map Fallback
For users on devices without WebGL support, battery savers, or screen reader users:
- A high-contrast 2D SVG map is available with a single click.
- Fully accessible via standard keyboard navigation (`Tab` / `Enter` to select stops).
- Eliminates GPU thermal throttling on low-spec smartphones.
