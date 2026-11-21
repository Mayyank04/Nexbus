# NEXBUS — OFFICIAL HACKATHON PRESENTATION VIDEO CUE SHEET & SCRIPT
## Word-for-Word Narration, Scene Architecture & Visual Cue Telemetry

**Document Identifier:** `NEXBUS-HACKATHON-DEMO-SCRIPT-2026`  
**Master Video File:** `docs/hackathon-demo/NEXBUS_HACKATHON_DEMO.mp4`  
**Live Public Path:** `public/demo/NEXBUS_HACKATHON_DEMO.mp4` (`https://nexbus.vercel.app/demo/NEXBUS_HACKATHON_DEMO.mp4`)  
**Competition Mirror:** `docs/phase-22/demo/NEXBUS_COMPETITION_DEMO.mp4`  
**Voice Profile:** macOS Speech Engine `Aman (en_IN)` — Natural Indian English  
**Video Resolution:** 1920 x 1080 Full High Definition @ 30.0 fps (H.264 / AAC)  
**Safety Mandate:** `READ-ONLY + PASSIVE + ADVISORY` (Absolute Invariant)  

---

## 1. Scene-by-Scene Chronology & Recording Plan

| Scene # | Time Range | Target Duration | Scene Title & Purpose | Visual Surface |
| :---: | :---: | :---: | :--- | :--- |
| **01** | `00:00 – 00:21` | ~21s | **NEXBUS Title & Platform Overview**<br/>*Introduce the problem* | Live Homepage (`/`) smooth vertical glide revealing Delhi transit challenge, 7,000+ bus network, and architectural pillars. |
| **02** | `00:21 – 00:44` | ~23s | **3D Explore Delhi & Digital Twin**<br/>*Show the digital twin* | Fullscreen 3D WebGL Digital Twin (`/twin?mode=explore`) with cinematic slow zoom on central Delhi NCT corridors. |
| **03** | `00:44 – 01:06` | ~22s | **Beginner-Friendly Guided Exploration**<br/>*Explain the city simply* | Step-by-step guided exploration crossfading between Step 1 (AIIMS Intermodal Hub) and Step 2 (Ring Road circumferential corridor). |
| **04** | `01:06 – 01:31` | ~25s | **Advanced GIS Analysis & 2D Vector Fallback**<br/>*Demonstrate analytical capabilities* | 11 GIS layers drawer active (headway variability, crowding heatmap) wiping left into deterministic 2D vector SVG fallback. |
| **05** | `01:31 – 01:52` | ~21s | **Multi-Criteria Journey Planner**<br/>*Show the three route choices* | Multi-criteria journey computation (`/journey`) displaying 3 Pareto-optimal cards: Fastest, Balanced, and Comfort First. |
| **06** | `01:52 – 02:12` | ~20s | **Parametric Simulation Lab**<br/>*Explain scenario modelling* | Scenario modeling laboratory (`/simulate`) adjusting frequency, fare, and electrification with Little's Law queue metrics and CO2 abatement. |
| **07** | `02:12 – 02:33` | ~21s | **Data Provenance & Methodology**<br/>*Establish trust* | Crossfade from 9-Tier Evidence Taxonomy table (`/methodology`) to Control Observatory registered primary feeds and SHA-256 digests. |
| **08** | `02:33 – 03:14` | ~41s | **Operational Safety Mandate & Closing**<br/>*End with the project's purpose & live links* | Return to 3D Digital Twin affirming non-operational advisory mandate, followed by high-contrast broadcast presentation card. |

---

## 2. Complete Word-for-Word Narration Script

### Scene 1 — Introduction (0:00–0:21)
> **Narration:**  
> "Every day, millions of people depend on public transportation to move through a city. But understanding how different routes, buses, metro connections and passenger demand work together is not always easy.  
> Introducing NEXBUS — a mobility intelligence platform designed to help people understand urban transportation."
- **Visual Action:** NEXBUS homepage. Slowly reveal the project name, Delhi mobility context, 4 architectural pillars, and persistent safety header.

---

