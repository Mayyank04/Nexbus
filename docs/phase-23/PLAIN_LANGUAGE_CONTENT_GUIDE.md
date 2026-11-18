# NEXBUS Plain-Language Content & Design Guide
**Phase 23 — Universal Understanding & Cognitive Accessibility**  
**Document Classification:** DESIGN_SYSTEM_SPECIFICATION  
**Safety Invariant:** READ-ONLY + PASSIVE + ADVISORY  

---

## 1. Executive Vision

NEXBUS is built on sophisticated mathematical mechanics (Little's Law queueing, Spatio-Temporal Graph Neural Networks, Furness Iterative Proportional Fitting, and General Transit Feed Specifications). However, an urban mobility platform fails its civic mission if only transportation economists with PhDs can interpret its screens.

This Plain-Language Content Guide establishes the linguistic and cognitive design system that enables an ordinary commuter, school student, first-time internet user, or young child to navigate NEXBUS with zero confusion, while allowing transport planners to access deep analytical rigor with a single click.

---

## 2. The Core Translation Dictionary

| Technical Term | Everyday Plain English | Child-Friendly Explanation |
| :--- | :--- | :--- |
| **Digital Twin** | Interactive Computer Model | A living computer map that shows how the whole city connects |
| **Multimodal** | Bus + Metro + Walking | Mixing different ways to travel (like riding a bus, then walking to a train) |
| **Headway** | Time between buses | How long you wait at the bus stop for the next bus to pull up |
| **Crowding Prediction** | How busy it will be | Checking if you will get a seat or have to stand |
| **Counterfactual Simulation** | "What-if" test | Trying out big ideas in a computer game before trying them on real roads |
| **Origin-Destination (OD)** | From where to where | Where your trip starts and where your trip ends |
| **Interchange Friction** | Transfer hassle | How tricky it is to switch lines (walking stairs, long tunnels, ticket lines) |
| **Isochrone** | Travel-time map | A circle showing everywhere you can travel in 15 or 30 minutes |
| **Fleet Injection** | Adding more buses | Putting extra buses on the road so people don’t wait as long |
| **Signal Priority** | Green light helper | Giving buses green traffic lights so they don’t get stuck at red lights |

---

## 3. The 3-Tier Experience Level Architecture

NEXBUS provides three distinct interaction tiers, selectable from the global navigation bar and synced deterministically across visits:

### Level 1: Easy Explore (Default)
- **Target Audience:** First-time visitors, curious citizens, school students, and younger children.
- **Tone:** Encouraging, plain, direct, and visual.
- **Cognitive Load:** Minimized. Maximum of 3–5 items per view.
- **Controls:** Segmented presets ("8 AM Rush", "2 PM", "6 PM Rush"), 1-click scenario cards, plain-language toggles ("Show Buses", "Show Metro Lines").
- **Prominent Guidance:** Persistent *"What am I looking at?"* 5-question explainer card.

### Level 2: Everyday Commuter
- **Target Audience:** Delhi office workers, university students, and regular bus/metro riders.
- **Tone:** Practical, time-focused, and navigational.
- **Key Information:** Fares in ₹ (including Smart Card 10% discount and women’s Pink Pass), step-free access, transfer walking instructions, and live crowd expectations.

### Level 3: Advanced Analysis
- **Target Audience:** Urban planners, DMRC/DTC operational analysts, transport researchers, and competition evaluators.
- **Tone:** Academically rigorous, empirical, and mathematically explicit.
- **Capabilities:** Exposes all 11 GIS layers, ST-GNN Bayesian confidence intervals ($\pm 95\%$), Poisson arrival rates ($\lambda$), Little’s Law ($L = \lambda W$), and Well-to-Wheel (WTW) grid carbon factors ($0.716\text{ kg CO}_2/\text{kWh}$).

---

## 4. Triple Encoding Rules for Status & Crowding

Never rely on color alone to communicate state, safety, or crowding. Every visual indicator must be encoded in three distinct ways:

```
[ COLOR ] + [ ICON / SYMBOL ] + [ PLAIN-LANGUAGE TEXT ]
```

1. **Quiet / Low Occupancy:**
   - Color: Green (`#15803D` / `emerald-700`)
   - Symbol: Checkmark / Empty circle (`✓` / `🟢`)
   - Text: *"Not Very Crowded"* / *"Plenty of empty seats"*

2. **Moderate / Getting Busy:**
   - Color: Amber (`#D97706` / `amber-600`)
   - Symbol: Tilde / Half-circle (`~` / `🟡`)
   - Text: *"Getting Busy"* / *"Some standing passengers"*

3. **Heavy / Peak Rush:**
   - Color: Terracotta Red (`#B84C32` / `red-700`)
   - Symbol: Exclamation mark / Filled alert (`!` / `🔴`)
   - Text: *"Very Crowded"* / *"Peak rush pack, standing room only"*

---

## 5. Advisory & Simulation Transparency Rules

Every screen containing simulated data or predictions must feature an explicit advisory badge that clearly informs the user:

> **SIMULATED MOVEMENT: Not real-time satellite GPS tracking.**  
> *Vehicles shown move based on mathematical models and published schedules. They show how traffic typically flows, not exact physical coordinates of individual buses right now.*

This prevents false trust, clarifies the difference between predictive models and live sensors, and reinforces the inviolable system invariant: **READ-ONLY + PASSIVE + ADVISORY**.
