# NEXBUS: DEMONSTRATION VIDEO SCRIPT & RECORDING SPECIFICATION
## 3-to-4 Minute Walkthrough of the Working Live Platform

**Document Identifier:** `NEXBUS-DEMO-SCRIPT-PHASE21`  
**Target Duration:** 3 minutes 45 seconds (225 seconds)  
**Target URL:** `https://nexbus.vercel.app` (or local fallback `http://localhost:3000`)  
**Resolution:** 1080p (1920x1080) at 60 fps, 16:9 aspect ratio  
**Audio:** Clear, professional spoken narration (English)  
**Safety Invariant:** `READ-ONLY + PASSIVE + ADVISORY` (Prominently displayed)  
**Current Recording Status:** **`SCRIPT_PREPARED_NOT_YET_RECORDED`** (Awaiting presenter audio recording & screen capture)

---

## RECORDING RULES & INTEGRITY MANDATES

1. **No Slides or Mockups:** The video must record the actual running web application in Google Chrome. No static PowerPoint slides, no Figma prototype screens, and no CGI animations pretending to be UI.
2. **Real Interactions:** Every button click, route computation, and slider adjustment must execute live in the browser session.
3. **Transparent Latency:** Do not edit out normal computation intervals or accelerate video speed to falsely inflate performance.
4. **Honest Boundary Statements:** Clearly state that the model covers 4 priority corridors (67 nodes, 226 edges, 15 hubs) rather than claiming citywide coverage.

---

## TIMESTAMPTED DEMONSTRATION SCRIPT

