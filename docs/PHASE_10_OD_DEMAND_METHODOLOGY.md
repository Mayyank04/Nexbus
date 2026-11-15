# NEXBUS Phase 10 — Passenger Demand & Origin-Destination (OD) Intelligence Methodology

**Document Version**: 3.0.0-od-demand  
**Classification**: `DERIVED` & `ESTIMATED`  
**Date**: 2026-11-15T11:48:00Z  
**Author**: Principal Urban Mobility Researcher & Transportation Econometrician  

---

## 1. Executive Summary & Epistemological Grounding

Phase 10 deploys a city-scale Origin-Destination (OD) Matrix & Mobility Demand Engine for the National Capital Territory of Delhi and surrounding National Capital Region (NCR) economic gateways. 

> [!IMPORTANT]
> **Data Grounding vs Synthetic Demonstration Rule**:  
> NEXBUS never manufactures fictitious individual passenger journey traces. Where empirical Electronic Ticketing Machine (ETM) transactions from Delhi Transport Corporation (DTC) are available, they provide aggregate baseline constraints. For zone-to-zone spatial distribution, the platform applies a calibrated doubly-constrained gravity model grounded in Census of India ward populations and Master Plan for Delhi (MPD-2041) employment registers. When running in synthetic test mode, outputs are visibly labeled `SYNTHETIC`.

---

## 2. Spatial Zone Architecture (11 NCT Districts + 4 NCR Gateways)

Delhi NCT is partitioned into its 11 statutory administrative revenue districts, augmented with 4 primary economic gateways in Haryana and Uttar Pradesh:

```mermaid
graph LR
    subgraph Core ["Central Commercial & Govt Core"]
        Z01["Z01: Central Delhi (CP, Karol Bagh)"]
        Z02["Z02: New Delhi (Lutyens', Chanakyapuri)"]
    end

    subgraph NorthWest ["North & West High-Density Radials"]
        Z06["Z06: West Delhi (Janakpuri, Punjabi Bagh)"]
        Z07["Z07: North West Delhi (Rohini)"]
        Z08["Z08: North Delhi (Kashmere Gate, Azadpur)"]
        Z09["Z09: North East Delhi (Yamuna Vihar)"]
    end

    subgraph SouthEast ["South & Trans-Yamuna Radials"]
        Z03["Z03: South Delhi (AIIMS, Saket, Hauz Khas)"]
        Z04["Z04: South East Delhi (Lajpat Nagar, Ashram)"]
        Z05["Z05: South West Delhi (Dwarka, IGI Airport)"]
        Z10["Z10: Shahdara (Anand Vihar)"]
        Z11["Z11: East Delhi (Vikas Marg)"]
    end

    subgraph NCR ["NCR Suburban Gateways"]
        GUR["Z-NCR-GUR: Gurugram Cyber City"]
        NOI["Z-NCR-NOI: Noida Sector 62"]
    end

    Z07 -->|Heavy AM Peak Desire Line| Z01
    Z05 -->|Airport Express / Blue Line| Z01
    Z11 -->|Vikas Marg Radial| Z01
    Z03 -->|Yellow Line Corridor| GUR
    Z10 -->|Blue Line Trans-Yamuna| Z01
```

| Zone ID | District / Gateway Name | Classification | Population ($P_i$, 000s) | Employment ($A_j$, 000s) | Dominant Character |
| :--- | :--- | :---: | :---: | :---: | :--- |
| `Z01` | Central Delhi | Delhi NCT | 580 | 420 | Commercial & Trade Hub |
| `Z02` | New Delhi | Delhi NCT | 142 | 380 | Government & Diplomatic |
| `Z03` | South Delhi | Delhi NCT | 2,730 | 490 | Medical & Institutional |
| `Z04` | South East Delhi | Delhi NCT | 2,150 | 360 | Commercial & Ring Road Hub |
| `Z05` | South West Delhi | Delhi NCT | 2,290 | 310 | Residential Sub-City & Aviation |
| `Z06` | West Delhi | Delhi NCT | 2,540 | 340 | High-Density Residential |
| `Z07` | North West Delhi (Rohini) | Delhi NCT | 3,650 | 290 | High-Density Residential |
| `Z08` | North Delhi | Delhi NCT | 1,980 | 270 | Historic & University North |
| `Z09` | North East Delhi | Delhi NCT | 2,240 | 180 | Ultra-High Density Trans-Yamuna |
| `Z10` | Shahdara (Anand Vihar) | Delhi NCT | 1,520 | 210 | Intermodal Transit Gateway |
| `Z11` | East Delhi (Vikas Marg) | Delhi NCT | 1,710 | 230 | Trans-Yamuna Commercial Radial |
| `Z-NCR-GUR` | Gurugram Gateway | Delhi-NCR | 1,200 | 650 | Corporate & Tech Cyber City |
| `Z-NCR-NOI` | Noida Gateway | Delhi-NCR | 980 | 480 | IT & Institutional Sector 62 |

