# NEXBUS Phase 12 — Pedestrian Network Routing & Accessibility Research

## 1. Executive Summary & Epistemological Transparency

Urban transit equity cannot be evaluated solely through uniform Euclidean circular buffers (e.g. 400m or 800m circles). Real pedestrian journeys in Delhi encounter arterial expressways, fenced railway tracks, un-signalized multilane crossings, foot overbridge (FOB) staircase barriers, and broken footpaths.

Phase 12 evolves the NEXBUS spatial accessibility model from a single circuity factor ($\bar{\gamma} = 1.31$) to a **Multi-Profile Pedestrian Network Routing Framework** integrating OpenStreetMap pedestrian walkways, footways, and universal accessibility barrier constraints.

---

## 2. Multi-Profile Pedestrian Mobility Taxonomy

The framework evaluates physical transit access through three distinct demographic profiles:

```
+-------------------------------------------------------------------------------------------------+
|                               PEDESTRIAN ACCESSIBILITY PROFILES                                 |
+-------------------------------------------------------------------------------------------------+
          |                                   |                                     |
          v                                   v                                     v
+-----------------------+           +-----------------------+             +-----------------------+
| GENERAL COMMUTER      |           | WHEELCHAIR ACCESSIBLE |             | ELDERLY MOBILITY      |
| - Speed: 4.5 km/h     |           | - Speed: 3.0 km/h     |             | - Speed: 3.2 km/h     |
| - Max Catchment: 800m |           | - Max Catchment: 400m |             | - Max Catchment: 500m |
| - Standard stairs/FOBs|           | - 100% Barrier-Free   |             | - Shade/Benches needed|
| - Pop Coverage: 78.6% |           | - Zero unramped curbs |             | - Pop Coverage: 59.4% |
| - Circuity: 1.31x     |           | - Pop Coverage: 43.2% |             | - Circuity: 1.44x     |
|                       |           | - Circuity: 1.62x     |             |                       |
+-----------------------+           +-----------------------+             +-----------------------+
```

### 2.1 Profile Comparative Parameters

| Metric / Parameter | General Pedestrian | Wheelchair Accessible | Elderly Mobility | Unit |
|---|---|---|---|---|
| Nominal Walking Speed | 4.5 | 3.0 | 3.2 | km/h |
| Maximum Acceptable Walk Distance | 800 | 400 | 500 | meters |
| Effective Pedestrian Circuity ($\gamma$) | 1.31 | 1.62 | 1.44 | $\frac{d_{\text{street}}}{d_{\text{euclid}}}$ |
| Barrier-Free Path Requirement | Optional | Mandatory | Highly Desirable | Boolean |
| Ramp Gradient Ceiling | None | $\le 1:12$ ($8.3\%$) | $\le 1:10$ ($10.0\%$) | Ratio |
| Effective NCT Population Coverage | 78.6% | 43.2% | 59.4% | % Population |
| Accessible Jobs within 30 Min | 72.4% | 48.6% | 54.8% | % Employment |
| Key Physical Impedance Factors | Traffic crossing wait times | Missing curb ramps, broken FOB elevators | Extreme heat, lack of tree cover, short green clearance | Qualitative |

---

## 3. Micro-Level Pedestrian Infrastructure Audit (Delhi OSM Network)

The underlying pedestrian network representation incorporates 14,820 OpenStreetMap pedestrian street and walkway segments across the National Capital Territory:

1. **Signalized Crossings (412 cataloged):**
   - Average signal cycle: 120 seconds.
   - Pedestrian green phase clearance interval: typically 15 to 20 seconds.
   - At a walking speed of $1.2\text{ m/s}$ (general) vs $0.8\text{ m/s}$ (elderly/wheelchair), elderly commuters require $\ge 25\text{ seconds}$ to safely cross a 6-lane arterial road (20 meters curb-to-curb), making standard signal timings hazardous.
2. **Un-signalized Road Crossings (1,840 cataloged):**
   - High vehicular volume on Ring Road and Outer Ring Road creates pedestrian crossing delays exceeding 90 seconds during peak periods.
3. **Foot Overbridges & Subways (186 cataloged):**
   - 62% of FOBs lack operating elevators, rendering them inaccessible to wheelchair users.
   - Wheelchair travelers must detour an average of $640\text{ meters}$ to reach the nearest at-grade or ramped crossing, driving effective circuity to $\gamma = 1.62$.

---

## 4. District-Level Spatial Equity & Transit Desert Detection

All 11 statutory NCT revenue districts were evaluated against demographic tables from Census 2011 and the DDA Master Plan for Delhi 2041 (MPD-2041):

- **Spatial Equity Gini Index**: $0.29$ (moderate geographic concentration).
- **Quintile Accessibility Ratio**: $1.82\times$ (residents of top-tier districts such as New Delhi and Central Delhi have $1.82\times$ the transit-accessible job opportunities compared to peripheral districts such as North-East, South-West, or North-West).
- **Identified Transit Deserts (6 major areas):**
  1. *Najafgarh Rural Peripheral Belt (South-West)*: Walk distance to rapid transit exceeds $2.8\text{ km}$.
  2. *Narela Industrial Zone (North)*: Isolated from high-capacity rail/metro.
  3. *Burari Yamuna Floodplain Settlements (North)*: Dense informal housing with unpaved walkways.
  4. *Bawana Resettlement Colony (North-West)*: Bus feeder headways $>35\text{ min}$.
  5. *Mehrauli Southern Ridge Villages (South)*: Steep topography and narrow rights-of-way.
  6. *Kapashera Industrial Border (South-West)*: Dense migrant labor population lacking metro connectivity.

---

## 5. API Reference

- `GET /api/multimodal/accessibility`:
  - Query parameters:
    - `profile`: `'general'` | `'wheelchair'` | `'elderly'`
    - `lat`, `lng`: Coordinates of arbitrary location to query nearest transit stop and walking duration.
