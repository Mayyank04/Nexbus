# NEXBUS Phase 24 — Multi-Viewport Responsive Validation & Screenshot Evidence Index

**Audit Date:** November 21, 2026  
**Target Viewports:** 7 Distinct Form Factors (Desktop, Laptop, Tablet, Phablet, Standard Phone, Compact Phone)  
**Evidence Directory:** `docs/phase-24/evidence/screenshots/`  
**Manifest:** `docs/phase-24/evidence/screenshots/SCREENSHOT_MANIFEST.json`  
**Status:** 18/18 Viewport Scenarios Captured & Verified

---

## 1. Multi-Viewport Testing Matrix

| Device Profile | Viewport Resolution | Aspect Ratio | Evaluated Routes | Screenshot Artifacts |
| :--- | :--- | :--- | :--- | :--- |
| **Large Desktop / Monitor** | $1920 \times 1080$ | 16:9 | `/` | [home-desktop-1920.png](file:///Users/mayankgautam/Desktop/nexbus/docs/phase-24/evidence/screenshots/home-desktop-1920.png) (279.0 KB) |
| **Standard Desktop** | $1440 \times 900$ | 16:10 | `/`, `/twin`, `/journey`, `/simulate`, `/control`, `/about`, `/methodology` | [home-desktop-1440.png](file:///Users/mayankgautam/Desktop/nexbus/docs/phase-24/evidence/screenshots/home-desktop-1440.png) (259.2 KB)<br>[twin-desktop-1440.png](file:///Users/mayankgautam/Desktop/nexbus/docs/phase-24/evidence/screenshots/twin-desktop-1440.png) (325.2 KB)<br>[journey-desktop-1440.png](file:///Users/mayankgautam/Desktop/nexbus/docs/phase-24/evidence/screenshots/journey-desktop-1440.png) (209.7 KB)<br>[simulate-desktop-1440.png](file:///Users/mayankgautam/Desktop/nexbus/docs/phase-24/evidence/screenshots/simulate-desktop-1440.png) (146.9 KB)<br>[control-desktop-1440.png](file:///Users/mayankgautam/Desktop/nexbus/docs/phase-24/evidence/screenshots/control-desktop-1440.png) (148.2 KB)<br>[about-desktop-1440.png](file:///Users/mayankgautam/Desktop/nexbus/docs/phase-24/evidence/screenshots/about-desktop-1440.png) (141.9 KB)<br>[methodology-desktop-1440.png](file:///Users/mayankgautam/Desktop/nexbus/docs/phase-24/evidence/screenshots/methodology-desktop-1440.png) (162.8 KB) |
| **Compact Laptop** | $1280 \times 800$ | 16:10 | `/` | [home-desktop-1280.png](file:///Users/mayankgautam/Desktop/nexbus/docs/phase-24/evidence/screenshots/home-desktop-1280.png) (246.5 KB) |
| **Tablet Portrait** | $768 \times 1024$ | 3:4 | `/`, `/twin` | [home-tablet-768.png](file:///Users/mayankgautam/Desktop/nexbus/docs/phase-24/evidence/screenshots/home-tablet-768.png) (199.0 KB)<br>[twin-tablet-768.png](file:///Users/mayankgautam/Desktop/nexbus/docs/phase-24/evidence/screenshots/twin-tablet-768.png) (126.5 KB) |
| **Large Smartphone (Max)** | $430 \times 932$ | ~19.5:9 | `/` | [home-mobile-430.png](file:///Users/mayankgautam/Desktop/nexbus/docs/phase-24/evidence/screenshots/home-mobile-430.png) (106.4 KB) |
| **Standard Smartphone** | $390 \times 844$ | ~19.5:9 | `/`, `/twin`, `/journey`, `/simulate`, `/control` | [home-mobile-390.png](file:///Users/mayankgautam/Desktop/nexbus/docs/phase-24/evidence/screenshots/home-mobile-390.png) (82.1 KB)<br>[twin-mobile-390.png](file:///Users/mayankgautam/Desktop/nexbus/docs/phase-24/evidence/screenshots/twin-mobile-390.png) (80.9 KB)<br>[journey-mobile-390.png](file:///Users/mayankgautam/Desktop/nexbus/docs/phase-24/evidence/screenshots/journey-mobile-390.png) (59.8 KB)<br>[simulate-mobile-390.png](file:///Users/mayankgautam/Desktop/nexbus/docs/phase-24/evidence/screenshots/simulate-mobile-390.png) (70.8 KB)<br>[control-mobile-390.png](file:///Users/mayankgautam/Desktop/nexbus/docs/phase-24/evidence/screenshots/control-mobile-390.png) (68.8 KB) |
| **Budget Smartphone** | $360 \times 800$ | 20:9 | `/` | [home-mobile-360.png](file:///Users/mayankgautam/Desktop/nexbus/docs/phase-24/evidence/screenshots/home-mobile-360.png) (70.4 KB) |

---

## 2. Visual Layout & Responsiveness Findings

1. **Fluid Grid Wrapping:** On desktop viewports ($1920\text{px}$ and $1440\text{px}$), the 5 primary entry cards wrap cleanly in a 3-over-2 grid; on tablet ($768\text{px}$) they adapt to a 2-column layout; on mobile ($430\text{px}$, $390\text{px}$, $360\text{px}$) they stack into full-width vertical cards with $16\text{px}$ touch paddings.
2. **Zero Horizontal Overflow:** Audited on $360\text{px}$ width (common on budget Android devices across India). The document width matches viewport exactly (`body { overflow-x: hidden }`), preventing accidental horizontal panning.
3. **Touch Targets:** Metric buttons, navigation pills, and two-level disclosure triggers maintain $\ge 44\text{px}$ vertical height across all mobile viewports.
4. **Legibility & Text Density:** Monospace numerals in tables retain clear tabular spacing without overlapping on narrow screens.
