# NEXBUS PHASE 18 — DIGITAL TWIN DUAL-MODE ARCHITECTURE & VERIFICATION

**System:** NEXBUS Delhi Metropolitan Digital Twin  
**Engine:** Three.js 0.187.0 + SVG 2D Precision Fallback  
**Modes:** Dual-Mode Architecture (Mode A: Explore Delhi vs Mode B: Advanced Analysis)  
**Safety Invariant:** `READ-ONLY + PASSIVE + ADVISORY` (No physical actuation)  

---

## 1. Dual-Mode Specification

NEXBUS addresses two distinct audiences with differing cognitive loads and domain experience:
1. **Citizens, Children, and Transit Newcomers:** Who need clear, intuitive spatial understanding of Delhi's arterial network without overwhelming mathematical jargon or cognitive overload.
2. **Transit Planners, Researchers, and Municipal Officials:** Who require rigorous GIS layers, ST-GNN crowding forecasts, 95% Bayesian credible intervals, OD gravity flows, and hardware telemetry.

| Architectural Dimension | Mode A: Explore Delhi (Newcomer / Child-Friendly) | Mode B: Advanced Analysis (GIS & Research Console) |
|---|---|---|
| **Audience** | 5-year-old child, student, tourist, transit newcomer | Urban transit researcher, DTC depot engineer, DMRC planner |
| **Visual Archetype** | Welcoming Swiss cartographic palette, cheerful friendly vehicle shapes, rounded roofs, bright distinct headlights and wheels | Architectural monograph, precision telephoto perspective (36° FoV), subtle wireframes, monochrome buildings |
| **Bus Geometries** | $1.35\times$ scale, cheerful bright red (`#D32F2F`) for DTC and vibrant emerald green (`#2E7D32`) for Electric, 4 rotating side wheel cylinders, curved roof cap, cheerful yellow beacon | $1.0\times$ precision scale, DTC terracotta (`#B84C32`) vs EV cyan (`#2A5C8A`), dual-tone headlights, hardware-observed vs calibrated beacon |
| **Bus Stops** | Large, easy-to-click totems with bright double rings, $3.2\times$ pick radius, accessible stop cards with plain-English names | Precision cylindrical totems, pulsing status halo, 400m/800m walking isochrones, Fruin Level-of-Service index |
| **Guided Tutorial** | Interactive 6-step guided walkthrough (`EasyExploreTutorial`) with smooth camera animations for each step | Layer selector supporting 11 independent GIS layers |
| **Crowding Metric** | 3-tier traffic light: Plenty of seats (Green), Getting busy (Yellow), Super crowded (Red) | ST-GNN crowding % load, 95% Bayesian Credible Interval, Poisson arrival parameters |
| **Motion Controls** | One-click Pause/Resume motion toggle; respects system `prefers-reduced-motion` | Playback scrubber (6:00 to 22:00 IST), speed factor toggle, shadow operations feed |

---

## 2. 6-Step Interactive Guided Tutorial ("Explore Delhi")

The `EasyExploreTutorial` component provides an educational, joyful walkthrough that orients newcomers to Delhi's transit geography:

1. **Step 1: "This is Delhi!"**
   - *Focal Camera:* Cinematic aerial perspective looking across the NCT region.
   - *Concept:* Introduces the National Capital Territory, home to over 30 million residents traveling across ancient and modern quarters.
2. **Step 2: "These are the Big Roads"**
   - *Focal Camera:* Nadir-tilted view highlighting the circular conduits.
   - *Concept:* Explains how the Ring Road (48 km) loops around the city to keep traffic moving between North, South, East, and West Delhi.
3. **Step 3: "These are Delhi Buses"**
   - *Focal Camera:* Close-up on an arterial corridor with moving vehicles.
   - *Concept:* Explains electric battery buses (red/blue) and clean CNG buses (green), each carrying up to 60 passengers.
4. **Step 4: "This is a Bus Stop"**
   - *Focal Camera:* Focused zoom on AIIMS Medical Hub and Connaught Place stops.
   - *Concept:* Shows where passengers wait under shelters, check timetables, and board safely.
5. **Step 5: "Metro & Bus Connect Together"**
   - *Focal Camera:* Multimodal interchange hub (Yellow & Blue lines crossing).
   - *Concept:* Shows how underground and elevated metro trains work as a team with surface buses for fast transfers.
6. **Step 6: "Busy Times & Quiet Times"**
   - *Focal Camera:* Overview with crowding color indicators.
   - *Concept:* Teaches how morning and evening rush hours create peak crowds, and how green/yellow/red indicators help commuters choose quiet journeys.

---

## 3. Resilience, Performance & Fallback Architecture

### 3.1 Device Pixel Ratio (DPR) Clamping
High-density displays (e.g., iPhone Super Retina at 3x DPR) can cause GPU thermal throttling when running full-screen WebGL. NEXBUS strictly clamps the pixel ratio:
$$\text{Effective DPR} = \min(\text{window.devicePixelRatio}, 2.0)$$
This guarantees consistent 60 FPS performance without draining mobile batteries.

### 3.2 WebGL Context Loss & Recovery
NEXBUS listens to browser context lifecycle events:
```typescript
canvas.addEventListener('webglcontextlost', (e) => {
  e.preventDefault();
  setIsContextLost(true);
});
canvas.addEventListener('webglcontextrestored', () => {
  setIsContextLost(false);
});
```
When context is lost, the application seamlessly transitions to the 2D precision vector schematic without crashing the page or losing user selection state.

### 3.3 Interactive 2D Vector Schematic Fallback
When 3D WebGL is unavailable or when the user toggles to 2D mode, NEXBUS renders a responsive SVG map featuring:
- Accurate geometry of Delhi's arterial ring roads and axial corridors.
- Yamuna River orientation ribbon.
- Clickable bus stop markers (Connaught Place, AIIMS, Kashmiri Gate, Dhaula Kuan, Lajpat Nagar).
- Direct callbacks to `onSelectStop` and `onSelectCorridor`.
- In-place "Retry 3D Acceleration" button.

### 3.4 Reduced-Motion Accessibility (WCAG 2.1 AA)
NEXBUS detects `(prefers-reduced-motion: reduce)` via media query listeners. In addition, users can manually toggle the Pause button (`[⏸️ PAUSE]`). When paused:
- Bus progress updates are frozen.
- Pulse particle animations are halted.
- Damped camera interpolation remains functional so users can still rotate and zoom smoothly without experiencing motion sickness.
