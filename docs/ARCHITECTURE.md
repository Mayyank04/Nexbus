# NEXBUS — Technical Architecture & System Topology

## 1. System Vision & Overview

NEXBUS is a competition-grade, human-art-directed urban mobility intelligence platform engineered for the National Capital Territory (NCT) of Delhi. The platform reconciles high-frequency telematics (GPS AVL pings), fare transaction streams (ETM tickets), and static GTFS schedules into an interactive 3D digital twin, a multi-criteria commuter journey planner, a spatio-temporal graph neural network (ST-GNN) surrogate, and an agent-based counterfactual simulation laboratory.

```
                      +---------------------------------------+
                      |       DTC / DIMTS Operational Telemetry |
                      |   4,280 GPS Beacons | 4.28M Daily ETMs |
                      +-------------------+-------------------+
                                          |
                                          v
                      +---------------------------------------+
                      |     Stage 01-02: Spatial Ingestion     |
                      |   Hidden Markov Model (HMM) Map Snapping
                      |   Delhi OSM Highway Graph & GTFS Stops|
                      +-------------------+-------------------+
                                          |
                                          v
                      +---------------------------------------+
                      |   Stage 03-05: Reconstruction Engine   |
                      |   Unsupervised Commuter Trip Chaining |
                      |   Segment Occupancy Factor Balance    |
                      +-------------------+-------------------+
                                          |
                                          v
                      +---------------------------------------+
                      |     Stage 06-07: Predictive Core      |
                      |   Spatio-Temporal Graph Neural Net    |
                      |   Bayesian Credible Intervals (80/95%)|
                      +-------------------+-------------------+
                                          |
            +-----------------------------+-----------------------------+
            |                                                           |
            v                                                           v
+-----------------------+                                   +-----------------------+
|  Passenger Experience  |                                   |  Authority Lab & Twin |
|  - Autocomplete Search |                                   |  - 3D Delhi Viewport  |
|  - 3-Tier Pareto Route |                                   |  - Counterfactual Sim |
|  - Crowd Indicators    |                                   |  - CSV/PDF Exports    |
+-----------------------+                                   +-----------------------+
```

---

## 2. Epistemological Classification Framework

To maintain scientific integrity and prevent deceptive sensor claims, all data within the NEXBUS architecture is strictly partitioned into four epistemological categories:

| Data Tier | Color / Symbol | Description & Methodology | Example Entity |
| :--- | :--- | :--- | :--- |
| **OBSERVED** | Green (`●`) | Direct physical telemetry recorded by onboard hardware. | GPS AVL pings, ETM ticket transactions, depot Wi-Fi dockings. |
| **ESTIMATED** | Amber (`▲`) | Statistically imputed metrics derived via mathematical balancing where sensors are absent. | Trip-chained alighting stops, inter-stop run times, segment occupancy factors. |
| **PREDICTED** | Blue (`◆`) | Forward-looking estimates computed by neural graph models with Bayesian uncertainty bounds. | 15/30/45-min corridor load forecasts, 95% Bayesian credible intervals. |
| **HYPOTHETICAL**| Purple (`★`) | Counterfactual scenario projections computed using Little's Law and elasticity operators. | Additional EV fleet injection, wait-time compression, tailpipe CO₂ offset. |

---

## 3. Technology Stack & Directory Structure

- **Framework:** Next.js 16 (App Router, Turbopack, React 19).
- **Styling & Tokens:** Tailwind CSS v4, Warm Ivory (`#F5F0E6`), Parchment (`#EBE4D8`), Surface White (`#FCFAF6`), Deep Ink (`#24211D`), Terracotta (`#B84C32`).
- **3D Visualization:** Three.js, `@react-three/fiber`, `@react-three/drei` (isometric 36° FoV architectural scale model of Connaught Place, Rajpath, and arterial corridors).
- **Motion Patterns:** `motion/react` (physics-spring `Magnetic`, `TextReveal`, `ScrollReveal`).
- **Testing & Verification:** Custom automated platform suite (`scripts/verify-platform.mjs`) with 29+ integration assertions.

### Core File Tree
```
src/
├── app/
│   ├── page.tsx                  # Public storytelling homepage & 3D hero
│   ├── twin/page.tsx             # Delhi 3D Digital Twin with layer toggles
│   ├── journey/page.tsx          # Passenger Journey Planner with stop autocomplete
│   ├── simulate/page.tsx         # Counterfactual simulation with sensitivity analysis
│   ├── control/page.tsx          # Authority Pilot Observatory & PDF/CSV reporting
│   ├── methodology/page.tsx      # 9-stage engineering architecture dossier
│   ├── about/page.tsx            # Studio manifesto and visual philosophy
│   └── api/
│       ├── gtfs/                 # Stops and routes API
│       ├── journey/plan/         # Multi-criteria routing engine
│       ├── prediction/crowding/  # ST-GNN crowding predictor
│       ├── simulation/evaluate/  # Little's Law counterfactual evaluator
│       ├── analytics/            # Executive summary and CSV exports
│       ├── network/provenance/   # Data provenance registry and validation
│       └── ml/evaluation/        # Model evaluation and benchmark metrics
├── components/
│   ├── 3d/DelhiCityCanvas.tsx    # 3D Delhi architectural scale model
│   ├── navigation/Navbar.tsx     # Global responsive navigation
│   └── ui/                       # Reusable UI primitives (Magnetic, Autocomplete, etc.)
├── data/
│   ├── delhiTransitData.ts       # Stops, routes, corridors, and flow profiles
│   └── provenanceRegistry.ts     # Centralized data provenance catalog
└── lib/
    ├── api.ts                    # Strongly typed client API client
    ├── geoValidation.ts          # WGS84 coordinates, bounding box & projection
    └── mlEvaluation.ts           # Train/Val/Test benchmark metrics
```
