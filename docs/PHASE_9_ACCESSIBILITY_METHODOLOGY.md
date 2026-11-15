# NEXBUS Phase 9 — Population-Weighted Accessibility & Spatial Isochrone Methodology

**Document Version**: 2.0.0-institutional  
**Classification**: `DERIVED` / `AUDITED_BENCHMARK`  
**Governing Service**: `AccessibilityService` (`src/lib/multimodal/accessibilityService.ts`)

---

## 1. Land-Area Catchment vs. Population-Weighted Accessibility

Phase 9 establishes the necessary mathematical separation between **Land-Area Geographic Coverage** and **Population-Weighted Accessibility**.

### 1.1 Geographic Land-Area Coverage
The land-area catchment ratio measures physical geographic territory within a distance radius $R$ of the transit network:

$$\text{Coverage}_{\text{area}}(R) = \frac{\text{Area}\left(\bigcup_{s \in S} B(s, R) \cap \Omega_{\text{zone}}\right)}{\text{Area}(\Omega_{\text{zone}})}$$

Where $B(s, R)$ is the buffer of radius $R \in \{400\text{ m}, 800\text{ m}\}$ around transit station $s$.

### 1.2 Population-Weighted Accessibility
The population-weighted accessibility index evaluates what percentage of human residents actually reside within reasonable walking distance:

$$A_{\text{pop}}(R) = \frac{\sum_{w \in W} P_w \cdot \left(\frac{\text{Area}(B_{\text{transit}} \cap \Omega_w)}{\text{Area}(\Omega_w)}\right)}{\sum_{w \in W} P_w}$$

Where:
- $W$: Set of administrative wards in the Delhi NCT zone.
- $P_w$: Ward population sourced from Census of India 2011 projected to 2026 under Delhi Master Plan 2041 growth trajectories.

---

## 2. Pedestrian Network Circuity Factor ($\gamma$)

Euclidean straight-line buffers systematically underestimate actual commuter walking distances because street grids, railway tracks, drain canals, and gated perimeters force non-linear paths.

$$\text{Actual Walking Distance } D_{\text{walk}} = \gamma \cdot D_{\text{Euclidean}}$$

Where $\gamma \ge 1.0$ is the **Pedestrian Circuity Factor**:
- **Central Delhi (Planned Grid)**: $\gamma = 1.25$
- **East Delhi (Trans-Yamuna Railway Corridor)**: $\gamma = 1.28$
- **West Delhi (Najafgarh Urban Fabric)**: $\gamma = 1.31$
- **South Delhi (Hilly Aravalli / Outer Ring Road)**: $\gamma = 1.34$
- **North Delhi (Riverine & Industrial Fringe)**: $\gamma = 1.38$

Under an average circuity factor of $\bar{\gamma} = 1.31$, an 800m Euclidean buffer translates to an actual walking distance of $\approx 1,048\text{ meters}$ ($14.0\text{ minutes}$ at $4.5\text{ km/h}$).

---

## 3. Zone Accessibility Comparison & Employment Reach

| Administrative Zone | Land-Area 800m Coverage | Pop-Weighted 800m Accessibility | 30-Min Job Reachability | Dominant Transit Mode |
| :--- | :---: | :---: | :---: | :--- |
| **Central Delhi** | 96.2% | **94.8%** | **91.2%** | DMRC Metro (Yellow/Blue/Violet) & Radial Bus |
| **South Delhi** | 86.8% | **78.4%** | **82.5%** | Metro (Yellow/Pink/Magenta/Violet) & Ring Road Bus |
| **West Delhi** | 82.6% | **79.5%** | **74.5%** | Blue/Green Line Metro & Najafgarh Arterial |
| **East Delhi** | 75.9% | **84.6%** | **77.0%** | Blue/Pink Metro & Vikas Marg Trans-Yamuna Spine |
| **North Delhi** | 78.4% | **69.2%** | **68.0%** | DTC Ring Road Bus & Red/Yellow Metro Lines |

*Key Institutional Insight*: East Delhi has lower land-area coverage (75.9%) but higher population-weighted accessibility (84.6%) due to immense residential density clustered along the Blue and Pink metro spines. North Delhi suffers from peripheral rural-industrial fringes (Narela, Bawana) that depress both metrics.
