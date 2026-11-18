# NEXBUS: OFFICIAL COMPETITION SUBMISSION DOSSIER
## Complete Multi-Deliverable Submission Index & Judge Evaluation Guide

**Project Title:** NEXBUS — Delhi Urban Mobility Intelligence and Advisory Decision-Support Platform  
**Target Domain:** Urban Mobility / Sustainable Transportation / Smart Cities  
**Target Geography:** National Capital Territory (NCT) of Delhi, India  
**Public Repository:** [https://github.com/Mayyank04/Nexbus](https://github.com/Mayyank04/Nexbus)  
**Live Production Deployment:** [https://nexbus.vercel.app](https://nexbus.vercel.app)  
**Release Branch:** `phase-22-final-demonstration-and-submission-certification`  
**Operational Safety Invariant:** `READ-ONLY + PASSIVE + ADVISORY` (Absolute & Non-Negotiable)  
**Submission Date:** November 18, 2026  

---

## 1. FIVE REQUIRED COMPETITION DELIVERABLES

The NEXBUS competition submission fulfills all five mandated evaluation deliverables:

| # | Competition Deliverable | Primary Submission Artifact | Format / Target URL | Current Verification Status |
| :-: | :--- | :--- | :--- | :---: |
| **1** | **Project Proposal** | [`docs/phase-21/NEXBUS_COMPETITION_PROPOSAL.md`](../phase-21/NEXBUS_COMPETITION_PROPOSAL.md) | Markdown / PDF-Exportable | 🟢 **`COMPLETE_VERIFIED`** |
| **2** | **Working Prototype** | Production Cloud Deployment | [https://nexbus.vercel.app](https://nexbus.vercel.app) | 🟢 **`COMPLETE_VERIFIED`** |
| **3** | **Public Source Code & README** | Git Repository & Root Documentation | [https://github.com/Mayyank04/Nexbus](https://github.com/Mayyank04/Nexbus) · [`README.md`](../../README.md) | 🟢 **`COMPLETE_VERIFIED`** |
| **4** | **Technical Note** | [`docs/phase-21/NEXBUS_TECHNICAL_NOTE.md`](../phase-21/NEXBUS_TECHNICAL_NOTE.md) | Markdown / Mathematical Monograph | 🟢 **`COMPLETE_VERIFIED`** |
| **5** | **Demonstration Video** | Master Video File: [`docs/phase-22/demo/NEXBUS_COMPETITION_DEMO.mp4`](demo/NEXBUS_COMPETITION_DEMO.mp4)<br/>Thumbnail: [`docs/phase-22/demo/DEMO_THUMBNAIL.png`](demo/DEMO_THUMBNAIL.png) | MP4 (1080p, 30fps, H.264 / AAC, 160.59s, 10.75 MB) | 🟢 **`LOCALLY_VALIDATED`** |

---

## 2. DELIVERABLE ACCESS & EVALUATION GUIDE FOR JUDGES

### Deliverable 1: Project Proposal
- **Path:** [`docs/phase-21/NEXBUS_COMPETITION_PROPOSAL.md`](../phase-21/NEXBUS_COMPETITION_PROPOSAL.md)
- **Summary:** Outlines Delhi's multimodal transit challenges (7,000+ buses, 390+ km metro, scheduling opacity, headway bunching), target users (planners, researchers, commuters), architectural solution, 4-corridor scope (67 nodes, 226 edges, 15 hubs), data provenance, and explicit limitations without fabricated partnerships.

### Deliverable 2: Working Live Prototype
- **Live Cloud URL:** [https://nexbus.vercel.app](https://nexbus.vercel.app)
- **Local Fallback:** `http://localhost:3000` (run `npm run dev` after `npm ci`)
- **Key Live Interactions for Evaluators:**
  1. *Landing Page:* Overview of NCT Delhi transit challenges and architecture pillars.
  2. *Digital Twin (Mode A — Explore Delhi):* Navigate to `/twin`. Click "Start Guided Tour" to experience camera fly-throughs of AIIMS, Ring Road, and Kashmere Gate.
  3. *Digital Twin (Mode B — Advanced Analysis):* Toggle between Explore and Advanced Analysis. Toggle 11 GIS layers (corridor flows, crowding heatmaps, accessibility barriers). Click "2D Vector Mode" for low-power SVG schematic.
  4. *Multi-Criteria Journey Planner:* Navigate to `/journey`. Select "AIIMS Bus Stop" $\to$ "Kashmere Gate Metro". Click "Compute Routes". Compare *Fastest*, *Balanced*, and *Comfort First* route alternatives.
  5. *Parametric Simulation Lab:* Navigate to `/simulate`. Move frequency slider to +20%, fare slider to -15%, electrification to 50%. Click "Evaluate Scenario". Observe Little's Law queue reductions and Well-to-Wheel CO2 abatement.
  6. *Methodology & Provenance:* Navigate to `/methodology` and `/control` to inspect the 9-tier evidence classification taxonomy and cryptographic SHA-256 digests.

### Deliverable 3: Public Source Code & Documentation
- **Repository URL:** [https://github.com/Mayyank04/Nexbus](https://github.com/Mayyank04/Nexbus)
- **Primary Branch:** `phase-22-final-demonstration-and-submission-certification`
- **Installation Reproducibility:**
  ```bash
  git clone https://github.com/Mayyank04/Nexbus.git
  cd Nexbus
  git checkout phase-22-final-demonstration-and-submission-certification
  npm ci
  npx tsc --noEmit
  npm test
  node scripts/test-phase20-governance.mjs
  npm run build
  npm start
  ```
- **Security Sanitization:** `.env.example` is committed with zero secrets or private API keys.

### Deliverable 4: Technical Note
- **Path:** [`docs/phase-21/NEXBUS_TECHNICAL_NOTE.md`](../phase-21/NEXBUS_TECHNICAL_NOTE.md)
- **Summary:** Concise, mathematically rigorous specification covering:
  - System architecture and decoupling.
  - Welding-Osuna headway waiting time formulation ($\mathbb{E}[W] = \frac{\mu}{2}(1 + C_v^2)$, $\text{Wait Penalty} = C_v^2 = 11.5\%$).
  - Little's Law queueing relation ($L = \lambda W$).
  - Constant-elasticity price response ($\epsilon = -0.30$).
  - Well-to-Wheel life-cycle carbon accounting utilizing Central Electricity Authority grid baselines ($0.716\text{ }kg\text{ }CO_2/kWh$).
  - Spatio-Temporal GNN surrogate model role, inputs, and 95% Bayesian Credible Intervals.

### Deliverable 5: Demonstration Video
- **Master Video File:** [`docs/phase-22/demo/NEXBUS_COMPETITION_DEMO.mp4`](demo/NEXBUS_COMPETITION_DEMO.mp4)
- **High-Resolution Thumbnail:** [`docs/phase-22/demo/DEMO_THUMBNAIL.png`](demo/DEMO_THUMBNAIL.png)
- **Cue Sheet & Script:** [`docs/phase-22/demo/DEMO_SCRIPT_FINAL.md`](demo/DEMO_SCRIPT_FINAL.md)
- **Telemetry & Recording Log:** [`docs/phase-22/demo/DEMO_RECORDING_LOG.md`](demo/DEMO_RECORDING_LOG.md)
- **Quality & Stream Report:** [`docs/phase-22/demo/DEMO_VALIDATION_REPORT.md`](demo/DEMO_VALIDATION_REPORT.md)
- **Video Specifications:**
  - Container: MP4 (H.264 High Profile / AAC)
  - Dimensions: $1920 \times 1080$ (1080p Full HD)
  - Frame Rate: 30 fps (4,815 frames)
  - Duration: 160.59s (2 minutes 40.59s)
  - File Size: 10.75 MB
  - Narration: Natural English (India) speech synthesis (`Aman en_IN`)

---

## 3. SUBMISSION PORTAL UPLOAD INSTRUCTIONS (FOR SUBMITTER)

If the competition portal requires direct file uploads, submit the following files from this repository:

1. **Proposal Document:** Export [`docs/phase-21/NEXBUS_COMPETITION_PROPOSAL.md`](../phase-21/NEXBUS_COMPETITION_PROPOSAL.md) or upload as Markdown.
2. **Technical Note:** Upload [`docs/phase-21/NEXBUS_TECHNICAL_NOTE.md`](../phase-21/NEXBUS_TECHNICAL_NOTE.md).
3. **Demonstration Video File:** Upload [`docs/phase-22/demo/NEXBUS_COMPETITION_DEMO.mp4`](demo/NEXBUS_COMPETITION_DEMO.mp4) (10.75 MB, compliant with standard upload limits).
4. **Video Thumbnail:** Upload [`docs/phase-22/demo/DEMO_THUMBNAIL.png`](demo/DEMO_THUMBNAIL.png).
5. **Live Prototype URL:** Submit `https://nexbus.vercel.app`.
6. **Source Code URL:** Submit `https://github.com/Mayyank04/Nexbus`.
