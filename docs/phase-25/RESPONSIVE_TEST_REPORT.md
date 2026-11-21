# NEXBUS Phase 25: Multi-Viewport Responsive Design Report

**Status:** Certified & Verified  
**Tested Viewports:** 5 Target Resolutions (360x800 to 1440x900)  
**Screenshots Captured:** 25 Authentic Headless Chrome Screenshots (`docs/phase-25/evidence/screenshots/`)  
**Design Standard:** `taste-skill` Equal Edges + One-Section-Per-Screen Disciplines

---

## 1. Viewport Matrix

| Viewport Name | Resolution | Category | Target Device Class | Visual Verification Result |
| :--- | :--- | :--- | :--- | :--- |
| **`desktop-1440`** | $1440 \times 900$ | Large Desktop | MacBook Pro 15", Modern Monitors | Balanced 12-column grid, dual split viewports on Digital Twin, zero text wrap clipping. |
| **`desktop-1280`** | $1280 \times 800$ | Standard Desktop | MacBook Air 13", Standard Laptops | Clean navigation bar, intact corridor comparison table, full legibility. |
| **`tablet-768`** | $768 \times 1024$ | Portrait Tablet | iPad 10th Gen, Galaxy Tab | Adaptive stacked layout: Digital Twin left inspector collapses into top drawer, full-width canvas. |
| **`mobile-390`** | $390 \times 844$ | Modern Smartphone | iPhone 14/15, Pixel 7 | Single-column cards, hamburger mobile menu, touch targets $\ge 44\text{px}$, sticky advisory status bar. |
| **`mobile-360`** | $360 \times 800$ | Compact Smartphone | Budget Android (Samsung Galaxy A-series) | Zero horizontal scrolling ($X$-overflow = 0), compact badges, readable 11px mono labels. |

---

## 2. Page-by-Page Responsive Verification

### A. Homepage (`/`)
- **Desktop (1440 & 1280):** Hero with 3D transit canvas on the right, primary action buttons, 5-card horizontal exploratory grid.
- **Tablet (768):** 5 exploration cards wrap smoothly into a 2-column + 1-column layout.
- **Mobile (390 & 360):** 5 exploration cards stack vertically; each card features $\ge 44\text{px}$ touch target with prominent Lucide icons.

### B. Digital Twin (`/twin`)
- **Desktop (1440 & 1280):** 3-column layout: left drawer (mode guides), center Three.js interactive canvas, right telemetry inspector.
- **Tablet (768):** Inspector tabs switch between Map and Telemetry with sticky top control bar.
- **Mobile (390 & 360):** Fullscreen canvas with floating collapsible drawers ("What am I looking at?" and "Guided Tour"). 2D flat vector fallback toggle remains readily accessible for low-power mobile GPUs.

### C. Multimodal Journey Planner (`/journey`)
- **Desktop (1440 & 1280):** Side-by-side origin/destination selectors with interactive swap button, followed by 3-tier card comparison.
- **Mobile (390 & 360):** Stacked form inputs, full-width "Swap" button, vertically scrollable route legs with step-by-step transfer indicators.

### D. Simulation Laboratory (`/simulate`)
- **Desktop (1440 & 1280):** 3 Curiosity Sandbox question cards side-by-side; 4-column parameter sliders (Buses, Headway, Priority, Peak).
- **Mobile (390 & 360):** Sliders adapt to single-column blocks with clear numeric value badges and tap-friendly increment controls.

---

## 3. Responsive Defect Elimination

1. **Eliminated Horizontal Scrollbars:** Replaced hardcoded min-widths with responsive Tailwind clamps (`max-w-7xl`, `w-full`, `overflow-x-auto` on benchmark tables).
2. **Fixed Card Truncation:** Handled long stop names (e.g. "Maharana Pratap Inter State Bus Terminus") with CSS `truncate` and full hover titles.
3. **Optimized Mobile Drawers:** Eliminated heavy backdrop filters (`backdrop-blur-md`) that caused frame drops on low-end mobile devices, replacing them with solid, clean opaque layers (`bg-ivory`, `bg-surface-white`, `bg-ink/60`).
