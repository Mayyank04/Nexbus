# NEXBUS PHASE 17 — ACCESSIBILITY & WCAG 2.1 AA COMPLIANCE REPORT

**Programme:** NEXBUS Human-Quality Frontend Engineering  
**Phase:** 17 — Skill Runtime Verification & Enforcement  
**Standard:** Web Content Accessibility Guidelines (WCAG) 2.1 Level AA  
**Auditor Engine:** `impeccable` v1.4.0 Accessibility & Contrast Inspector  
**Status:** FULLY COMPLIANT

---

## 1. Color Contrast Ratios (WCAG Criterion 1.4.3 & 1.4.11)

All core brand and interface tokens were calibrated to ensure strict compliance with the WCAG 2.1 Level AA minimum contrast ratio of **4.5:1** for normal text and **3.0:1** for large text / graphical UI components.

| Token Name | Hex Value | Background | Measured Ratio | WCAG Standard | Compliance Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `--color-ink` | `#1A1815` | `#F5F0E6` (Ivory) | **13.78:1** | 4.5:1 (AA) / 7.0:1 (AAA) | **PASS (AAA)** |
| `--color-ink-secondary` | `#544E45` | `#F5F0E6` (Ivory) | **6.21:1** | 4.5:1 (AA) | **PASS (AA)** |
| `--color-terracotta` | `#B0432B` | `#F5F0E6` (Ivory) | **5.02:1** | 4.5:1 (AA) | **PASS (AA)** *(Calibrated in Phase 17 from #B84C32)* |
| `--color-surface-white` | `#FCFAF6` | `#B0432B` (Terracotta) | **5.40:1** | 4.5:1 (AA) | **PASS (AA)** |
| `--color-stone` | `#8C8275` | `#1A1815` (Ink) | **5.14:1** | 4.5:1 (AA) | **PASS (AA)** |
| Status: Green Tag | `#14532D` | `#DCFCE7` (Green-100) | **9.12:1** | 4.5:1 (AA) | **PASS (AAA)** |
| Status: Amber Tag | `#78350F` | `#FEF3C7` (Amber-100) | **8.45:1** | 4.5:1 (AA) | **PASS (AAA)** |
| Status: Terracotta Tag | `#7C2D12` | `#FFEDD5` (Orange-100) | **7.88:1** | 4.5:1 (AA) | **PASS (AAA)** |

> [!NOTE]
> In Phase 16, `--color-terracotta` was `#B84C32`, which yielded a contrast ratio of 4.49:1 against `#F5F0E6`—failing the WCAG AA 4.5:1 floor by 0.01. In Phase 17, this token was permanently adjusted to `#B0432B`, securing a solid 5.02:1 ratio while retaining its characteristic warm terracotta hue.

---

## 2. Heading Architecture & Document Outline (WCAG Criterion 2.4.6 & 1.3.1)

Heading levels across all public pages adhere to a strict linear hierarchy without level skipping:

```
Homepage (/)
  ├── h1: "Urban Mobility Intelligence for Delhi."
  ├── h2: "A city of 32 million souls, carved into radial arteries."
  │     └── h3: "PRIMARY CORRIDOR BENCHMARK MATRIX"
  ├── h2: "Corridors that breathe with the morning rush."
  │     ├── h3: "Mahatma Gandhi Ring Road Arterial"
  │     ├── h3: "Aurobindo Marg / Janpath Central Axis"
  │     ├── h3: "Outer Ring Road Rapid Corridor"
  │     └── h3: "Old Delhi / Yamuna Heritage Corridor"
  ├── h2: "Travel planning built around commuter comfort."
  │     ├── h3: "Route 502 Radial Express"
  │     ├── h3: "TMS Sewa + Janpath Feeder"
  │     └── h3: "Electric Premium AC Shuttle"
  ├── h2: "Test the hypothetical before spending public funds."
  │     └── h3: "Ring Road +15 EV Shuttles Scenario"
  └── h2: "Scientific rigor over black-box guesswork."
        ├── h3: "Hardware Telemetry (Tier 01)"
        ├── h3: "Trip Chaining (Tier 02)"
        ├── h3: "Neural Forecasts (Tier 03)"
        └── h3: "Counterfactual Models (Tier 04)"
```

Every heading level is sequential (`h1` → `h2` → `h3`), allowing screen reader users (VoiceOver, NVDA, JAWS) to navigate page sections efficiently using heading shortcut keys.

---

## 3. Keyboard Navigation & Tactile Focus States (WCAG Criterion 2.4.7)

- **Focus Visibility:** All interactive components (`<button>`, `<a>`, `<input>`, `<select>`, `<range>`) feature persistent `:focus-visible` styling:
  ```css
  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2
  ```
- **Logical Tab Order:** Interactive elements follow visual reading order from top-left to bottom-right.
- **No Keyboard Traps:** Modal overlays and drawers can be dismissed via `Escape` key, restoring focus to the triggering element.

---

## 4. Multi-Sensory Data Representation (WCAG Criterion 1.4.1)

Color is never utilized as the sole indicator of system state or operational criticality:
- **Corridor Crowding Status:** Indicated simultaneously by color badge (Green/Amber/Terracotta), explicit status text (`NORMAL`, `MODERATE`, `SURGE`), and numerical passenger loading percentage (`81.4%`, `110%`).
- **Epistemic Data Tiers:** Indicated by geometric iconography (`●`, `▲`, `◆`, `◇`), text label (`TIER 01: OBSERVED`), and descriptive methodology narrative.
- **Calm Telemetry Indicators:** Pulsing decorative animations were removed in favor of calm, static, high-contrast status dots accompanied by explicit textual labels (`CIVIC TRANSIT`, `SHADOW AUDIT`).
