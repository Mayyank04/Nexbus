# NEXBUS — FINAL DEMONSTRATION VIDEO SCRIPT
## Word-for-Word Narration & Spoken Cue Sheet for Official Competition Walkthrough

**Document Identifier:** `NEXBUS-DEMO-SCRIPT-FINAL-PHASE22`  
**Media Output:** `docs/phase-22/demo/NEXBUS_COMPETITION_DEMO.mp4`  
**Total Runtime:** 2 minutes 40.59 seconds (160.59s)  
**Spoken Language:** English (India) — Voice `Aman (en_IN)`  
**Safety Mandate:** `READ-ONLY + PASSIVE + ADVISORY`  

---

### Segment 1: Introduction & Problem Context (00:00.00 – 00:19.80)
> **Narration:**  
> "Delhi sustains over 7,000 public buses and a massive metro grid, yet planners, researchers, and commuters struggle with fragmented data silos, bunching headways, and opaque crowding. NEXBUS is an open-source urban mobility intelligence and advisory decision-support platform engineered specifically for Delhi's transit ecosystem."

- **Visual Sequence:** Opens on the live NEXBUS homepage (`https://nexbus.vercel.app` / `localhost:3000`). High-contrast Swiss Transit Cartography palette. Smoothly scrolls down past the Delhi mobility problem statement to reveal the four architectural pillars (Digital Twin, Multi-Criteria Routing, Parametric Simulation, Data Governance) and the persistent safety invariant banner.

---

### Segment 2: Platform Overview & Safety Mandate (00:19.80 – 00:43.58)
> **Narration:**  
> "The platform is built on Next.js 16, React 19, and Three.js, running entirely in standard web browsers with zero proprietary plugins. Notice the persistent header affirming our non-negotiable safety invariant: READ-ONLY, PASSIVE, and ADVISORY. NEXBUS never issues operational commands to transit vehicles or traffic signals. It serves purely as an advisory lens for humans."

- **Visual Sequence:** Navigates into the 3D Digital Twin surface (`/twin?mode=explore`). Fullscreen WebGL canvas renders the National Capital Territory terrain. Cursor highlights the top telemetry bar affirming `SAFETY MODE: READ-ONLY + PASSIVE + ADVISORY` and `LIVE TELEMETRY: ACTIVE`. Slow cinematic zoom towards central Delhi.

---

### Segment 3: Digital Twin — Mode A: Explore Delhi (00:43.58 – 01:04.78)
> **Narration:**  
> "Here is the interactive 3D Digital Twin. In Explore Delhi mode, users can follow a guided tour of Delhi's major transit corridors and multimodal hubs. As we cycle through AIIMS, the Ring Road belt, and Kashmere Gate, the camera dynamically orbits each interchange, with animated particle streams visualizing bus flows along arterial axes and bridge crossings."

- **Visual Sequence:** Interactive guided tour drawer opens. Camera transitions smoothly to Step 1 (AIIMS Multimodal Interchange: Yellow Line Metro + 14 bus routes). High-contrast bus markers stream along the Aurobindo radial axis. Transitions to Step 2 (Mahatma Gandhi Ring Road circumferential arterial) showing heavy transit volume.

---

### Segment 4: Advanced GIS Analysis & 2D Vector Fallback (01:04.78 – 01:25.20)
> **Narration:**  
> "Switching to Advanced Analysis reveals eleven specialized GIS analytical layers. Planners can toggle corridor volumes, headway variability, passenger crowding heatmaps, and accessibility barriers. For lower-powered hardware or browsers without WebGL, our deterministic 2D vector fallback preserves full cartographic exploration without data loss."

- **Visual Sequence:** Mode toggle switches to "Advanced Analysis". The 11 GIS layers drawer slides out. Toggles show corridor flows, crowding gradients, and station wheelchair status. Dynamic transition to the 2D Vector schematic view (`/twin?view=2d`), showing clean SVG arterial lines, stops, and transfer nodes.

---

### Segment 5: Multi-Criteria Journey Planning (01:25.20 – 01:44.02)
> **Narration:**  
> "In the Multi-Criteria Journey Planner, we don't just optimize for shortest travel time. NEXBUS computes three distinct Pareto-optimal alternatives: Fastest Route minimizes duration; Balanced Option reduces transfer friction; and Comfort First prioritizes low vehicle crowding and level boarding for elderly and mobility-impaired riders."

- **Visual Sequence:** Navigates to `/journey`. Origin selected as "AIIMS Bus Stop", Destination as "Kashmere Gate Metro". Clicks "Compute Multi-Criteria Route". Displays three distinguishable route cards with duration, transfer counts, and crowding load percentiles.

---

### Segment 6: Parametric Simulation Lab (01:44.02 – 02:04.83)
> **Narration:**  
> "The Parametric Simulation Lab allows transport analysts to evaluate operational counterfactuals risk-free. Using Little's Law, empirical price elasticity, and Central Electricity Authority grid emission factors, analysts can test frequency boosts, fare adjustments, and fleet electrification, calculating waiting time drops and net carbon abatement in real time."

- **Visual Sequence:** Navigates to `/simulate`. Interactive sliders adjust: Frequency (+20%), Fare (-15%), Electrification (50%). Clicks "Evaluate Counterfactual Scenario". Results display Little's Law queue reductions (-3.8 min / -24%), demand shifts (+4.5%), and net carbon abatement (42.8 tons CO2/day) with governing equations displayed.

---

### Segment 7: Data Provenance & Control Observatory (02:04.83 – 02:22.84)
> **Narration:**  
> "Every single metric is backed by our strict nine-tier evidence taxonomy and cryptographic SHA-256 source digests. We clearly distinguish directly observed evidence from statistical estimates, neural network predictions, and hypothetical simulations. There is zero data masquerading."

- **Visual Sequence:** Navigates to `/methodology` displaying the 9-Tier Evidence Classification table. Smooth transition to `/control` (Control Observatory) showing real-time dataset health, registered primary feeds, and cryptographic 64-hex SHA-256 digests.

---

### Segment 8: Operational Safety Mandate & Conclusion (02:22.84 – 02:40.59)
> **Narration:**  
> "NEXBUS currently models four priority arterial corridors across 67 nodes, 226 edges, and 15 hubs. It operates strictly under an absolute READ-ONLY, PASSIVE, and ADVISORY mandate. Explore the live platform today at nexbus.vercel.app."

- **Visual Sequence:** Navigates to `/terms` and `/privacy`. Highlights the Civic Privacy Policy (Zero PII, spatial coordinate truncation to ~11m resolution, no user surveillance). Concludes on the official repository banner and live prototype link `https://nexbus.vercel.app`. Fade to black.