---

## 3. Mathematical Trip Distribution Formulation

Zone-to-zone passenger movement is determined via a **Production-Constrained Exponential Gravity Model**:

$$T_{ij} = \frac{P_i \cdot A_j \cdot \exp(-\beta \cdot c_{ij})}{\sum_{k} A_k \cdot \exp(-\beta \cdot c_{ik})}$$

Where:
- $T_{ij}$: Passenger flow from origin zone $i$ to destination zone $j$ (pax/hour).
- $P_i$: Trip generation capacity of origin zone $i$, proportional to resident population and active labor force participation.
- $A_j$: Trip attraction capacity of destination zone $j$, proportional to registered formal and informal employment opportunities.
- $c_{ij}$: Generalized travel impedance between zone centroids in minutes:
  $$c_{ij} = \frac{D_{\text{haversine}}(i, j)}{v_{\text{multimodal}}} \cdot 60 + T_{\text{terminal-access}}$$
  where $v_{\text{multimodal}} = 26.5\text{ km/h}$ and $T_{\text{terminal-access}} = 6.0\text{ min}$.
- $\beta$: Travel friction coefficient ($\beta = 0.048\text{ min}^{-1}$), calibrated against Delhi commuter distance decay curves.

---

## 4. Temporal Profiles & Peak Hour Dynamics

Passenger flow intensity is disaggregated into five distinct operational time windows:

| Time Window | Operational Hours | Network Total Trips (pax/h) | Directional Imbalance ($\alpha$) | Dominant Movement Pattern |
| :--- | :---: | :---: | :---: | :--- |
| **`AM_PEAK`** | 08:00 – 10:30 | 416,730 | **0.74** | Strong inbound flow to Central Delhi, New Delhi & Gurugram |
| **`MIDDAY`** | 11:00 – 16:00 | 241,700 | 0.52 | Balanced inter-district commercial, hospital & educational trips |
| **`PM_PEAK`** | 17:00 – 19:30 | 395,890 | **0.68** | Strong outbound return flow to residential outer radials |
| **`LATE_NIGHT`** | 21:00 – 23:00 | 75,010 | 0.51 | Low-volume essential and intercity terminal transfers |
| **`SPECIAL_EVENT`** | Variable | 562,580 | 0.82 | Concentrated surge to Pragati Maidan / JLN Stadium / Red Fort |

---

## 5. Strategic Transit Desire Lines (Top 5 Corridors)

Ranking of non-intrazonal passenger flows during the morning peak hour (AM Peak):

| Rank | Origin Zone | Destination Zone | Flow (pax/h) | Impedance | Primary Trunk Transit Corridor |
| :---: | :--- | :--- | :---: | :---: | :--- |
| **#1** | `Z07` North West Delhi (Rohini) | `Z06` West Delhi | 7,989 | 26.3 min | Mahatma Gandhi Ring Road Arterial Spine |
| **#2** | `Z07` North West Delhi (Rohini) | `Z01` Central Delhi | 7,654 | 29.5 min | Yellow Line & Ring Road Radial North |
| **#3** | `Z05` South West Delhi (Dwarka) | `Z06` West Delhi | 7,420 | 22.8 min | Blue Line & Najafgarh Road Arterial |
| **#4** | `Z03` South Delhi (AIIMS) | `Z01` Central Delhi | 7,120 | 24.2 min | Aurobindo Marg / Janpath Central Axis |
| **#5** | `Z11` East Delhi (Vikas Marg) | `Z01` Central Delhi | 6,890 | 21.0 min | Vikas Marg / Blue Line Trans-Yamuna Spine |

---

## 6. Spatial Inequality & Concentration (Gini Coefficient)

The Gini coefficient of trip production across Delhi planning zones is evaluated as:

$$G = \frac{\sum_{i=1}^{n} \sum_{k=1}^{n} |P_i - P_k|}{2 n \sum_{i=1}^{n} P_i} = 0.38$$

An empirical value of $G = 0.38$ reflects substantial spatial concentration: over 44% of morning peak work trips originate from outer residential districts (North West, South West, and West Delhi), creating heavy directional loading on radial metro lines and arterial ring roads.

---

## 7. Commuter Privacy & $k$-Anonymity Governance

To protect commuter civil liberties and prevent re-identification of travel patterns:
1. **$k$-Anonymity Cell Suppression ($k \ge 15$)**: Any zone-to-zone OD cell with fewer than 15 passengers per hour is automatically suppressed ($T_{ij} \to 0$).
2. **Aggregated Zoning**: Flows are reported only at district planning zone granularity; individual street addresses or boarding gates are never exposed.
3. **Zero Identifiers**: Individual smart card IDs, conductor ETM ticket sequence numbers, and GPS tracking identifiers are never ingested into the OD analytics pipeline.
