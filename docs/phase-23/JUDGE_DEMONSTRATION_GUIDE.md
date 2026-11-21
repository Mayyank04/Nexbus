# NEXBUS: JUDGE DEMONSTRATION & REHEARSAL GUIDE

**Document ID:** `NEXBUS-DEMO-GUIDE-PHASE23`  
**Target Audience:** Competition Judges, Evaluation Panel, and Technical Reviewers  
**Live Prototype URL:** [https://nexbus.vercel.app](https://nexbus.vercel.app)  
**Local Testbed:** `http://localhost:3000` (`npm run dev`)  
**Backup Demonstration Video:** `docs/phase-22/demo/NEXBUS_COMPETITION_DEMO.mp4`  
**Operational Safety Invariant:** `READ-ONLY + PASSIVE + ADVISORY` (Absolute Invariant)

---

## 1. 30-SECOND ELEVATOR PITCH

> "Judges, Delhi moves over 7,000 public buses and 3 million metro commuters daily, but planning tools remain siloed, opaque, and complex.  
> **NEXBUS** is a Delhi-focused Urban Mobility Intelligence and Advisory Decision-Support Platform. Built on Next.js 16 and Three.js, it unites an interactive 3D digital twin, multi-criteria Pareto journey routing, and a real-time policy simulation lab.  
> Every metric is grounded in published transport economics, an open nine-tier evidence taxonomy, and an absolute read-only safety invariant. Explore Delhi with us today at nexbus.vercel.app."

---

## 2. 3-MINUTE LIVE PROTOTYPE WALKTHROUGH

*Target Duration: 180 seconds | Focus: User Experience, Core Workflows, Visual Polish*

### Phase 1: Problem Statement & Cartographic Ethos (0:00 – 0:35)
- **Action:** Open `https://nexbus.vercel.app` on full screen.
- **Visual:** Swiss Transit Cartography design language (`#0A0F1D` Deep Navy, `#F4F6F9` Off-White, `#E11D48` Delhi Red).
- **Spoken Cue:**  
  *"Notice the design language: clean, restrained Swiss cartography without AI glow or marketing fluff. Right at the top, we establish our operational mandate: READ-ONLY, PASSIVE, and ADVISORY. NEXBUS is a decision-support platform for humans, never an automated traffic signal or vehicle dispatch system."*

### Phase 2: Dual-Mode Digital Twin (`/twin`) (0:35 – 1:25)
- **Action:** Click **"Digital Twin"** in the top navigation bar.
- **Visual:** Fullscreen 3D WebGL terrain of the National Capital Territory. Guided tour drawer opens.
- **Spoken Cue:**  
  *"In Mode A: Explore Delhi, users experience an interactive guided tour through Delhi's critical transit arteries. As we advance from AIIMS to the Ring Road and Kashmere Gate, the camera smoothly orbits each multimodal hub while particle streams trace bus flows."*
- **Action:** Toggle **"Advanced Analysis (Mode B)"** and toggle the **"2D Vector Fallback"** switch.
- **Spoken Cue:**  
  *"For transport planners, Mode B exposes eleven GIS analytical layers—headway variance, crowding heatmaps, and accessibility ratings. And if a user operates an older computer or mobile device without WebGL, our instant 2D Vector fallback renders a crisp, deterministic SVG schematic with zero data loss."*

### Phase 3: Multi-Criteria Journey Planning (`/journey`) (1:25 – 2:05)
- **Action:** Click **"Journey"** in the header. Select Origin: `AIIMS`, Destination: `Kashmere Gate Metro`. Click **"Compute Multi-Criteria Route"**.
- **Visual:** Three distinct route cards populate: *Fastest*, *Balanced*, and *Comfort First*.
- **Spoken Cue:**  
  *"Unlike commercial map engines that only solve for shortest travel time, NEXBUS solves a multi-criteria Pareto problem. Fastest gets you there quickly; Balanced minimizes transfer stairs; and Comfort First prioritizes low vehicle crowding and level boarding for elderly and mobility-impaired riders."*

### Phase 4: Parametric Simulation Lab (`/simulate`) (2:05 – 2:40)
- **Action:** Click **"Simulate"**. Adjust Frequency (+20%), Fare (-15%), Fleet Electrification (50%). Click **"Evaluate Counterfactual Scenario"**.
- **Visual:** Instant evaluation display showing Little's Law queue reduction, demand shift, and net CO2 abatement with equations displayed.
- **Spoken Cue:**  
  *"In our Simulation Lab, planners can test policy counterfactuals before spending public money. In real time, it applies Little's Law to estimate queue drops, constant-elasticity demand curves for ridership shifts, and Central Electricity Authority Northern Grid factors for net lifecycle emissions reduction."*

### Phase 5: Provenance, Testing & Conclusion (2:40 – 3:00)
- **Action:** Navigate to `/control` and open the test suite terminal output.
- **Spoken Cue:**  
  *"Every metric is backed by our nine-tier evidence taxonomy and SHA-256 cryptographic digests. The codebase features 74 automated test assertions passing with zero failures, 0 TypeScript errors, and 100% green CI across Node 20 and 22. Thank you."*

---

## 3. 5-MINUTE EXTENDED TECHNICAL WALKTHROUGH

*Target Duration: 300 seconds | Focus: Architecture, Mathematics, Data Governance, Security*

1. **Architecture & Engineering Stack (0:00 – 1:00):**
   - Next.js 16 App Router, React 19 concurrent rendering, TypeScript static typing.
   - Three.js / React Three Fiber with instanced mesh rendering to minimize draw calls on mobile GPUs.
   - PWA caching architecture via `nexbus-offline-v1` service worker ensuring graceful offline degradation.
2. **Mathematical Methodology (1:00 – 2:15):**
   - *Welding-Osuna Formulation:* $\mathbb{E}[W] = \frac{\mu}{2}(1 + C_v^2)$ proving that headway variance ($C_v = 0.34$) incurs excess wait time penalties.
   - *Little's Law:* $L = \lambda W$ linking stop queue length directly to arrival rate and waiting time.
   - *Price Elasticity:* Constant elasticity $\epsilon = -0.30$ predicting ridership changes under fare adjustments.
   - *Well-to-Wheel Emissions:* Net emissions delta factoring CEA Northern Grid carbon intensity ($0.716\text{ kg CO}_2/\text{kWh}$) against diesel baseline ($1.150\text{ kg/km}$).
3. **Machine Learning Surrogate Lifecycle (2:15 – 3:15):**
   - Pre-calibrated Spatial-Temporal Graph Neural Network (ST-GNN) surrogate model.
   - Delivers 5.6% Mean Absolute Error (MAE) on holdout corridor benchmarks.
   - Provides 95% Bayesian Credible Intervals (PICP 94.2%) to reflect predictive uncertainty.
   - *Strict Disclosure:* Explicitly declared as a surrogate model, never disguised as live passenger counting hardware.
4. **Data Governance & Provenance Engine (3:15 – 4:15):**
   - 9-Tier Evidence Taxonomy classifying data from `OBSERVED` through `SIMULATED`.
   - Immutable SHA-256 cryptographic digests verified on application startup.
   - Explicit degradation states (`FRESH`, `AGING`, `STALE`, `EXPIRED`, `UNAVAILABLE`).
5. **Civic Privacy & Safety Mandate (4:15 – 5:00):**
   - Zero PII collection: zero user accounts, zero cookies, zero external tracking pixels.
   - Geolocation privacy: spatial coordinates truncated to 3 decimal places (~110m resolution).
   - Architectural invariant: `READ-ONLY + PASSIVE + ADVISORY`. Codebase enforces zero vehicle control or signal actuation capabilities.

---

## 4. CRITICAL CONTROLS & EXPECTED OUTCOMES MATRIX

| Page / Route | Interactive Control | User Action | Expected Behavioral Outcome |
| :--- | :--- | :--- | :--- |
| `/twin` | **Mode Toggle** | Click "Explore Delhi" or "Advanced Analysis" | Switches between cinematic guided tour and 11 GIS analytical layers. |
| `/twin` | **2D / 3D Switch** | Click "2D Schematic" | Unmounts WebGL canvas; renders accessible SVG arterial schematic. |
| `/twin` | **Tour Navigation** | Click "Next Step" (1 to 6) | Camera animates along Bezier spline to the next designated Delhi transit hub. |
| `/journey` | **Route Inputs** | Select origin and destination, click "Compute" | Computes 3 distinct Pareto-optimal route options with duration, transfer, and crowding data. |
| `/simulate` | **Parameter Sliders** | Adjust Frequency, Fare, or Electrification | Dynamically computes queue changes, demand shift percentage, and daily CO2 abatement. |
| `/control` | **Freshness Filter** | View dataset table | Displays status badges (`FRESH`, `STALE`, `CACHED`) with SHA-256 hashes. |

---

## 5. RECOVERY INSTRUCTIONS: WHAT IF WEBGL FAILS?

If running on a restricted virtual machine, an outdated browser, or hardware with disabled GPU acceleration:
1. **Immediate Fallback:** Click the **"2D Schematic"** toggle located at the top right of the Digital Twin surface.
2. **Alternative Direct URL:** Navigate directly to `https://nexbus.vercel.app/twin?view=2d`.
3. **Technical Explanation to Judges:**  
   *"NEXBUS was engineered with universal accessibility in mind. Our 2D Vector engine renders pure SVG vectors directly in the browser DOM, consuming under 15MB of RAM while preserving the exact spatial topology of the four corridors."*

---

## 6. RECOVERY INSTRUCTIONS: WHAT IF NETWORK FAILS?

If the venue Wi-Fi disconnects or experiences severe packet loss:
1. **PWA Standalone Execution:** If previously loaded, the registered Service Worker (`nexbus-offline-v1`) serves pre-cached application routes and static assets from CacheStorage.
2. **Deterministic Mock Ingestion:** The API layer automatically switches to local partitioned snapshot data with header `X-Nexbus-Data-State: DEGRADED_OFFLINE_CACHE`.
3. **Technical Explanation to Judges:**  
   *"Notice that the application does not crash with a blank white screen. Our Service Worker isolates the offline cache, displays an offline telemetry badge, and clearly labels all served data as CACHED / OFFLINE SNAPSHOT, preventing stale data from masquerading as live telemetry."*

---

## 7. EXPLANATION OF DATA CLASSIFICATIONS

When judges inquire about the data shown on screen, use this concise taxonomy definition:
- **Observed:** Directly extracted from official published schedules (e.g., GTFS station coordinates and line paths).
- **Calibrated Benchmark:** Parameters taken from official government studies (e.g., Central Electricity Authority grid emissions).
- **Estimated:** Statistically derived from historical transit surveys (e.g., Welding-Osuna headway variance $C_v = 0.34$).
- **Predicted:** Generated by the pre-calibrated ST-GNN machine learning surrogate with 95% Bayesian confidence bounds.
- **Simulated:** Counterfactual scenarios computed on the fly based on user-selected policy sliders.
- **Synthetic:** Disclosed fallback mock records utilized strictly during offline demonstration modes.

---

## 8. EXPLANATION OF OPERATIONAL SAFETY INVARIANT

> **Statement to Judges:**  
> *"NEXBUS operates strictly under the mandate of READ-ONLY, PASSIVE, and ADVISORY.  
> 1. READ-ONLY: We query public and municipal transit feeds; we never write to municipal dispatch databases.  
> 2. PASSIVE: The application observes network states; it does not dispatch vehicles, manipulate traffic signals, or alter train interlocking.  
> 3. ADVISORY: All analytical outputs, routing options, and simulation projections are presented to human decision-makers as advisory guidance, never as automated actuation instructions."*

---

## 9. BACKUP DEMONSTRATION USING PHASE 22 MASTER RECORDING

If live internet connectivity is completely lost, execute the backup demonstration:
- **Local File Path:** `docs/phase-22/demo/NEXBUS_COMPETITION_DEMO.mp4`
- **Video Player:** Open with VLC, QuickTime, or Chrome (`open docs/phase-22/demo/NEXBUS_COMPETITION_DEMO.mp4`).
- **Required Disclosure to Judges:**  
  *"Judges, to ensure an uninterrupted evaluation under current venue network constraints, we are showing the authentic, locally recorded 1080p demonstration video captured directly from our running prototype. This is an unedited screen recording of the actual application."*
