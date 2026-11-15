# NEXBUS Phase 8 — Mathematical Methodology, Multi-Criteria Optimization & Resilience Modeling

This document presents the complete mathematical formulations, objective functions, optimization constraints, and physical assumptions governing Phase 8 of NEXBUS.

---

## 1. Generalized Urban Travel Cost Formulation

In urban transit economics, passenger path choice is not governed strictly by clock distance or running time alone, but by *Generalized Cost* ($C$), which accounts for perceived cognitive, physical, and reliability disutilities associated with waiting, walking, and transferring.

### 1.1 Objective Function
For any candidate multimodal path $P = \{e_1, e_2, \dots, e_k\}$ across the multimodal network graph $G = (V, E)$, the generalized cost $C(P)$ is defined as:

$$C(P) = \sum_{e \in P} T_{\text{in-veh}}(e) + w_{\text{wait}} \sum_{e \in P_{\text{transit}}} T_{\text{wait}}(e) + w_{\text{walk}} \sum_{e \in P_{\text{pedestrian}}} T_{\text{walk}}(e) + \sum_{i=1}^{m} P_{\text{transfer}}(i) + P_{\text{rel}}(P)$$

Where:
- $T_{\text{in-veh}}(e)$: In-vehicle running time on transit edge $e$ (minutes).
- $T_{\text{wait}}(e) = \frac{H(e)}{2}$: Expected initial waiting time, where $H(e)$ is service headway under Poisson passenger arrival assumptions.
- $w_{\text{wait}} = 1.5$: Empirically calibrated disutility multiplier for waiting at curbside or station platforms.
- $w_{\text{walk}} = 2.0$: Disutility multiplier for physical walking, reflecting exposure to Delhi's climate, road crossings, and grade changes.
- $P_{\text{transfer}}(i)$: Fixed modal switch penalty:
  - $P_{\text{transfer}} = 8.0\text{ min}$ for `FASTEST` multimodal search.
  - $P_{\text{transfer}} = 25.0\text{ min}$ for `LEAST_TRANSFERS` search (penalizing modal changes heavily to preserve single-seat travel).
- $P_{\text{rel}}(P)$: Headway variance and reliability penalty:
  $$P_{\text{rel}}(P) = \sum_{e \in P} \frac{100 - \text{ReliabilityScore}(e)}{10}$$

### 1.2 Walking Speed and Vertical Level Transitions
Pedestrian walking time along transfer edges is calculated based on horizontal distance and vertical grade transitions:

$$T_{\text{walk}} = \frac{D_{\text{walk}}}{v_{\text{walk}}} + L_{\text{vertical}} \cdot \tau_{\text{vertical}}$$

Where:
- $v_{\text{walk}} = 4.5\text{ km/h} = 75\text{ m/min}$ (average pedestrian walking speed).
- $L_{\text{vertical}}$: Number of grade level changes (e.g., deep underground to surface, or surface to elevated concourse).
- $\tau_{\text{vertical}} = 0.75\text{ min/level}$ (average dwell time for stairs or escalators including queuing).

---

## 2. Interchange Friction Index (IFI)

The Interchange Friction Index (IFI) provides a standardized, objective metric of physical and psychological impedance experienced by commuters during multimodal transfers.

### 2.1 Formula

$$\text{IFI} = w_1 \left(\frac{D_{\text{walk}}}{D_{\text{norm}}}\right) + w_2 L_{\text{vertical}} + w_3 F_{\text{crossing}} + w_4 \left(\frac{T_{\text{wait}}}{T_{\text{norm}}}\right)$$

### 2.2 Calibrated Coefficients
- $w_1 = 0.35$: Weight for horizontal walking distance ($D_{\text{norm}} = 100\text{ m}$).
- $w_2 = 0.25$: Weight for vertical level shifts ($L_{\text{vertical}}$).
- $w_3 = 0.20$: Weight for pedestrian roadway crossings:
  $$F_{\text{crossing}} = N_{\text{crossings}} \cdot 1.5 + (1 - \delta_{\text{covered}}) \cdot 0.5$$
  where $\delta_{\text{covered}} = 1$ if transfer has a covered weather-sheltered walkway, else $0$.
- $w_4 = 0.20$: Weight for transfer waiting headway ($T_{\text{norm}} = 5\text{ min}$).

### 2.3 Normalized Friction Score & Grade Boundaries
The raw index $\text{IFI}_{\text{raw}} \in [1.0, 5.0]$ is mapped to a $0 - 100$ scale:

$$\text{Friction Score} = \min\left(100, \max\left(5, \text{round}(\text{IFI}_{\text{raw}} \times 22)\right)\right)$$

| Score Range | Grade | Description | Operational Benchmark |
| :---: | :---: | :--- | :--- |
| **0 – 30** | **A** | Frictionless Interchange | Covered concourse, $<100\text{m}$ walk, elevators/escalators operational, zero road crossings. |
| **31 – 50** | **B** | High-Quality Interchange | Moderate walk ($100 - 180\text{m}$), dedicated underpass/skywalk, full step-free access. |
| **51 – 70** | **C** | Moderate Friction | Multi-level deep escalator transfer, surface service road crossing, or peak concourse queues. |
| **71 – 85** | **D** | High Friction | Long walk ($>250\text{m}$), open weather exposure, missing elevator connections. |
| **86 – 100** | **E** | Severe Friction | Unsignalized arterial road crossing, inaccessible to wheelchairs, severe pedestrian-vehicle conflict. |

---

## 3. Network Resilience & Disruption Modeling

### 3.1 Global Network Efficiency
Based on Latora & Marchiori's topological efficiency metric, network efficiency $E(G)$ measures how efficiently information or commuters travel over graph $G$:

$$E(G) = \frac{1}{N(N-1)} \sum_{i \neq j \in V} \frac{1}{d(i, j)}$$

Where:
- $N = |V|$: Total number of active transit nodes.
- $d(i, j)$: Shortest path travel time between node $i$ and node $j$.
- If node $j$ is unreachable from $i$, $\frac{1}{d(i, j)} = 0$.

### 3.2 Network Efficiency Degradation
Under a disruption scenario $S$ (removing edges $E_S$ or nodes $V_S$), the relative efficiency drop is:

$$\Delta E = \frac{E(G_{\text{baseline}}) - E(G_S)}{E(G_{\text{baseline}})} \times 100\%$$

### 3.3 Critical Cut-Vertices
A node $v \in V$ is classified as a Critical Cut-Vertex if its removal partitions the connected graph into two or more disconnected components:

$$|V(G \setminus \{v\})| > |V(G)| - 1 \quad \text{or} \quad \Delta E(G \setminus \{v\}) \ge 15\%$$

---

## 4. Environmental Offsets & Carbon Accounting

Transit carbon savings compared to private internal combustion engine (ICE) vehicles are derived using Central Pollution Control Board (CPCB) and International Energy Agency (IEA) fleet emission factors:

$$\Delta \text{CO}_2 = D_{\text{trip}} \cdot (EF_{\text{private}} - EF_{\text{transit}})$$

Where:
- $EF_{\text{private}} = 0.140\text{ kg CO}_2/\text{pax-km}$ (average Delhi private petrol passenger vehicle).
- $EF_{\text{transit}} = 0.035\text{ kg CO}_2/\text{pax-km}$ (blended average for electric metro and CNG/electric bus).
- Net Offset Factor: $\Delta EF = 0.105\text{ kg CO}_2/\text{passenger-km}$.
