# NEXBUS Phase 8 — Multimodal Journey Intelligence, Interchange Analytics & Network Resilience Architecture

## 1. Executive Summary

Phase 8 elevates NEXBUS from a bus-corridor intelligence engine into a comprehensive, multi-tier multimodal urban mobility platform for the National Capital Territory (NCT) of Delhi. The platform integrates Delhi Transport Corporation (DTC) and Delhi Integrated Multi-Modal Transit System (DIMTS) bus networks with Delhi Metro Rail Corporation (DMRC) rapid transit lines, high-density pedestrian transfer hubs, and passive network resilience stress testing.

At the core of Phase 8 is a rigorous epistemological foundation: every observation, calculation, and simulated projection carries an explicit classification (`OBSERVED`, `VERIFIED_EXTERNAL`, `DERIVED`, `ESTIMATED`, `SIMULATED`, `SYNTHETIC`, or `UNAVAILABLE`). NEXBUS operates strictly as a read-only advisory platform with an unconditional Non-Intervention Safety Guarantee.

---

## 2. Multimodal Network Architecture

```
+---------------------------------------------------------------------------------------+
|                                    NEXBUS PLATFORM                                    |
+---------------------------------------------------------------------------------------+
        |                                       |                                   |
        v                                       v                                   v
+-----------------------+           +-----------------------+           +-----------------------+
|  DTC/DIMTS Bus Layer  |           |   DMRC Metro Layer    |           |   Interchange Hubs    |
| (16 Arterial Stops)   |           | (5 Major Lines / Stns)|           | (8 Multimodal Hubs)   |
| Classification:       |           | Classification:       |           | Classification:       |
| VERIFIED_EXTERNAL     |           | VERIFIED_EXTERNAL     |           | DERIVED / FIELD SURVEY|
+-----------------------+           +-----------------------+           +-----------------------+
        \                                       |                                   /
         \                                      |                                  /
          +-------------------------------------+---------------------------------+
                                                |
                                                v
                             +-------------------------------------+
                             |     Unified Multimodal Graph        |
                             |   (Nodes, Edges, Transfer Links)   |
                             +-------------------------------------+
                                                |
               +--------------------------------+-------------------------------+
               |                                |                               |
               v                                v                               v
+------------------------------+ +------------------------------+ +------------------------------+
|  Multimodal Journey Engine   | | Interchange Friction Index   | |  Network Resilience Engine   |
| (Generalized Travel Cost)    | | (IFI Hub Scoring & Audits)   | | (Passive Stress & Detours)   |
| /api/multimodal/plan         | | /api/multimodal/interchanges | | /api/multimodal/resilience   |
+------------------------------+ +------------------------------+ +------------------------------+
               |                                |                               |
               +--------------------------------+-------------------------------+
                                                |
                                                v
                             +-------------------------------------+
                             |  Spatial Accessibility & Isochrones |
                             | (400m / 800m Urban Catchments)      |
                             | /api/multimodal/accessibility       |
                             +-------------------------------------+
```

---

## 3. Network Graph Specification

### 3.1 Node Typology
The graph contains typed nodes representing transit boarding points and transfer zones:
- `BUS_STOP`: Surface-level bus stops with verified WGS84 coordinates and localized 3D scene positions.
- `METRO_STATION`: Underground and elevated rapid transit stations operated by DMRC.
- `INTERCHANGE_HUB`: Physical multimodal connection complexes linking bus bays, metro concourses, and pedestrian walkways.

### 3.2 Edge Typology
The network is connected via typed, directed edges:
1. **Bus Edges (`BUS`)**: Road segment travel times, scheduled and observed headways, and operational speed across DTC corridors (Ring Road, Aurobindo Marg, West-East Radial, Trans-Yamuna, Mehrauli Feeder).
2. **Metro Edges (`METRO`)**: High-frequency bi-directional rapid transit segments on 5 core DMRC lines:
   - **Yellow Line (`#E8B923`)**: Samaypur Badli to HUDA City Centre (via Kashmere Gate, Chandni Chowk, New Delhi, Rajiv Chowk, Central Secretariat, INA, AIIMS, Hauz Khas, Saket). Average speed: 34.5 km/h, typical headway: 3.0 min.
   - **Blue Line (`#1B6CA8`)**: Dwarka Sec 21 to Anand Vihar / Noida (via Janakpuri West, Moti Nagar, Karol Bagh, Rajiv Chowk, Mandi House). Average speed: 33.2 km/h, typical headway: 3.5 min.
   - **Pink Line (`#E05A8D`)**: Ring Road orbital spine (via Janakpuri West, Dhaula Kuan South Campus, INA, Lajpat Nagar, Sarai Kale Khan, Anand Vihar). Average speed: 35.8 km/h, typical headway: 4.0 min.
   - **Violet Line (`#6B3F87`)**: Kashmere Gate to Raja Nahar Singh (via Lal Quila, ITO, Mandi House, Central Secretariat, Lajpat Nagar, Nehru Place). Average speed: 32.0 km/h, typical headway: 4.5 min.
   - **Airport Express (`#F26522`)**: New Delhi Railway Station to Dhaula Kuan / IGI Airport T3. Average speed: 65.0 km/h, typical headway: 10.0 min.
