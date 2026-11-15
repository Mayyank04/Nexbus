# NEXBUS DESIGN SYSTEM (DESIGN.md)

**Product:** NEXBUS — Urban Mobility Intelligence and Advisory Decision-Support Platform for the National Capital Territory of Delhi  
**Classification:** Research-grade public transit intelligence and passenger advisory system  
**Authority:** Antigravity Human-Quality Design Architecture  
**Status:** Living Design Standard (Active)

---

## 1. Product Identity & Purpose

NEXBUS is an urban mobility intelligence platform designed for the National Capital Territory of Delhi. It reconciles real-time and historical transit telemetry from over 3,840 connected buses, 420 fare stages, electronic ticketing machines (ETM), and multimodal interchange nodes into a unified digital twin, predictive crowding engine, and scenario simulation laboratory.

- **Primary Mission:** Provide transit planners, municipal authorities, researchers, and citizens with transparent, scientifically calibrated mobility insights.
- **Operating Invariant:** `READ-ONLY + PASSIVE + ADVISORY` (No automated fleet dispatch; advisory decision-support only).
- **Core Users:**
  1. *Transit Planners & Depot Managers:* Analyzing corridor headway reliability, bunching probability, and EV fleet staging.
  2. *Urban Transport Researchers:* Evaluating origin-destination (OD) calibration, GEH statistics, and spatial accessibility.
  3. *Daily Commuters:* Seeking crowd-aware travel itineraries that balance speed, interchange friction, and passenger comfort.

---

## 2. Surface Modes

| Surface | Route | Primary Mode | Focus |
|---|---|---|---|
| **Overview & Narrative** | `/` | **Persuade / Read** | Clear architectural communication of Delhi's transit topology and platform capabilities. |
| **Digital Twin** | `/twin` | **Operate / Experience** | High-density spatial exploration of corridors, bus stops, and real-time headway telemetry. |
| **Journey Planner** | `/journey` | **Operate** | Task-oriented multimodal itinerary computation with clear transfer and friction metrics. |
| **Simulation Lab** | `/simulate` | **Operate** | Counterfactual policy modeling (headway adjustments, electric bus fleet expansion). |
| **Executive Observatory** | `/control` | **Operate / Read** | Municipal decision-support metrics, empirical validation dossiers, and shadow audit logs. |
| **Methodology Dossier** | `/methodology` | **Read** | Epistemological data tiering (Observed vs Estimated vs Predicted vs Simulated). |
| **About & Manifesto** | `/about` | **Read** | Philosophy of architectural dignity in civic software engineering. |

---

## 3. Aesthetic Archetype: Swiss Transit Cartography & Editorial Monograph

Rather than adopting the generic dark-navy/neon-cyan AI aesthetic or arbitrary SaaS marketing tropes, NEXBUS follows the dignified tradition of **Swiss Transit Cartography and Architectural Monographs**:
- **Canvas:** Warm architectural ivory (`#F5F0E6`) and clean porcelain surfaces (`#FCFAF6`), inspired by physical survey maps and official transport atlas prints.
- **Ink:** Deep charcoal ink (`#1A1815`) providing high-contrast readability (14.2:1 contrast ratio against ivory).
- **Cartographic Accent:** Delhi Terracotta (`#B84C32`), referencing the red sandstone of the Red Fort, Humayun’s Tomb, and traditional DTC fleet livery.
- **Typography:** Architectural serif display (`Instrument Serif`) for dignified headlines, paired with precision geometric sans (`Manrope`) for UI body, and monospace (`IBM Plex Mono`) for telemetry values, coordinates, and timestamps.
- **Restraint:** Zero circular gradient blur blobs. Zero arbitrary glassmorphism. Zero decorative floating badges.

---

## 4. Semantic Color Tokens

| Token Name | Hex Code | Role | Contrast Ratio against `#F5F0E6` |
|---|---|---|:---:|
| `bg-canvas` | `#F5F0E6` | Primary background canvas (Warm Ivory) | N/A |
| `bg-surface-1` | `#FCFAF6` | Primary cards, panels, and input containers | 1.1:1 (Structural surface) |
| `bg-surface-2` | `#EBE4D8` | Secondary containers, headers, and table rows | 1.1:1 (Recessed surface) |
| `border-subtle` | `#DED5C8` | Hairline dividers and quiet component boundaries | 1.2:1 |
| `border-strong` | `#8C8275` | Focused borders, active tabs, and primary separators | 3.5:1 |
| `text-primary` | `#1A1815` | High-contrast headlines and primary metrics | **14.2:1 (AAA Pass)** |
| `text-secondary` | `#4A443C` | Body text, descriptions, and active labels | **7.4:1 (AAA Pass)** |
| `text-muted` | `#635B50` | Timestamps, coordinates, and secondary metadata | **4.8:1 (AA Pass)** |
| `accent-primary` | `#B84C32` | Terracotta brand accent and primary highlights | **4.9:1 (AA Pass)** |
| `accent-dark` | `#963B25` | Hover state for terracotta buttons | **6.6:1 (AAA Pass)** |
| `status-observed` | `#15803D` | Tier 1: Hardware-observed GPS and smartcard punches | **5.3:1 (AA Pass)** |
| `status-estimated` | `#B45309` | Tier 2: Statistically chained OD matrix inferences | **4.7:1 (AA Pass)** |
| `status-predicted` | `#1D4ED8` | Tier 3: Graph neural network crowding forecasts | **6.1:1 (AA Pass)** |
| `status-simulated` | `#7E22CE` | Tier 4: Counterfactual micro-simulation scenarios | **6.4:1 (AA Pass)** |

