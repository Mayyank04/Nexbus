# DESIGN.md — Aare & Rhine Hydro-Telemetry Portal (Kanton Aargau)

## 1. Product Identity & Purpose
- **System:** HydroNet Aargau — Amt für Umwelt (AfU) Kanton Aargau
- **Product:** Municipal Surface & Groundwater Quality Telemetry Platform
- **Audience:** Cantonal environmental engineers, water plant operators, municipal inspectors, limnologists.
- **Surface Mode:** **Operate / Read** (Live sensor telemetry, statutory GSchV threshold tracking, 24h historical trends).
- **Aesthetic Archetype:** **Swiss Municipal Utility & Scientific Limnology**
  - High information density with crisp tabular alignment (`tabular-nums`).
  - Restrained, daylight-legible palette: cool glacial water canvas (`#F4F7FA`), deep navy ink (`#0F1E2E`), alpine hydro accent (`#0A5C8A`).
  - Strict compliance with WCAG 2.1 AA (all text $\ge 4.5:1$ contrast; all UI labels $\ge 11\text{px}$).
  - Zero decorative AI clutter (no atmospheric blur blobs, no generic 3-card grids, no floating glow pills).

---

## 2. Color Tokens

| Token | CSS Variable | Hex / Value | Semantic Role & WCAG Ratio |
|---|---|---|---|
| **Deep Hydro Ink** | `--color-ink` | `#0F1E2E` | Primary body text, tabular headers, station branding (15.8:1 on canvas) |
| **Secondary Ink** | `--color-ink-muted` | `#4B5E71` | Descriptors, sensor IDs, axis labels (5.2:1 on canvas) |
| **Glacial Canvas** | `--color-canvas` | `#F4F7FA` | Primary page backdrop, light water utility theme |
| **Surface Pure** | `--color-surface` | `#FFFFFF` | Primary data tables, metric instrument clusters, trend charts |
| **Border Hairline** | `--color-border` | `#D1DCE5` | 1px structural table grid lines, card dividers |
| **Alpine Hydro** | `--color-primary` | `#0A5C8A` | Active tab highlights, river course indicators, primary controls (5.4:1 on canvas) |
| **Status Compliant** | `--color-status-ok` | `#166534` | Compliant water quality parameters, normal flow (7.1:1 on white) |
| **Status Warning** | `--color-status-warn` | `#9A3412` | Elevated threshold, thermal discharge warning (5.8:1 on white) |
| **Status Alert** | `--color-status-alert`| `#991B1B` | Statutory limit exceeded, sensor fault (7.4:1 on white) |

---

## 3. Typography Scale

- **Display & Header:** Clean Swiss Sans (`system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`)
- **Telemetry & Numerics:** Monospace Tabular Figures (`"SF Mono", "JetBrains Mono", Menlo, Consolas, monospace` with `font-variant-numeric: tabular-nums`)
- **Text Floor Rule:** Minimum 11px for all functional and metadata UI text; 14px for body and table data; 18px-24px for instrument telemetry readouts.

---

## 4. Layout Architecture
- Top bar: Cantonal authority badge, station health summary, live CET telemetry timestamp.
- Sub-bar: Station selector tablist (`role="tablist"` with full keyboard accessibility).
- Operational Grid:
  - Metric Summary Tiles (Flow rate, water temperature, dissolved $O_2$, turbidity).
  - Main Section: 5-column GSchV statutory compliance table with live status pills.
  - Secondary Section: 24h Trend visualization (SVG vector sparkline with interactive crosshair and threshold markers).
- Status States:
  - **Live Normal:** Active telemetry stream.
  - **Loading:** Skeleton placeholder pulse state.
  - **Empty:** Filter yielded zero matching sensors with reset button.
  - **Error:** Disconnected sensor alert banner with diagnostic code.
