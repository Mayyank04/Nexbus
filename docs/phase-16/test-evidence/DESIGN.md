# DESIGN.md — Hydrowatch Zürich (Amt für Abfall, Wasser, Energie und Luft)

## 1. Product Identity & Purpose
- **Product Name:** Hydrowatch Zürich (Hydrometrisches Informationssystem Zürich)
- **Authority:** Baudirektion Kanton Zürich — Amt für Abfall, Wasser, Energie und Luft (AWEL)
- **Category:** Civic Lake, River & Groundwater Quality Telemetry Portal
- **Core Users:** Canton limnologists, municipal water plant operators (Wasserversorgung Zürich / WVZ), civil protection authorities, research scientists, and the public.
- **Surface Mode:** **Operate / Read** (Continuous operational station telemetry, sensor health monitoring, water quality standards verification, regulatory parameter logging).
- **Aesthetic Archetype:** **Swiss Utility & Limnological Cartography**
  - Crisp tabular typographic hierarchy, high density, unyielding structural alignment.
  - Neutral high-clarity ground referencing the Swiss Federal style of information design and bathymetric precision.
  - Zero decorative fluff; maximum telemetry fidelity and legibility in harsh daylight or operational control centers.

---

## 2. Core Design Principles
1. **Limnological Grounding:** Data displays represent genuine hydrological and limnological metrics (Lake Zurich bathymetric layers, Limmat river discharge, turbidity in FNU, dissolved oxygen in mg/L, Escherichia coli CFU/100ml, pH, temperature profiles).
2. **Tabular Precision:** Every numeric measurement uses monospaced tabular figures (`font-variant-numeric: tabular-nums`) with explicit physical units and timestamps down to the second.
3. **High-Contrast Operability:** High daylight legibility with WCAG 2.1 AA contrast exceeding 7:1 for critical metric readouts.
4. **Restraint Over Novelty:** No ornamental illustrations, no floating glowing blur spheres, no generic marketing rhetoric, and no arbitrary card grids.

---

## 3. Color Tokens

| Token | CSS Variable | Hex / Value | Purpose & Semantics |
|---|---|---|---|
| **Granite Ink** | `--color-granite-ink` | `#1A202C` | Primary dark text, deep framing borders, structural tabular headers |
| **Glacial Basin** | `--color-glacial-basin` | `#F0F4F8` | Primary page canvas, cool freshwater field backdrop |
| **Alpine Lake** | `--color-alpine-lake` | `#006699` | Primary hydrological brand, station pins, active sensor selections |
| **Potable Green** | `--color-potable-green` | `#2F855A` | Normal operating status, compliant water parameters, safe bathing criteria |
| **Surface Pure** | `--color-surface-pure` | `#FFFFFF` | Primary data tables, metric instrument clusters, reading viewports |
| **Surface Muted** | `--color-surface-muted` | `#E2E8F0` | Sensor group containers, coordinate tags, secondary panels |
| **Border Subtle** | `--color-border-subtle` | `#CBD5E0` | Hairline grid lines, column dividers (1px solid) |
| **Border Focus** | `--color-border-focus` | `#006699` | 2px accessible focus ring with 2px offset |
| **Advisory Amber** | `--color-advisory-amber` | `#D69E2E` | Parameter approaching threshold limit (e.g. elevated river temperature) |
| **Alert Red** | `--color-alert-red` | `#E53E3E` | Sensor fault or regulatory violation (e.g. turbidity threshold exceeded) |
| **Text Secondary** | `--color-text-secondary`| `#4A5568` | Parameter descriptors, station metadata, measurement notes |
| **Text Muted** | `--color-text-muted` | `#718096` | Sensor IDs, timestamp offsets, calibration cycle tags |

---

## 4. Typography Scale

- **Primary Typeface:** Neutral Clean Sans: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`
- **Telemetry & Monospace Typeface:** Tabular Monospace: `"SF Mono", "JetBrains Mono", "Roboto Mono", Menlo, Consolas, monospace`
- **Monospace Feature Settings:** `font-feature-settings: "tnum" 1, "zero" 1; font-variant-numeric: tabular-nums;`

### Hierarchy Scale:
- **Station / Page Header (H1):** 24px (1.5rem) / Line-height 1.25 / Semi-bold (600) / Tracking -0.015em
- **Section & Subsystem Header (H2):** 16px (1.0rem) / Line-height 1.3 / Semi-bold (600) / All-Caps, Tracking 0.05em
- **Instrument / Metric Group Header (H3):** 14px (0.875rem) / Line-height 1.4 / Medium (500)
- **Primary Telemetry Value:** 24px (1.5rem) Monospace / Bold (700) / Tabular Numbers
- **Body & Parameter Labels:** 13px–14px / Line-height 1.5 / Regular (400)
- **Sensor Metadata & Timestamp:** 11px–12px Monospace / Regular (400) / Uppercase metadata tags

---

## 5. Layout Architecture & Grid (Operate / Read Mode)

Instead of marketing landing-page layouts, Hydrowatch Zürich utilizes an operational console layout:
1. **Utility Status Bar:** Cantonal agency branding, live telemetry sync status, server UTC+1 clock, global sensor health counter.
2. **Subsystem Filter Strip:** Operational station switcher (Tiefenbrunnen, Quaibrücke, Limmat / Oberer Letten, Sihlbrugg, Uetliberg Groundwater Well 4).
3. **Primary Telemetry Board:** Two-column split operational view:
   - *Left Column (60%):* Limnological Water Quality Telemetry Table (Parameter, Current Reading, Regulatory Limit, 24h Trend, Sensor Health, Calibration Date).
   - *Right Column (40%):* Bathymetric Depth & Stratification Profile (Thermocline & dissolved oxygen across 0m to 136m depth gradient).
4. **Hydrological Event Log:** Audit-grade chronological telemetry log with station code, alert classification, parameter delta, and technician acknowledgement status.

---

## 6. Strict Anti-Patterns (Enforced)

The following AI frontend clichés and marketing antipatterns are strictly forbidden in this project:
- ❌ **No Generic 3-Card Grids:** No floating rounded-card trios with meaningless hover lifts. Data is organized into structured, high-density data tables and split operational monitors.
- ❌ **No Floating Circular Gradient Blur Blobs:** No `blur-3xl`, `bg-purple-500/20`, or atmospheric ambient light blobs. Backgrounds must be pure Glacial Basin (`#F0F4F8`) with crisp structural boundaries.
- ❌ **No Fake Marketing Hype or Buzzwords:** No "Revolutionizing Swiss Water Intelligence", "AI-Powered Limnology", "Seamless Next-Gen Monitoring", or "Trusted by 10,000+ Limnologists". All copy is direct, factual, and cantonal-administrative.
- ❌ **No Decorative Icon Clutter:** Every symbol serves as an explicit operational status signal (e.g., active telemetry pulse, compliant check, alert flag). No arbitrary icons preceding every headline.
- ❌ **No Unreadable Low-Contrast Text:** All body text and data numbers meet or exceed WCAG 2.1 AA 4.5:1 (Granite Ink on Glacial Basin provides 11.2:1 contrast).
- ❌ **No Smooth-Scroll Hijacking or Gratuitous Motion:** All view changes and interactions are instant and predictable (<150ms state updates).