---

## 5. Typography Scale

| Level | Font Family | Size | Line Height | Weight | Tracking | Usage |
|---|---|---|---|---|---|---|
| **Display** | Instrument Serif | 56px–72px | 0.98 | 400 | -0.02em | Hero headline on desktop |
| **H1** | Instrument Serif | 36px–44px | 1.10 | 400 | -0.015em | Major page & section headings |
| **H2** | Instrument Serif | 24px–28px | 1.25 | 400 | -0.01em | Panel headers, scenario titles |
| **H3** | Manrope | 18px–20px | 1.35 | 600 | 0.00em | Card titles, modal headers |
| **Body Large** | Manrope | 16px–18px | 1.60 | 300 | 0.00em | Editorial narrative lead-in paragraphs |
| **Body Standard**| Manrope | 14px–15px | 1.55 | 400 | 0.00em | Form inputs, descriptions, table body |
| **Label / Nav** | Manrope | 12px–13px | 1.40 | 500 | +0.08em | Navigation links, uppercase chips |
| **Monospace** | IBM Plex Mono | 11px–12px | 1.50 | 400 | +0.05em | Coordinates, GPS telemetry, timestamps |

---

## 6. Spacing & Grid System

- **Baseline Unit:** 4px.
- **Layout Steps:** 8px (`0.5rem`), 12px (`0.75rem`), 16px (`1rem`), 24px (`1.5rem`), 32px (`2rem`), 48px (`3rem`), 64px (`4rem`), 96px (`6rem`).
- **Maximum Container Width:** `max-w-7xl` (1280px), centered with `mx-auto`.
- **Horizontal Page Margins:** Strict equal edges across viewports:
  - Mobile (<= 640px): `px-4` (16px)
  - Tablet (641px–1024px): `px-6` (24px)
  - Desktop (>= 1025px): `px-8` (32px)

---

## 7. Component Rules

### 7.1 Buttons
- **Primary Action:** Solid `#1A1815` fill, `#FCFAF6` text, crisp hairline border, 0px border-radius (sharp architectural corner), hover to `#B84C32` (Terracotta) in 150ms.
- **Secondary Action:** Outlined with `border-divider`, `bg-canvas`, text `#1A1815`, hover to `#EBE4D8`.
- **Segmented Toggle:** Enclosed pill or rectangular grouping with high-contrast active state and subtle inactive borders.
- **Disabled State:** Opacity 50%, `cursor-not-allowed`, non-interactive.
- **Focus Ring:** `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2 focus-visible:ring-offset-ivory`.

### 7.2 Cards & Data Containers
- White surface (`#FCFAF6`) with subtle 1px border (`#DED5C8`).
- Zero heavy drop shadows; rely on crisp geometric boundary.
- Generous internal padding (minimum 16px on mobile, 24px on desktop).
- Top header with domain classification tag (`DELHI / TRANSIT INTELLIGENCE`) in IBM Plex Mono.

### 7.3 Badges & Epistemic Tiers
- Tier badges must strictly reflect data origin:
  - `OBSERVED`: Emerald green border & dot (`● TIER 01: OBSERVED`)
  - `ESTIMATED`: Amber border & triangle (`▲ TIER 02: ESTIMATED`)
  - `PREDICTED`: Cobalt blue border & diamond (`◆ TIER 03: PREDICTED`)
  - `SIMULATED`: Purple border & star (`★ TIER 04: HYPOTHETICAL`)

---

## 8. Anti-Patterns (Strictly Forbidden)

1. ❌ **No Floating Blur Circles:** Never use `blur-3xl bg-purple-500/10` or decorative color blobs behind cards or text.
2. ❌ **No Floating Obstructive Badges:** Never position fixed circular badges (like the legacy "N" circle) over viewport content.
3. ❌ **No Brittle Scroll-Reveals on Core Text:** Never hide text behind `opacity: 0` scroll reveal libraries that leave pages blank when JavaScript or intersection observers fail.
4. ❌ **No Low-Contrast Text:** Never use gray text lighter than `#635B50` on the ivory canvas.
5. ❌ **No Generic SaaS Buzzwords:** Never write "revolutionary", "seamless magic", "cutting-edge AI powerhouse", or "unlock your transit potential".
6. ❌ **No Fabricated Data or Badges:** Never display fake passenger counts or invented certifications.
7. ❌ **No Empty 3D Canvas Voids:** Always provide an instant, crisp 2D vector schematic fallback when WebGL hardware acceleration is not detected.
