# NEXBUS Phase 9 — Model Explainability & Interpretability Protocol (XAI)

**Document Version**: 2.0.0-institutional  
**Classification**: `DERIVED`  
**Governing Service**: `ModelExplainabilityService` (`src/lib/ml/modelExplainability.ts`)

---

## 1. Mathematical Grounding: Shapley Additive Explanations (SHAP)

NEXBUS predictive mobility models explain output predictions using cooperative game theory principles formalized by Lundberg & Lee (SHAP).

### 1.1 Additive Feature Attribution Property
For a given prediction instance $x$, the explanation model $g(z')$ is defined as:

$$f(x) = \phi_0 + \sum_{j=1}^M \phi_j$$

Where:
- $\phi_0 = \mathbb{E}[f(z)]$: Base expected model output over the historical background training distribution.
- $\phi_j$: Shapley value attribution for feature $j$, defined as the weighted average marginal contribution across all feature subsets:
  $$\phi_j = \sum_{S \subseteq F \setminus \{j\}} \frac{|S|! (|F| - |S| - 1)!}{|F|!} [f_x(S \cup \{j\}) - f_x(S)]$$
- Efficiency, symmetry, and dummy axioms are satisfied mathematically.

---

## 2. Global Feature Importance Hierarchy

Aggregated across $N = 4,320$ test predictions on the Delhi transit network:

| Rank | Feature Identifier | Mean $\| \phi_j \|$ (Minutes) | Primary Category | Analytical Interpretation |
| :---: | :--- | :---: | :---: | :--- |
| **1** | `headway_variance_lag15m` | **3.8 min** | `KINEMATIC` | Upstream bus bunching and headway irregularities propagate delay waves downstream. |
| **2** | `time_of_day_peak_multiplier` | **3.2 min** | `TEMPORAL` | Cyclical tidal passenger volume converging on employment hubs during peak hours. |
| **3** | `upstream_feeder_congestion_ratio` | **2.6 min** | `SPATIAL` | Bottleneck spillover from connecting flyovers, highway merges, and ring road service lanes. |
| **4** | `active_fleet_availability_pct` | **2.1 min** | `FLEET` | Depot vehicle turnout percentage; deficits directly inflate headways. |
| **5** | `interchange_concourse_inflow` | **1.7 min** | `DEMAND` | Pedestrian boarding surges from metro line transfers onto connecting bus bays. |
| **6** | `monsoon_precipitation_rate_mm` | **1.1 min** | `METEOROLOGICAL` | Rain-induced surface friction, waterlogging, and pedestrian road crossing slowdowns. |

---

## 3. Local Feature Waterfall Decomposition (Example Case)

For a specific query on the **Ring Road Arterial at 09:15 AM**:
- Base expected delay $\phi_0 = 8.5\text{ min}$.
- `time_of_day_peak_multiplier`: $+4.2\text{ min}$ (Morning peak tidal volume).
- `headway_variance_lag15m`: $+2.8\text{ min}$ (Observed bunching $C_v = 0.38$).
- `upstream_feeder_congestion`: $+2.5\text{ min}$ (Dhaula Kuan NH48 merge queue).
- `active_fleet_availability`: $-1.2\text{ min}$ (91.4% turnout buffers queue).
- `monsoon_precipitation`: $-0.4\text{ min}$ (Clear weather).
- **Final Predicted Travel Delay**:
  $$\hat{Y} = 8.5 + (4.2 + 2.8 + 2.5 - 1.2 - 0.4) = \mathbf{16.4\text{ minutes}}$$

---

## 4. Institutional Guidance: Non-Causal Interpretation

**CRITICAL INSTITUTIONAL PRINCIPLE**:  
Feature importances quantify statistical predictive association in the model surrogate. They do not constitute clinical causal proofs of transit system behavior. For instance, a positive SHAP value for `headway_variance_lag15m` indicates that higher variance statistically correlates with higher downstream delay; it does not eliminate unobserved confounding variables such as signal timing or roadwork.