### Scene 2 — Explore Delhi (0:21–0:44)
> **Narration:**  
> "At the heart of NEXBUS is an interactive digital representation of Delhi's transport network.  
> Users can explore important roads, bus routes, stops and transport connections through a three-dimensional environment.  
> Instead of looking at complicated technical diagrams, people can explore the transport system visually."
- **Visual Action:** Open Digital Twin. 3D WebGL city canvas with active bus streams, road corridors, and transport hubs. Slow cinematic zoom towards Delhi NCT center.

---

### Scene 3 — Guided Exploration (0:44–01:06)
> **Narration:**  
> "For newcomers, NEXBUS provides a guided exploration experience.  
> It explains what users are looking at, where buses travel, how transport hubs connect, and how different parts of the network relate to one another.  
> The objective is simple: make complex transport information easier for everyone to understand."
- **Visual Action:** Guided tour drawer opens. Smooth transition from Step 1 (AIIMS Multimodal Interchange: Yellow Line Metro + 14 bus routes) to Step 2 (Mahatma Gandhi Ring Road circumferential arterial).

---

### Scene 4 — Advanced Analysis (01:06–01:31)
> **Narration:**  
> "For advanced users, the platform provides an analytical environment with multiple geographic information layers.  
> These layers help examine transport infrastructure, accessibility, passenger demand, connections and potential congestion patterns.  
> Each layer also communicates its data status and limitations, so a model or estimate is not mistaken for a live observation."
- **Visual Action:** Switch to Advanced Analysis. Enable GIS layers (corridor flows, crowding heatmap, headway variance). Wipe transition to 2D vector SVG schematic map fallback.

---

### Scene 5 — Journey Planner (01:31–01:52)
> **Narration:**  
> "NEXBUS also includes a multi-criteria journey planner.  
> Rather than presenting only one route, it provides three different travel priorities: Fastest, Balanced and Comfort First.  
> This helps users compare journey alternatives based on travel time, transfers, waiting and estimated crowding."
- **Visual Action:** Multi-Criteria Journey Planner (`/journey`). Origin: "AIIMS Bus Stop", Destination: "Kashmere Gate Metro". Displays 3 Pareto cards with duration, transfer counts, and crowding load percentiles.

---

### Scene 6 — Simulation Lab (01:52–02:12)
> **Narration:**  
> "The Simulation Lab allows users to explore hypothetical transport scenarios.  
> For example, they can examine how changes in waiting time, passenger demand or transport policy assumptions may affect the system.  
> These are model-based scenarios, not guaranteed real-world outcomes."
- **Visual Action:** Open Simulation Lab (`/simulate`). Interactive sliders adjust frequency (+20%), fare (-15%), and fleet electrification (50%). Results display Little's Law queue reductions (-24% / -3.8 min) and CO2 abatement.

---

### Scene 7 — Data Trust and Methodology (02:12–02:33)
> **Narration:**  
> "Trust is an essential part of NEXBUS.  
> The platform distinguishes observed information from verified external data, estimates, predictions, simulations and synthetic examples.  
> This makes it easier to understand not only what the platform shows, but also what its information can and cannot prove."
- **Visual Action:** Open Methodology & Data Provenance (`/methodology`). Displays 9-Tier Evidence Classification table. Smooth transition to `/control` showing active primary feeds and SHA-256 cryptographic digests.

---

### Scene 8 — Safety and Closing (02:33–03:14)
> **Narration:**  
> "NEXBUS is designed to make urban mobility information more understandable, accessible and useful.  
> It is strictly a read-only, passive and advisory platform. It does not dispatch vehicles or control traffic signals or railway infrastructure.  
> NEXBUS — helping people understand how a city moves."
- **Visual Action:** Return to Digital Twin affirming non-operational advisory mandate. Crossfade to full-screen broadcast hackathon presentation closing slide.

---

## 3. Final On-Screen Presentation Text

```
NEXBUS
Delhi Urban Mobility Intelligence and Advisory Decision-Support Platform
Live Prototype: https://nexbus.vercel.app
Source Code: https://github.com/Mayyank04/Nexbus
READ-ONLY + PASSIVE + ADVISORY
```
