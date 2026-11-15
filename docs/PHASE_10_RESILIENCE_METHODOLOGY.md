# NEXBUS — PHASE 10 MULTIMODAL RESILIENCE & PREDICTIVE DISRUPTION METHODOLOGY
**Document ID:** `DOC-P10-RESIL-001`  
**Milestone:** Phase 10 — Milestone 6 (`feat: add predictive disruption and resilience scenarios`)  
**Status:** Certified & Production Integrated  
**Operational Invariant:** Read-Only + Passive + Advisory (No physical signals, track switches, or vehicle dispatch)

---

## 1. Executive Summary & Purpose

The NEXBUS Phase 10 Resilience & Disruption Engine simulates the systemic impact of localized infrastructure failures, extreme weather events, and demand surges on the 67-node, 226-edge multimodal transit network of Delhi NCT and its NCR gateways.

Transportation networks are susceptible to disproportionate efficiency collapse when critical articulation points (cut-vertices) are compromised. This engine quantifies:
1. Network-wide global efficiency degradation $\Delta E/E_0$.
2. Passenger demand displaced from primary itineraries ($PAX/hr$).
3. Critical cut-vertices whose failure fragments the network.
4. Cascade spillover load onto parallel rapid-transit and road corridors.
5. Marginal efficiency restoration priorities to assist decision-makers in resource allocation.

**Mandatory Notice:** All scenario outputs are classified as **SIMULATED** or **DERIVED**. They represent hypothetical planning models and **must never** be confused with active operational dispatch commands or real-time police notices.

---

## 2. Mathematical Formulations

### 2.1 Global Network Efficiency ($E(G)$)
Following the formulation of Latora & Marchiori (2001, *Physical Review Letters*), global network efficiency measures how efficiently information or passengers are exchanged across the entire transit network:

$$E(G) = \frac{1}{N(N - 1)} \sum_{i \ne j \in V} \frac{1}{d(i, j)}$$

Where:
- $N = 67$ total multimodal nodes in the represented Delhi graph.
- $d(i, j)$ is the shortest path travel time (in minutes) between node $i$ and node $j$, incorporating in-vehicle time, headway waiting time, and multimodal transfer penalties.
- If node $j$ is unreachable from node $i$, $d(i, j) = \infty$, so $\frac{1}{d(i, j)} = 0$.

### 2.2 Relative Efficiency Loss ($\Delta E$)
When scenario $s$ disables a set of nodes $V_s \subset V$ and/or edges $E_s \subset E$, the disrupted graph $G_s = (V \setminus V_s, E \setminus E_s)$ exhibits efficiency $E(G_s)$. The systemic efficiency loss is:

$$\Delta E_s = \frac{E(G) - E(G_s)}{E(G)} \times 100\%$$

Baseline efficiency across the fully operational 67-node network is calibrated at $E(G) = 0.842$.

### 2.3 Vulnerability Index ($V(G, s)$)
The vulnerability index $V(G, s) \in [0, 100]$ combines relative efficiency drop with severity weights and network topological fragmentation:

$$V(G, s) = \min\left(96, \max\left(12, \Delta E_s \times 2.8 + W_{\text{severity}}\right)\right)$$

Where $W_{\text{severity}} = 26$ for `CRITICAL`, $16$ for `SEVERE`, and $6$ for `MODERATE`.

---

## 3. Disruption Archetypes & Scenarios Catalog

| Scenario ID | Archetype | Severity | Primary Target | Displaced Pax/hr | $\Delta E / E_0$ | Recovery Est. |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `station-closure-rajiv-chowk` | `STATION_CLOSURE` | `CRITICAL` | Rajiv Chowk Concourse Hub | 48,000 | 24.8% | 5.0 h |
| `metro-yellow-line-interruption` | `LINE_INTERRUPTION` | `CRITICAL` | Yellow Line (Vishwavidyalaya–Central Sec) | 38,500 | 21.4% | 4.0 h |
| `bus-ring-road-moti-bagh` | `CORRIDOR_DISRUPTION` | `SEVERE` | Ring Road Moti Bagh Flyover | 16,800 | 14.2% | 3.0 h |
| `interchange-anand-vihar` | `TRANSFER_BOTTLENECK` | `MODERATE` | Anand Vihar ISBT / Metro / RRTS Skywalk | 9,200 | 8.6% | 2.0 h |
| `monsoon-yamuna-minto-flooding` | `FLOOD_HAZARD` | `CRITICAL` | Yamuna River Overflow + Minto Underpass | 32,000 | 19.5% | 6.0 h |
| `severe-smog-visibility` | `WEATHER_SMOG` | `SEVERE` | City-Wide Surface Speeds & Elevated Viaducts | 22,500 | 16.8% | 3.5 h |
| `special-event-pragati-maidan` | `SPECIAL_EVENT` | `MODERATE` | Bharat Mandapam / Mathura Road Cordon | 14,000 | 9.2% | 2.0 h |
| `fleet-rationing-curtailment` | `FLEET_RATIONING` | `MODERATE` | Depot Substation 30% Peak Bus Cut | 18,200 | 11.5% | 2.5 h |

---

## 4. Critical Articulation Points (Cut-Vertices)

A cut-vertex is a node whose removal increases the number of connected components or drastically increases average path length. In the Delhi multimodal network, 5 critical hubs have been audited:

1. **Rajiv Chowk (`metro-rajiv-chowk`):** Central intersection of Yellow Line (North-South) and Blue Line (East-West). Failure creates a $24.8\%$ network efficiency drop.
2. **Kashmere Gate (`metro-kashmere-gate`):** Triple-line interchange (Red, Yellow, Violet) and northern inter-state bus gateway.
3. **Dhaula Kuan (`stop-dhaula-kuan`):** Critical southwestern hub integrating Pink Line, Airport Express, and National Highway 48 bus conduits.
4. **ITO Bridgehead (`stop-ito`):** Key trans-Yamuna road crossing linking East Delhi to Connaught Place institutional core.
5. **New Delhi Railway Station (`railway-new-delhi`):** Major national intercity gateway feeding Yellow Line, Airport Express, and Ajmeri Gate bus loops.

---

## 5. Marginal Efficiency Restoration Priority (MERP)

When multiple infrastructure components are simultaneously disrupted, restoration teams must prioritize actions that yield the highest marginal increase in network efficiency per hour of effort:

$$\text{Priority Rank} = \operatorname{argmax}_c \frac{\partial E}{\partial t_c}$$

The engine ranks restoration actions across 4 core subsystems:
1. **Signaling & Power Traction Substation:** Marginal gain $+14.5\%$ (restores trunk line rapid transit).
2. **Interchange Concourse Escalators & Fare Gates:** Marginal gain $+8.2\%$ (restores inter-tier pedestrian throughput).
3. **Arterial Bus Dedicated Lane Clearance:** Marginal gain $+5.4\%$ (provides immediate surface relief).
4. **Depot Feeder Shuttles & Last-Mile Vans:** Marginal gain $+3.1\%$ (restores outer neighborhood feeder connectivity).

---

## 6. Safety & Non-Intervention Principle

```
┌────────────────────────────────────────────────────────────────────────┐
│            STRICT PASSIVE + ADVISORY NON-INTERVENTION NOTICE           │
│                                                                        │
│ NEXBUS is a simulation and analytical decision-support system.         │
│ It does NOT possess control interfaces, API webhooks, or actuator     │
│ relays to physical railway interlocks, signal heads, SCADA networks,   │
│ or bus dispatch telemetry.                                             │
│ All scenario outputs must be vetted by certified transit operators.    │
└────────────────────────────────────────────────────────────────────────┘
```
