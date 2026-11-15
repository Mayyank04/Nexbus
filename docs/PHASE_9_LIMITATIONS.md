# NEXBUS Phase 9 — Institutional Limitations, Analytical Boundaries & Operational Scope

**Document Version**: 2.0.0-institutional  
**Classification**: `AUDITED_BENCHMARK`

---

## 1. Operational & Control Boundaries

1. **Strict Non-Intervention Safety Policy**:
   NEXBUS operates exclusively as a passive decision-support platform. Under no circumstances does the platform directly command physical train interlocking, metro signaling, bus AVL telemetry, or roadway traffic controllers. All rerouting recommendations, frequency synchronizations, and mitigation actions require human transit authority authorization.

2. **Geographic NCT Perimeter**:
   The network topology is bounded strictly by the National Capital Territory (NCT) of Delhi. Extended National Capital Region (NCR) corridors into Haryana (Gurugram, Faridabad, Bahadurgarh) and Uttar Pradesh (Noida, Greater Noida, Ghaziabad) are modeled up to boundary terminal stations.

---

## 2. Modeling Limitations & Analytical Boundaries

1. **Pedestrian Network Distance Approximation**:
   While Phase 9 incorporates empirical circuity factors ($\gamma \in [1.25, 1.38]$) grounded in ward morphology, micro-level pedestrian barriers such as illegal roadside parking, broken footpath slabs, or seasonal water puddles are not dynamically updated in real time.

2. **Demand Grounding & Anonymity Bounds**:
   In compliance with commuter privacy rights, passenger demand intelligence operates under strict $k$-anonymity ($k \ge 15$). Individual origin-destination trajectories are never tracked or reconstructed. Where empirical ticketing streams from private cluster bus operators are unavailable, the platform transparently activates synthetic testing mode (`SYNTHETIC`).

3. **Non-Causal Nature of Machine Learning Explanations**:
   SHAP feature attributions in the model explainability service reflect mathematical variance contributions in the surrogate model. They must not be conflated with clinical counterfactual proofs or causal transport policies.

4. **Constant Fleet Capacity Assumption in Disruption Recovery**:
   Cascade spillover simulations assume available stand-by depot fleet (e.g. Vinod Nagar or Sukhdev Vihar depots). In multi-depot industrial labor actions or severe diesel supply shocks, actual recovery times would exceed simulated bounds.

---

## 3. Recommended Roadmap for Phase 10

1. **Integration of Live Automated Fare Collection (AFC) APIs**: Expand from batch daily audits to 15-minute live station gate transaction feeds once DMRC opens institutional developer APIs.
2. **High-Resolution Microscopic Pedestrian Simulation**: Deploy agent-based pedestrian modeling (e.g. Social Force Model) for complex 3D concourses such as Rajiv Chowk and Kashmere Gate.
3. **Dynamic Air Quality & Heat Exposure Routing**: Incorporate real-time CPCB $PM_{2.5}$ monitoring into generalized walking disutility weights ($w_{\text{walk}}(AQI, T)$).
