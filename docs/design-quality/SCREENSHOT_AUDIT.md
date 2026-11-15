# MULTI-VIEWPORT SCREENSHOT AUDIT

**Audit Date:** 2026-11-16  
**Capture Engine:** Headless Google Chrome v144 (`/Applications/Google Chrome.app/Contents/MacOS/Google Chrome`)  
**Base URL:** `http://localhost:3000`  
**Storage Path:** `docs/design-quality/screenshots/initial/`  
**Total Screenshots Captured:** 35 (7 Routes × 5 Viewports)

---

## 1. Viewport Testing Matrix

| ID | Name | Dimensions | Ratio | Device Representation |
|---|---|:---:|:---:|---|
| **V1** | Desktop Large | 1440 × 900 | 16:10 | External Monitor / Studio Display |
| **V2** | Desktop Laptop | 1280 × 800 | 16:10 | MacBook Pro 13" / Thin-and-light laptop |
| **V3** | Tablet Portrait | 768 × 1024 | 3:4 | iPad / Android Tablet in portrait mode |
| **V4** | Mobile Standard | 390 × 844 | 9:19.5 | iPhone 14/15/16 Pro |
| **V5** | Mobile Compact | 360 × 800 | 9:20 | Standard Android device |

---

## 2. Route Inspection Log & Screenshot Manifest

### 2.1 Route `/` (Homepage)
- `home_desktop-1440.png` (132,229 bytes):
  - *Observation:* Left column takes 40% width; right 60% contains 3D canvas which renders as empty parchment when WebGL hardware acceleration is omitted.
  - *Defect:* Large vertical void in left column between CTAs and camera preset buttons. Floating circular "N" badge overlaps bottom masthead.
- `home_desktop-1280.png` (122,861 bytes):
  - *Observation:* Layout scales proportionally; bottom masthead text remains legible.
- `home_tablet-768.png` (101,346 bytes):
  - *Observation:* Grid collapses to single column. 3D canvas moves below text narrative.
- `home_mobile-390.png` (68,896 bytes):
  - *Defect 1:* Hero narrative paragraph truncated on right edge: `"Explore how Delhi moves. Find better journeys, und..."`.
  - *Defect 2:* Camera viewport preset buttons clip off-screen (`"03 Radia..."`).
  - *Defect 3:* Floating "N" badge collides with vector fallback box.
- `home_mobile-360.png` (60,197 bytes):
  - *Defect:* Severe horizontal overflow. Horizontal scrollbar appears.

### 2.2 Route `/twin` (Digital Twin)
- `twin_desktop-1440.png` (196,076 bytes)
- `twin_desktop-1280.png` (173,187 bytes)
- `twin_tablet-768.png` (86,440 bytes)
- `twin_mobile-390.png` (53,209 bytes)
- `twin_mobile-360.png` (48,921 bytes)
  - *Observation:* Left corridor selection list and telemetry sidebar. On mobile, sidebar collapses awkwardly into a tall vertical stack with high interaction friction.

### 2.3 Route `/journey` (Multimodal Journey Planner)
- `journey_desktop-1440.png` (90,885 bytes):
  - *Defect 1:* Left side shows `"IDENTIFIED ITINERARIES (0)"` with a massive empty void below before itineraries finish loading.
  - *Defect 2:* Right side shows `"3D MULTIMODAL SPATIAL TWIN"` container with an empty light-gray box when WebGL is offline.
- `journey_desktop-1280.png` (124,215 bytes)
- `journey_tablet-768.png` (110,566 bytes)
- `journey_mobile-390.png` (56,627 bytes):
  - *Observation:* Origin and Destination inputs stack vertically. Search icon alignment shifts.
- `journey_mobile-360.png` (54,544 bytes)

### 2.4 Route `/simulate` (Scenario Simulation Lab)
- `simulate_desktop-1440.png` (121,793 bytes):
  - *Observation:* Scenario sliders (Additional Buses, Headway, Signal Priority) on left; simulation impact cards on right.
  - *Defect:* Slider inputs lack visible numerical tick labels and accessible focus rings.
- `simulate_desktop-1280.png` (127,089 bytes)
- `simulate_tablet-768.png` (112,943 bytes)
- `simulate_mobile-390.png` (57,352 bytes)
- `simulate_mobile-360.png` (53,947 bytes)

### 2.5 Route `/control` (Operational Control & Depot Telemetry)
- `control_desktop-1440.png` (149,850 bytes):
  - *Defect 1:* Executive action toolbar on top right has mismatched buttons (segmented pill vs shadow card vs dark block).
  - *Defect 2:* 4-card metric strip (`4.28M PAX`, `81.4%`, `94.8%`, `1,640`) suffers from generic layout monotony.
  - *Defect 3:* Floating "N" logo covers lower section text.
- `control_desktop-1280.png` (129,970 bytes)
- `control_tablet-768.png` (132,087 bytes)
- `control_mobile-390.png` (66,801 bytes)
- `control_mobile-360.png` (62,579 bytes)

### 2.6 Route `/about` (About & Architectural Manifesto)
- `about_desktop-1440.png` (42,563 bytes)
- `about_desktop-1280.png` (42,041 bytes)
- `about_tablet-768.png` (45,190 bytes)
- `about_mobile-390.png` (24,156 bytes):
  - *CRITICAL DEFECT:* Main headline `"Designing for a city that never stops moving."` is completely invisible! Framer Motion `<TextReveal>` failed to trigger on mobile load.
- `about_mobile-360.png` (7,297 bytes):
  - *CRITICAL DEFECT:* Entire content below header has 0 opacity; file size only 7 KB.

### 2.7 Route `/methodology` (Scientific Validation Dossier)
- `methodology_desktop-1440.png` (85,962 bytes)
- `methodology_desktop-1280.png` (78,317 bytes)
- `methodology_tablet-768.png` (20,295 bytes)
- `methodology_mobile-390.png` (7,657 bytes):
  - *CRITICAL DEFECT:* Same scroll-reveal failure as `/about`. Headline invisible on mobile screenshot.
- `methodology_mobile-360.png` (39,367 bytes)

---

## 3. High-Priority Remediation Priorities

1. **Fix Brittle Scroll/Text Reveals:** Replace opacity-0 `<TextReveal>` and `<ScrollReveal>` wrappers with robust CSS entrance animations that are always visible if JavaScript or scroll intersection events fail.
2. **Eliminate Floating "N" Circle Badge:** Remove the fixed bottom-left badge that obscures content and creates visual clutter.
3. **Remediate Mobile Horizontal Overflow:** Add proper `min-w-0`, `w-full`, and flexible layouts on all text, badges, and button groups.
4. **Unify Button & Navigation Styles:** Redesign header into a crisp, unified transit masthead with proper responsive mobile menu.
5. **Provide High-Craft 2D Vector Transit Topology:** When WebGL acceleration is unavailable, render an informative high-resolution 2D schematic transit topology map with route corridors rather than an empty box.