```
+-------------------------------------------------------------------------------------------------------------+
| TIME        | SECTION                         | SCREEN VISUAL / ACTION              | SPOKEN NARRATION      |
+-------------------------------------------------------------------------------------------------------------+
| 0:00 - 0:20 | Introduction & Problem Context  | Chrome opens to landing page        | "Delhi sustains over  |
|             |                                 | (https://nexbus.vercel.app).        | 7,000 buses and a     |
|             |                                 | Cursor hovers on title & badges.    | massive metro grid,   |
|             |                                 |                                     | yet planners and      |
|             |                                 |                                     | commuters struggle    |
|             |                                 |                                     | with fragmented data, |
|             |                                 |                                     | bunching headways,    |
|             |                                 |                                     | and opaque crowding.  |
|             |                                 |                                     | NEXBUS is an open-    |
|             |                                 |                                     | source urban mobility |
|             |                                 |                                     | intelligence platform |
|             |                                 |                                     | built to bridge this  |
|             |                                 |                                     | gap."                 |
+-------------+---------------------------------+-------------------------------------+-----------------------+
| 0:20 - 0:50 | Interface Overview & Navigation | Scroll down landing page showing     | "The platform is built|
|             |                                 | architecture pillars, then click    | on Next.js, React,    |
|             |                                 | 'Explore Digital Twin' in navbar.   | and Three.js. It runs |
|             |                                 | Fullscreen 3D scene renders.        | entirely in standard  |
|             |                                 |                                     | browsers with zero    |
|             |                                 |                                     | plugins. Notice the   |
|             |                                 |                                     | persistent header     |
|             |                                 |                                     | affirming our safety  |
|             |                                 |                                     | invariant: READ-ONLY, |
|             |                                 |                                     | PASSIVE, ADVISORY."   |
+-------------+---------------------------------+-------------------------------------+-----------------------+
| 0:50 - 1:30 | Digital Twin: Mode A            | Mode toggle set to 'Explore Delhi'. | "Here is the 3D       |
|             | (Explore Delhi)                 | Click 'Start Guided Tour'. Click    | Digital Twin. In      |
|             |                                 | through Steps 1 to 3: AIIMS hub,    | Explore mode, users   |
|             |                                 | Ring Road, Kashmere Gate. Camera    | can follow a guided   |
|             |                                 | smoothly orbits each landmark.      | walkthrough of Delhi's|
|             |                                 |                                     | major transit hubs.   |
|             |                                 |                                     | Notice the particle   |
|             |                                 |                                     | streams visualizing   |
|             |                                 |                                     | bus movements along   |
|             |                                 |                                     | Aurobindo Marg and    |
|             |                                 |                                     | the Ring Road belt."  |
+-------------+---------------------------------+-------------------------------------+-----------------------+
| 1:30 - 2:00 | Digital Twin: Mode B            | Click mode toggle to 'Advanced      | "Switching to Advanced|
|             | (GIS Analysis & 2D Fallback)    | Analysis'. Toggle layers on/off:    | Analysis reveals 11   |
|             |                                 | Corridor Volumes, Crowding Heatmap, | GIS analytical layers.|
|             |                                 | Accessibility Barriers. Then click  | Planners can inspect  |
|             |                                 | '2D Vector View' to show fallback.  | catchment buffers and |
|             |                                 |                                     | bottleneck points.    |
|             |                                 |                                     | For lower-end devices,|
|             |                                 |                                     | our 2D vector fallback|
|             |                                 |                                     | ensures 100% feature  |
|             |                                 |                                     | accessibility."       |
+-------------+---------------------------------+-------------------------------------+-----------------------+
| 2:00 - 2:35 | Multi-Criteria Journey Planning | Navigate to /journey. Select Origin | "In the Journey       |
|             |                                 | 'AIIMS Bus Stop' and Destination   | Planner, we don't just|
|             |                                 | 'Kashmere Gate Metro'. Click        | optimize for time.    |
|             |                                 | 'Compute Routes'. Inspect 3 options.| NEXBUS computes three |
|             |                                 | Toggle between Fastest, Balanced,   | distinct alternatives:|
|             |                                 | and Comfort First.                  | Fastest minimizes     |
|             |                                 |                                     | minutes; Balanced     |
|             |                                 |                                     | limits transfers; and |
|             |                                 |                                     | Comfort First limits  |
|             |                                 |                                     | crowding and stair    |
|             |                                 |                                     | climbing for elderly  |
|             |                                 |                                     | and disabled riders." |
+-------------+---------------------------------+-------------------------------------+-----------------------+
| 2:35 - 3:05 | Parametric Simulation Lab       | Navigate to /simulate. Move fleet   | "Our Simulation Lab   |
|             |                                 | frequency slider to +20%. Move fare | lets analysts evaluate|
|             |                                 | discount slider to -15%. Move       | policy counterfactuals|
|             |                                 | electrification slider to 50%. Click| risk-free. Using      |
|             |                                 | 'Evaluate Scenario'. Results appear.| Little's Law, price   |
|             |                                 |                                     | elasticity, and CEA   |
|             |                                 |                                     | grid emission factors,|
|             |                                 |                                     | the engine calculates |
|             |                                 |                                     | waiting-time drops and|
|             |                                 |                                     | net carbon abatement  |
|             |                                 |                                     | in metric tons."      |
+-------------+---------------------------------+-------------------------------------+-----------------------+
| 3:05 - 3:30 | Data Provenance & Methodology   | Navigate to /methodology. Scroll to | "Every single metric  |
|             |                                 | Evidence Classification table. Open | is backed by our      |
|             |                                 | /control to show dataset health and | 9-tier evidence       |
|             |                                 | SHA-256 cryptographic digests.      | taxonomy. We explicitly|
|             |                                 |                                     | distinguish observed  |
|             |                                 |                                     | data from simulated   |
|             |                                 |                                     | scenarios. Zero data  |
|             |                                 |                                     | masquerade."          |
+-------------+---------------------------------+-------------------------------------+-----------------------+
| 3:30 - 3:45 | Limitations & Safety Mandate    | Navigate to /terms. Show footer     | "NEXBUS currently     |
|             |                                 | with open-source MIT license and    | covers four arterial  |
|             |                                 | GitHub link. Fade to close.         | corridors. It is      |
|             |                                 |                                     | strictly READ-ONLY and|
|             |                                 |                                     | PASSIVE. It provides  |
|             |                                 |                                     | transparent advisory  |
|             |                                 |                                     | support for humans.   |
|             |                                 |                                     | Explore it live today |
|             |                                 |                                     | at nexbus.vercel.app."|
+-------------------------------------------------------------------------------------------------------------+
```

---

## PRODUCTION RECORDING INSTRUCTIONS FOR PRESENTER

1. **Browser Preparation:**
   - Use Google Chrome in an Incognito window at $1920 \times 1080$ resolution.
   - Disable browser extensions and notification popups.
   - Set zoom level to exactly $100\%$.
2. **Display Settings:**
   - Display scaling set to standard 100% (or Retina 200% downsampled to 1080p).
   - Audio input: Clean USB microphone with pop-filter; no background music to ensure crisp voice clarity.
3. **Screen Recorder:**
   - Recommended tool: OBS Studio or QuickTime Player.
   - Capture at 60 fps, Constant Bitrate (CBR) $12\text{ Mbps}$, AAC Audio $320\text{ kbps}$.
4. **Post-Recording Verification:**
   - Verify video file format: `.mp4` (H.264 video codec, AAC audio codec).
   - Ensure audio-video sync is exact.
   - Upload finished video to YouTube (Unlisted or Public) or host in `public/demo/` or GitHub Releases.