3. **Transfer Edges (`TRANSFER`)**: Pedestrian walking connections between surface bus bays and metro station concourses with surveyed physical walking distances (75m to 340m), vertical level shifts (1 to 3 tiers), and barrier-free accessibility status.

---

## 4. Multimodal Journey Engine

The engine calculates multi-criteria journey options using a Generalized Urban Travel Cost function:

$$C = T_{\text{in-veh}} + w_{\text{wait}} \cdot T_{\text{wait}} + w_{\text{walk}} \cdot T_{\text{walk}} + P_{\text{transfer}} + P_{\text{rel}}$$

Where:
- $T_{\text{in-veh}}$: Pure in-vehicle running time (minutes).
- $w_{\text{wait}} = 1.5$: Perceived passenger disutility weight for waiting at stops/stations.
- $w_{\text{walk}} = 2.0$: Perceived disutility weight for pedestrian walking and interchange transfers.
- $P_{\text{transfer}}$: Modal transfer penalty ($8.0\text{ min}$ for balanced fastest, $25.0\text{ min}$ for least transfers).
- $P_{\text{rel}} = \frac{100 - \text{ReliabilityPct}}{10}$: Headway variance and unreliability penalty.

The engine returns 3 distinct itineraries for passenger comparison:
1. **Fastest Multimodal**: Lowest generalized cost combining Metro Express lines, arterial buses, and transfer links.
2. **Least Transfers**: Route minimizing physical modal transitions and vertical level shifts.
3. **Direct Bus Only**: Surface arterial routing on DTC buses without metro fare or underground descent.

---

## 5. Interchange Friction Index (IFI)

The IFI quantitatively measures pedestrian transfer friction at critical multimodal hubs:

$$\text{IFI} = 0.35 \cdot \left(\frac{D_{\text{walk}}}{100\text{ m}}\right) + 0.25 \cdot L_{\text{vertical}} + 0.20 \cdot F_{\text{crossing}} + 0.20 \cdot \left(\frac{T_{\text{wait}}}{5\text{ min}}\right)$$

Normalized Friction Score (0 to 100) and Letter Grade:
- **Grade A (0–30)**: Minimal friction; direct concourse, barrier-free, escalators operational, sheltered walkway.
- **Grade B (31–50)**: Good interchange; moderate walking distance (<150m), step-free access available.
- **Grade C (51–70)**: Notable friction; multi-level descent, road service lane crossing, or peak concourse congestion.
- **Grade D (71–85)**: High friction; extensive walk (>250m), open weather exposure, steep stairways.
- **Grade E (86–100)**: Severe friction; hazardous pedestrian crossings, severe bottlenecks, inaccessible to wheelchairs.

---

## 6. Passive Network Resilience Engine

The resilience simulator conducts graph stress testing without affecting live operations:
- **Disruption Scenarios**:
  - `ring-road-waterlogging`: Surface bus flow cut between AIIMS and Dhaula Kuan underpass during monsoon flash floods.
  - `yellow-line-maintenance`: Signaling snag between Rajiv Chowk and Kashmere Gate.
  - `ito-junction-gridlock`: Trans-Yamuna cross-river arterial gridlock.
  - `airport-express-suspension`: Dhaula Kuan skywalk structural maintenance.
- **Resilience Metrics**:
  - Global Network Efficiency $E = \frac{1}{N(N-1)} \sum_{i \neq j} \frac{1}{d(i, j)}$
  - Efficiency Loss Percentage $\Delta E / E_0 \times 100$
  - Network Vulnerability Index (0 to 100)
  - Critical Cut-Vertices (interchanges whose failure partitions the transit network)
  - Passenger Detour Delays and Advisory Recommendations.

---

## 7. Non-Intervention Safety Guarantee

**MANDATORY ARCHITECTURAL DIRECTIVE:**
NEXBUS operates strictly as a read-only, decision-support advisory system. Under no circumstances does NEXBUS transmit commands to physical railway signaling, bus dispatch hardware, train automated protection systems, or municipal traffic signal controllers. All outputs represent analytical guidance requiring formal human authority verification prior to operational implementation.
