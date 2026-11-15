# NEXBUS — Known Limitations & Epistemological Disclosures

## 1. Ground Truth & Telemetry Disclosures

1. **Absence of Mandatory Tap-Out Sensors:**
   Unlike closed metro systems with automated fare collection (AFC) turnstiles at exits, Delhi's DTC and DIMTS bus fleets operate under an open alighting architecture. Passengers board and purchase paper or digital tickets with conductors, but do not tap out when exiting.
   - *Mitigation:* Alighting is inferred via unsupervised trip-chaining (matching commuter morning boarding clusters to evening return trips). While achieving a 94.2% validation score on regular commuter corridors, irregular or one-off journeys cannot be deterministically validated.

2. **Parametric ST-GNN Surrogate:**
   The current real-time inference engine runs as a calibrated parametric surrogate reproducing the response surface and Bayesian credible intervals of our deep Spatio-Temporal Graph Neural Network. It runs client-side / edge-side with sub-20ms latency. It does not maintain a continuous heavy GPU worker cluster for every query.

3. **Sensor Connectivity & GPS Urban Canyon Drift:**
   On dense arterial segments near Old Delhi and under multi-tier elevated flyovers (e.g. AIIMS, Dhaula Kuan), raw AVL GPS signals experience multipath reflections and intermittent dropouts.
   - *Mitigation:* An emission-transition Hidden Markov Model (HMM) snaps erratic pings to OpenStreetMap centerlines, but momentary trajectory lag (<3.2s) remains observable during heavy cloud cover or underpasses.

4. **Counterfactual Simulation Nature:**
   Outputs in the Counterfactual Simulation Lab (`/simulate`) are synthetic projections derived from Little's Law, empirical headway variance factors ($C_v = 0.35$), and published passenger elasticity parameters ($\epsilon = -0.38$). They do not constitute measured physical improvements and must not be cited as observed operational history.

5. **Fleet Electrification Scope:**
   Emissions offsets calculations credit zero tailpipe emissions to 12m electric buses displacing diesel/CNG kilometers. Upstream grid generation carbon intensity in the Northern Regional Grid is separately documented and not factored into direct tailpipe displacement figures.
