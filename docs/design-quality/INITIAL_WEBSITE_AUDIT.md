# INITIAL WEBSITE AUDIT & AI-SLOP HEURISTIC REPORT

**Project:** NEXBUS — Urban Mobility Intelligence and Advisory Decision-Support Platform for Delhi  
**Audit Date:** 2026-11-16  
**Auditor:** Antigravity Human-Quality Design Review Team  
**Starting Baseline Release:** Phase 15 certified release (`0ed4487`)  
**Development Server:** Next.js 16.4.6 (Turbopack) on `http://localhost:3000`

---

## 1. Executive Summary & Diagnostic Scorecard

While NEXBUS had previously adopted an editorial serif typography foundation (`Instrument Serif` + `IBM Plex Mono` on an ivory canvas) to escape the ubiquitous "dark navy + cyan gradient" AI template, our deep multi-viewport inspection revealed significant visual flaws, layout brittleness, component inconsistencies, and generic AI design artifacts.

### Overall Score: **68 / 140** (Mean: 4.86 / 10)

| Category | Score (1-10) | Evaluation & Empirical Findings | High-Impact Remediation |
|---|:---:|---|---|
| **1. Art Direction** | 6 / 10 | Attempted an architectural/editorial monograph look, but suffers from conflicting design accents (terracotta, blue, gold, stone) and empty 3D viewport canvas voids. | Unify into a cohesive Swiss Transit Cartography system; provide robust 2D vector fallback when WebGL is unaccelerated. |
| **2. Typography** | 6 / 10 | Instrument Serif headline is dignified, but body hierarchy has arbitrary sizing, low contrast on descriptions, and unadjusted letter spacing on uppercase labels. | Standardize type scale tokens (Display, H1, H2, H3, Body, Mono); enforce strict minimum line heights and line length boundaries. |
| **3. Composition** | 4 / 10 | Repetitive 3-card and 4-card horizontal stacks; massive empty voids on desktop; unbalanced hero split (5:7 ratio leaves right half hollow). | Introduce structured multi-column split panes, data tables, and integrated transit diagrams. |
| **4. Spacing & Rhythm** | 5 / 10 | Erratic vertical section padding (`py-24` juxtaposed against cramped `pt-8`); inconsistent card padding (`p-4` vs `p-6` vs `p-8`). | Anchor to strict 4px/8px layout grid with predictable section spacing. |
| **5. Color & Contrast** | 5 / 10 | Muted text (`#71695F` on `#F5F0E6`) fails WCAG AA contrast on secondary copy (3.2:1 ratio). Scattered hardcoded hex colors (`#DED5C8`, `#FCFAF6`). | Replace scattered hex codes with semantic design tokens; increase dark text contrast to >= 4.5:1. |
| **6. Navigation** | 4 / 10 | Desktop navbar contains unaligned mode-switch boxes; mobile navigation has clipped text and poor touch-target spacing; floating "N" circular badge overlaps UI. | Redesign Navbar into clean single-line transit masthead; eliminate floating "N" badge; build responsive drawer for mobile. |
| **7. Components** | 5 / 10 | Inconsistent buttons across pages (some with magnetic wrappers, some with drop shadows, some with dark fills, some with borders); mismatched filter chips. | Consolidate Button, Badge, FilterChip, Card, and Panel into standardized design system tokens. |
| **8. Content & Copy** | 6 / 10 | High-level copy has scholarly intent, but landing page sometimes slips into generic marketing slogans ("Every journey shapes a city", "Find better journeys"). | Rewrite copy through the Humanizer filter: ground statements in real Delhi transit operations, headway frequencies, and depot telematics. |
| **9. Motion & Polish** | 4 / 10 | Framer Motion / GSAP animations cause text to fail to render on mobile (`about_mobile-390.png` showed completely invisible headlines due to un-triggered scroll reveals). | Remove brittle opacity/transform scroll reveal wrappers on essential text; enforce `prefers-reduced-motion` compliance. |
| **10. Interaction States** | 5 / 10 | Hover states are inconsistent; focus-visible rings are missing on several filter buttons; loading states lack layout stability. | Implement uniform `focus-visible:ring-2` outlines and deterministic loading skeletons. |
| **11. Responsive Design** | 3 / 10 | Severe horizontal clipping on 390px and 360px mobile screens; hero text truncates; camera control buttons overflow screen width. | Refactor flex/grid layouts with proper `min-w-0`, `flex-wrap`, and fluid responsive scaling. |
| **12. Accessibility** | 5 / 10 | Contrast failures on muted text; icon-only buttons missing `aria-label`; missing `aria-current="page"` on active links. | Remediate contrast to WCAG 2.1 AA; add comprehensive screen reader labels. |
| **13. Performance** | 6 / 10 | Three.js canvas initialization blocks initial content paint; heavy canvas bundle loaded even when WebGL is unaccelerated. | Defer 3D canvas; ensure instant semantic HTML paint with zero layout shifts. |
| **14. Maintainability** | 4 / 10 | Monolithic page files (e.g. `src/app/page.tsx` > 700 lines); duplicated corridor cards and inline styles. | Apply Ponytail YAGNI: break into lean, reusable components and shared tokens. |

---

## 2. Catalog of AI-Generated Design Patterns Detected

Our inspection verified the presence of the following diagnostic AI-generated patterns:

1. **Floating Circular Logo Badge:** A floating black circle with an "N" icon fixed at `bottom-4 left-4` (`z-50`). It overlaps bottom navigation bars, obscures footer text, and serves no functional purpose.
2. **Horizontal Card Stacks:** Sections 01, 02, 03, and 05 on the homepage each present identical repetitive card grids (3 cards, then 4 cards, then 3 cards, then 4 cards) with identical borders.
3. **Ghost Canvas Syndrome:** When WebGL acceleration is unavailable (as in headless browsers or lower-power devices), the right 60% of the hero viewport renders as a completely empty beige void with random annotation cards floating in space.
4. **Oversized Italicized Accent Words:** `<span className="italic font-normal text-terracotta">shapes</span>` in the primary headline creates an artificial "thought leadership" flourish rather than an authentic transit engineering identity.
5. **Invisible Text via Scroll-Reveal Animation:** In `src/app/about/page.tsx` and `src/app/methodology/page.tsx`, text is wrapped in `<TextReveal>` and `<ScrollReveal>` components that initialize with opacity 0 and translateY. On smaller viewports or static renders, the headline is completely invisible.
6. **Mismatched Secondary Buttons:** The hero section pairs an `bg-ink text-surface-white` primary button with a secondary `border border-ink bg-ivory` button wrapped in arbitrary `<Magnetic>` event listeners that behave inconsistently on touch screens.
7. **Severe Mobile Horizontal Overflow:** On viewports under 400px width, text blocks lack `break-words` and `min-w-0`, causing right-edge truncation of the main narrative paragraph.
