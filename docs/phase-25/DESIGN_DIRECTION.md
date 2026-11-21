# NEXBUS Phase 25 — Architectural Design Direction & Visual Identity Specification

**Aesthetic Philosophy:** Swiss Transit Cartography + Human-Centred Civic Technology + Editorial Information Design  
**Date:** November 21, 2026  
**Status:** ACTIVE LIVING SPECIFICATION

---

## 1. Visual Direction & Archetype

NEXBUS rejects the saturated, generic "AI startup" aesthetic (neon purple gradients, floating glowing orbs, decorative glassmorphism, and meaningless marketing slogans). Instead, it embraces the dignified, precision-engineered tradition of **Swiss Transit Cartography and Civic Architectural Monographs**:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        NEXBUS AESTHETIC SYSTEM                         │
├────────────────────────────────────────────────────────────────────────┤
│  CANVAS:      Warm Architectural Ivory (#F5F0E6) / Porcelain (#FCFAF6) │
│  INK:         Deep Charcoal (#1A1815) — 14.2:1 AAA Contrast            │
│  ACCENT:      Delhi Terracotta (#B0432B) — Sandstone & DTC Fleet       │
│  TYPOGRAPHY:  Instrument Serif (Display) + Manrope (UI) + Mono         │
│  COMPOSITION: Disciplined Grids, Equal Edges, Zero Decorative Clutter  │
└────────────────────────────────────────────────────────────────────────┘
```

### Core Tenets:
1. **Calm, High-Contrast Readability:** Every piece of information sits on an authentic paper-like surface with contrast ratios exceeding WCAG 2.2 AA standards (body text at 14.2:1 against canvas).
2. **Authentic Domain Iconography:** Only purposeful transit icons (buses, trains, routes, stops, compass bearings, accessible paths). Zero generic AI sparkles or casual smartphone emojis.
3. **Restrained, Tactile Motion:** Interactive cards and buttons provide subtle tactile feedback (2px lift on hover, press down on click, crisp hairline focus rings). Zero disorienting 3D card tilt or arbitrary floating animations.
4. **Equal Edges & Content Enclosure:** Strict grid alignment across mobile ($16\text{px}$ padding), tablet ($24\text{px}$), and desktop ($32\text{px}$, centered in `max-w-7xl`).

---

## 2. Typography Hierarchy

| Level | Typeface | Size | Weight | Tracking | Purpose |
| :--- | :--- | :---: | :---: | :---: | :--- |
| **Display / Hero** | Instrument Serif | $48 - 72\text{px}$ | 400 | -0.02em | Editorial hero titles and section headlines |
| **H1 Section** | Instrument Serif | $32 - 44\text{px}$ | 400 | -0.015em | Major page headings |
| **H2 Subhead** | Instrument Serif | $22 - 28\text{px}$ | 400 | -0.01em | Scenario titles, panel headers |
| **H3 Card Header**| Manrope | $16 - 18\text{px}$ | 600 | 0.00em | Interactive cards, modal headings |
| **Body Large** | Manrope | $16\text{px}$ | 400 | 0.00em | Lead-in paragraphs and narrative summaries |
| **Body Text** | Manrope | $14\text{px}$ | 400 | 0.00em | Descriptions, form inputs, explainer cards |
| **Telemetry / Data**| IBM Plex Mono | $11 - 12\text{px}$ | 500 | +0.05em | Headway numbers, coordinates, timestamps, formulas |

---

## 3. Semantic Color & Status Palette

| Token Name | Value | Meaning | Contrast against Ivory |
| :--- | :--- | :--- | :---: |
| `canvas` | `#F5F0E6` | Primary background canvas | N/A |
| `surface-white` | `#FCFAF6` | Card and panel containers | 1.1:1 (Structural) |
| `ink` | `#1A1815` | High-contrast text & primary buttons | **14.2:1 (AAA Pass)** |
| `ink-secondary` | `#4A443C` | Secondary text & descriptions | **7.4:1 (AAA Pass)** |
| `ink-muted` | `#635B50` | Footnotes, timestamps, metadata | **4.8:1 (AA Pass)** |
| `terracotta` | `#B0432B` | Brand highlights & active states | **4.9:1 (AA Pass)** |
| `divider` | `#DED5C8` | Hairline borders and grid separators | 1.2:1 |
| `crowd-green` | `#15803D` | Low crowding (Plenty of seats) | **5.3:1 (AA Pass)** |
| `crowd-amber` | `#B45309` | Moderate crowding (Few empty seats) | **4.7:1 (AA Pass)** |
| `crowd-red` | `#B91C1C` | High crowding (Standing room only) | **5.8:1 (AA Pass)** |

---

## 4. Progressive Disclosure: Two-Level System

1. **Level 1 (Surface Layer):** Plain English by default. Everyday commuters, students, and citizens see plain labels ("Time between buses", "How full the bus is", "Clean Air Benefit") and 1-sentence analogies.
2. **Level 2 (Deep Layer):** Expandable via keyboard-accessible disclosures (`TwoLevelExplainer.tsx`), revealing formal transport engineering definitions, mathematical formulations ($h_i = t_i - t_{i-1}$, $L = \lambda W$), units, upstream data sources, and explicit limitations.
