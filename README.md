# NEXBUS
## Delhi Urban Mobility Intelligence and Advisory Decision-Support Platform

[![Next.js 16](https://img.shields.io/badge/Next.js-16.4.6-000000?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19.0.0-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript 5](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Three.js](https://img.shields.io/badge/Three.js-WebGL%202.0-black?style=flat-square&logo=three.js)](https://threejs.org/)
[![Safety Invariant](https://img.shields.io/badge/Safety-READ--ONLY%20%2B%20PASSIVE%20%2B%20ADVISORY-1B4D3E?style=flat-square)](#safety-invariant)
[![WCAG 2.2](https://img.shields.io/badge/Accessibility-WCAG%202.2%20AAA%20(14.2:1)-blue?style=flat-square)](docs/phase-20/ACCESSIBILITY_AND_CHILD_FRIENDLY_GOVERNANCE.md)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

**Project:** NEXBUS  
**Repository:** [https://github.com/Mayyank04/Nexbus](https://github.com/Mayyank04/Nexbus)  
**Release Baseline:** Phase 20 — `87f684e`  
**Project Category:** Urban Mobility / Smart Cities / Transportation Intelligence  
**Design Archetype:** Swiss Transit Cartography & Editorial Monograph

---

### 1. Problem Statement

Urban mobility systems involve multiple interconnected components, including bus routes, transit stops, intermodal connections, passenger demand, accessibility, and service conditions.

Understanding these components together is challenging when information is distributed across different datasets and analytical tools. Transport planners, researchers, and commuters may struggle to interpret network structure, compare mobility scenarios, and understand the reliability and limitations of available information.

There is a need for an integrated platform that makes urban mobility networks easier to explore and provides transparent, data-informed analytical support.

---

### 2. Proposed Solution

NEXBUS is a Delhi-focused urban mobility intelligence and advisory decision-support platform.

It combines an interactive Digital Twin, geospatial visualization, journey planning, mobility analytics, and simulation capabilities in a unified application.

The platform is designed to help users explore transport infrastructure, understand network relationships, inspect mobility indicators, and compare analytical scenarios.

NEXBUS follows an absolute **READ-ONLY + PASSIVE + ADVISORY** principle. It does not dispatch vehicles, control traffic signals, operate railway infrastructure, or execute transport-system commands.

---

### 3. Key Features

#### A. Interactive Digital Twin
NEXBUS provides two complementary experiences:
- **Explore Delhi:** A guided, newcomer-friendly exploration experience covering major corridors, transit stops, bridges, and intermodal hubs with high-contrast bus meshes and friendly educational beats.
- **Advanced Analysis:** A detailed analytical interface with 11 geospatial layers, headway variability ($C_v = 0.34$), spatial crowding heatmaps, and telemetry indicators.
- **2D Vector Fallback:** A dedicated, lightweight interactive SVG schematic map available when WebGL is unsupported or when low-power hardware experiences context loss (`?view=2d`).

#### B. Mobility Network Analytics
The platform provides tools to explore transport-network structure, corridor relationships, 256 stop nodes, and intermodal connections across the National Capital Territory of Delhi.

#### C. Journey Planning
Users can explore multi-criteria journey planning across three Pareto-optimal tiers:
1. **Fastest Route:** Minimizes total in-vehicle run time and pedestrian transfer duration.
2. **Balanced Option:** Trades marginal travel time for reduced transfer complexity and comfortable transfers.
3. **Comfort First:** Maximizes seating probability by prioritizing low-crowding buses and grade-separated metro connections.

#### D. Simulation and Predictive Analysis
NEXBUS supports analytical simulations and model-based outputs:
- **Little's Law Engine:** Calculates delay reductions and fleet requirements under varied headways.
- **Price Elasticity Modeling:** Estimates modal shift under parametric fare changes ($\varepsilon = -0.35$).
- **Well-to-Wheel Emissions:** Computes tailpipe and life-cycle $\text{CO}_2$ abatement from fleet electrification.
- Predictive and simulated results are explicitly distinguished from directly observed information.

#### E. Data Provenance and Freshness
The platform implements a unified 9-tier evidence classification framework:
- `OBSERVED`
- `VERIFIED_EXTERNAL`
- `DERIVED`
- `ESTIMATED`
- `PREDICTED`
- `SIMULATED`
- `SYNTHETIC`
- `UNAVAILABLE`
- `AUTH_REQUIRED`

This makes the origin, classification, and limitations of information transparent through accessible UI badges and detailed dossiers.

#### F. Offline and Responsive Access
The web application supports responsive layouts across all viewports (desktop, tablet, mobile) and Progressive Web App (PWA) functionality, including service-worker-based offline degradation handling.

---

### 4. Technical Approach

The project follows a modular, high-reliability web architecture:
- **Next.js 16 (Turbopack) & React 19:** Application core, server routing, and streaming SSR.
- **TypeScript 5:** End-to-end static type enforcement and schema safety.
- **Three.js & React Three Fiber:** Geospatial 3D Digital Twin with draw-call batching (`InstancedMesh`).
- **Tailwind CSS:** Swiss Transit Cartography design tokens (Warm Ivory `#F5F0E6`, Prussian Ink `#0D1B2A`, Signal Red, Forest Green, Amber Gold).
- **Zod & Middleware:** Strict runtime input validation, sliding-window rate limiting (120 req/min), and defensive security headers.
- **Service Worker (`sw.js`):** PWA offline app shell caching and degraded API envelopes.
- **Automated Verification:** 74 automated test assertions covering transit networks, ML holdouts, API contracts, and safety invariants.

---

### 5. Data and Methodology

NEXBUS organizes information through an auditable 8-stage data lifecycle:

$$\mathbf{Source \to Adapter \to Validation \to Normalization \to Storage \to Model \to API \to UI}$$

Data is not automatically considered verified merely because it is available through an API.

Each dataset is assigned an evidence classification. Derived metrics retain their methodological context, while predictions and simulations remain distinct from observed information.

The Phase 20 implementation reports six core datasets and eight upstream capability feeds in its registries:
1. **Open Transit Data (OTD) Delhi Static GTFS:** Schedule timetables and route paths.
2. **Delhi Transport Corporation (DTC) ETM Aggregates:** Depot-level boarding curves.
3. **OpenStreetMap (OSM) Transit Graph:** Highway centerlines and stop platform nodes.
4. **DIMTS Cluster Bus Telematics:** Calibrated kinematic speed distributions.
5. **NEXBUS ST-GNN Surrogate Model:** Neural network crowding predictions with Bayesian Credible Intervals.
6. **ARAI / CPCB Emission Factors:** Standard Indian urban transit emissions factors.

---

### 6. Expected Impact

NEXBUS aims to:
- Make urban transport networks easier to understand for citizens, students, and planners.
- Improve the accessibility of civic mobility information.
- Help users explore relationships between transport corridors and intermodal hubs.
- Support transparent comparison of analytical scenarios.
- Encourage responsible use of predictive and simulated information without false claims of real-time certainty.
- Provide an open, reproducible foundation for further research into urban mobility intelligence.

**NEXBUS is an advisory platform. Its outputs are not substitutes for official transport-system decisions or operational control procedures.**

---

### 7. Current Implementation Status

The Phase 19 and Phase 20 engineering reports describe:
- **Desktop & Mobile Web:** Fully operational and visually verified across 6 viewports ($1440 \times 900$, $1280 \times 800$, $768 \times 1024$, $430 \times 932$, $390 \times 844$, $360 \times 800$).
- **PWA & Offline Resilience:** Active service worker with offline degradation handling and standalone manifest.
- **Digital Twin:** Dual-mode 3D visualization (Explore vs Analyst) with automatic 2D SVG fallback.
- **Data Provenance & Freshness:** Explicit freshness states (`FRESH`, `AGING`, `STALE`, `EXPIRED`, `UNKNOWN`, `UNAVAILABLE`) and non-elevation rules.
- **Security & Reliability:** Sliding-window rate limiting, 0 CVEs (`npm audit`), zero PII collection.
- **CI/CD Workflows:** Automated GitHub Actions quality gates and release governance pipelines.

*Native Android, iOS, macOS, Windows, and Linux packaging configurations are architecturally verified (`CONFIG_VERIFIED`), but are not represented as native runtime-certified on local hosts lacking native SDK toolchains.*

---

### 8. Project Links & Documentation

- **GitHub Repository:** [https://github.com/Mayyank04/Nexbus](https://github.com/Mayyank04/Nexbus)
- **Phase 20 Master Audit:** [docs/phase-20/PHASE20_MASTER_AUDIT.md](docs/phase-20/PHASE20_MASTER_AUDIT.md)
- **Data Provenance Architecture:** [docs/phase-20/DATA_PROVENANCE_ARCHITECTURE.md](docs/phase-20/DATA_PROVENANCE_ARCHITECTURE.md)
- **Evidence Taxonomy:** [docs/phase-20/EVIDENCE_TAXONOMY.md](docs/phase-20/EVIDENCE_TAXONOMY.md)
- **Cross-Platform Release Matrix:** [docs/phase-20/CROSS_PLATFORM_RELEASE_MATRIX.md](docs/phase-20/CROSS_PLATFORM_RELEASE_MATRIX.md)
- **Safety Invariant Audit:** [docs/phase-20/READ_ONLY_SAFETY_INVARIANT_AUDIT.md](docs/phase-20/READ_ONLY_SAFETY_INVARIANT_AUDIT.md)
- **Release Readiness Report:** [docs/phase-20/RELEASE_READINESS_REPORT.md](docs/phase-20/RELEASE_READINESS_REPORT.md)
- **Live Demonstration:** *[Configured for Vercel / Production Deployment]*
- **Demo Video:** *[Project Submission Video]*

---

### 9. Quick Start & Developer Guide

#### Prerequisites
- Node.js $\ge 20.0.0$ (Tested on Node.js 20.x, 22.x, and 24.x)
- npm $\ge 10.0.0$

#### Installation
```bash
# Clone the repository
git clone https://github.com/Mayyank04/Nexbus.git
cd Nexbus

# Deterministic dependency installation
npm ci
```

#### Running the Development Server
```bash
npm run dev
# Server listening on http://localhost:3000
```

#### Running the Automated Verification Suite
```bash
# Type check, unit tests, GTFS parsers, ML holdouts, and Phase 20 governance suite
npm test

# Phase 20 Governance & Provenance suite
node scripts/test-phase20-governance.mjs
```

#### Production Build
```bash
npm run build
```

---

### 10. Conclusion

NEXBUS brings urban mobility visualization, network analysis, journey exploration, and transparent data governance into one advisory platform.

Its central objective is to make complex mobility information more understandable and useful while preserving the distinction between verified information, estimates, predictions, and simulations.

$$\mathbf{READ\text{-}ONLY + PASSIVE + ADVISORY}$$

**NEXBUS — Understand the network. Explore mobility. Make better-informed decisions.**
