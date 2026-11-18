# NEXBUS Simulation Lab Usability & Curiosity Sandbox Report
**Phase 23 — Counterfactual Exploration, 1-Click Scenarios & Mathematical Transparency**  
**Document Classification:** USABILITY_EVALUATION  
**Safety Invariant:** READ-ONLY + PASSIVE + ADVISORY  

---

## 1. Objective & Design Challenge

Urban transit simulation tools are typically impenetrable black boxes designed only for systems engineers. They present matrix coefficients, elasticity formulas, and mathematical notation without inviting intuitive exploration.

The Phase 23 Simulation Lab transforms this experience into a **Curiosity Sandbox** that welcomes questions from school students, citizen advocates, and planners alike, while preserving the underlying governing equations for academic peer review.

---

## 2. Key Enhancements & Features

### 2.1 1-Click Curiosity Question Cards
Positioned directly below the page heading, three friendly cards allow any user to run an immediate transit experiment without manual configuration:
1. **Fleet Expansion:**  
   *"What happens if we add 10 more electric buses to the Ring Road?"*  
   - Automatically sets corridor to Ring Road, adds 10 buses, sets target headway to 5 minutes, enables signal priority, and runs the agent model.
   - Shows wait times dropping by up to $56\%$ and crowding easing by $62$ points.
2. **Clean Air Day:**  
   *"What happens if we make bus travel free on bad air days?"*  
   - Injects 16 zero-emission electric buses, models private car mode shift, and calculates kilograms of toxic tailpipe emissions averted.
3. **Monsoon Congestion:**  
   *"What happens if a major road is flooded during heavy monsoon rains?"*  
   - Models road speed drops on Outer Ring Road, demonstrating passenger platform queue bottlenecks and headway degradation.

### 2.2 Prominent Advisory & Safety Invariant Notice
A prominent amber banner reinforces the non-actuating nature of the system:
> ⚠️ **ADVISORY SIMULATION: This is a computer test to explore ideas, not a real-world promise.**  
> *NO PHYSICAL DISPATCH • PASSIVE TWIN*

This ensures zero confusion between predictive simulations and municipal traffic management.

### 2.3 Synchronized Split-Screen 3D Comparison
The lab provides two synchronized 3D canvases side by side:
- **Scenario A (Observed Baseline):** Current scheduled bus operations, baseline wait times ($14.2\text{ min}$), and peak crowding ($146\%$).
- **Scenario B (Proposed Counterfactual):** Shows additional electric buses moving in real time with reduced headways and balanced passenger load.

### 2.4 Four Simple Question Answers for Calculated Outcomes
Every simulation clearly answers four human questions:
1. **How many more people can travel?** (Passenger throughput increase)
2. **How much wait time is saved?** (Platform delay reduction in minutes)
3. **What does it cost the city?** (Estimated fleet investment and operating expenditure)
4. **Does air quality improve?** (Kilograms of $CO_2$ and combustion tailpipe smoke avoided)

### 2.5 Academic Integrity & Mathematical Depth Retained
For researchers, transport economists, and competition evaluators in **Advanced Analysis** mode, all formal mathematical formulations remain fully exposed and accessible:
- **Little's Law Queueing Formulation:** $L = \lambda W$
- **Headway Compression & Reliability Model:** $EWT = \frac{\bar{H}}{2} \left(1 + C_v^2\right)$
- **Logit Modal Split Cross-Elasticity:** $\Delta P_i = \beta \cdot \Delta c_i \cdot P_i (1 - P_i)$
- **Well-to-Wheel (WTW) Emission Factors:** Central Electricity Authority (CEA) grid baseline of $0.716\text{ kg } CO_2/\text{kWh}$.

---

## 3. Usability Verification

- 1-click scenario execution executes in $< 450\text{ ms}$.
- Side-by-side canvases maintain consistent frame rates without WebGL context loss.
- Sliders feature immediate numerical and visual feedback.
