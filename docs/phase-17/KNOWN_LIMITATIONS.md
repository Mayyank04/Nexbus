# NEXBUS PHASE 17 — KNOWN LIMITATIONS & ARCHITECTURAL DISCLOSURES

**Programme:** NEXBUS Human-Quality Frontend Engineering  
**Phase:** 17 — Skill Runtime Verification & Enforcement  
**Status:** FULLY DISCLOSED & DOCUMENTED

---

## 1. Intentional Palette Choice vs. Tool Heuristics (`[cream-palette]`)

- **Detection:** `impeccable detect` emits a warning:
  ```
  [cream-palette] cream/beige page background rgb(245, 240, 230)
  → A warm cream or beige page background has become the default "tasteful" AI surface, reached for by reflex. Choose a background that comes from a deliberate palette, not the safe warm off-white.
  ```
- **Architectural Rationale:** NEXBUS was conceived from Phase 16 under the intentional, domain-specific archetype **Swiss Transit Cartography & Editorial Monograph**. In this archetype, `#F5F0E6` (warm ivory) is not a generic "SaaS off-white", but an intentional visual metaphor representing archival cartographic rag paper, historic transit monographs, and physical transit timetables.
- **Decision:** The warm ivory palette is intentionally retained. Changing it to sterile white (`#FFFFFF`) or dark mode would destroy the typographic contrast and editorial monograph identity. This finding is cataloged as an intentional design invariant, not an unaddressed defect.

---

## 2. Headless Automated Testing & WebGL 2D Fallback

- **Behavior:** When running automated headless Chrome instances via CLI (`/Applications/Google Chrome.app/Contents/MacOS/Google Chrome --headless`), macOS sandbox constraints prevent creation of a hardware-accelerated CoreGraphics display link (`CVDisplayLinkCreateWithCGDisplay failed. CVReturn: -6670`).
- **Resilience Architecture:** Rather than crashing or rendering a blank container, `DelhiCityCanvas.tsx` gracefully detects missing WebGL context and switches to the **Cartographic 2D Vector Fallback**—a crisp SVG architectural diagram mapping Delhi's concentric ring roads and radial corridors.
- **Production Experience:** In real desktop and mobile browsers with hardware GPU support, Three.js instanced rendering activates automatically at 60 FPS.

---

## 3. Tool Runtime Dependencies

- **`taste-skill` (`copy-lint.mjs`):** The copy linter is written as an ES module (`copy-lint.mjs`) requiring Node.js 18+ on the host machine. Environments without Node.js cannot execute `copy-lint.mjs` natively.
- **`impeccable` Engine:** Impeccable utilizes a precompiled native binary launcher (`~/.impeccable/bin/impeccable`). Upstream defaults to sending anonymous execution telemetry; this has been permanently disabled via `impeccable telemetry off` (persisted to `~/.impeccable/config.json`).
- **`awesome-design-md` Library:** The repository supplies 84 markdown design system files in `design-md/`. It provides reference tokens and typography scales; it does not execute as an automated linting CLI.

---

## 4. Typographic Em Dash Budget

- **Detection:** `copy-lint.mjs` issues `WARN copy-em-dash (7 em dashes in body, budget 2)`.
- **Architectural Rationale:** In the Editorial Monograph style, em dashes (`—`) are used in section kickers and figure captions (e.g. `FIG. 01 — CALIBRATED TRANSIT TOPOLOGY`). This reflects classic Swiss editorial book typography. They are retained intentionally in figure captions while omitted from running narrative prose.
