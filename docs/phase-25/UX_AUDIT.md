# NEXBUS Phase 25 — Comprehensive User Experience Audit & Heuristic Evaluation

**Audit Scope:** Complete Application Interface (`/`, `/twin`, `/journey`, `/simulate`, `/control`, `/methodology`, `/about`, `/privacy`, `/terms`)  
**Audit Framework:** Nielsen-Molich Usability Heuristics + Impeccable Craft Floor + Taste-Skill Anti-Slop Directive  
**Date:** November 21, 2026  
**Status:** AUDIT COMPLETE — REMEDIATION TARGETS IDENTIFIED

---

## 1. Route-by-Route UX Audit Findings

### A. Homepage (`/`)
- **Heuristic 1: Match Between System and the Real World**
  - *Finding:* Section 01 and Section 02 used poetic, AI-inflated metaphors ("32 million souls, carved into radial arteries", "Corridors that breathe with the morning rush"). These distract from the municipal transit utility.
  - *Finding:* 5 Entry Point cards used casual raw emojis (🗺️, 🧭, 👥, 🧪, 📊), clashing with the Swiss Transit Cartography aesthetic.
  - *Fix:* Replace emojis with semantic Lucide icons in dedicated neutral containers; rewrite prose into direct, active, informative language.
- **Heuristic 2: Consistency and Standards**
  - *Finding:* Primary corridor table rows had hardcoded numbers (`640,000 PAX`) rather than using the centralized formatting utility.
  - *Fix:* Route numbers through `formatPax()` and `formatPercent()`.

### B. Digital Twin (`/twin`)
- **Heuristic 3: Visibility of System Status**
  - *Finding:* Mode selector and Guided Tour buttons featured generic AI sparkle icons (`Sparkles`) and star emojis (`🌟`).
  - *Finding:* 5-Question Explainer used emojis (`🗺️`, `🚌`) in question headers.
  - *Fix:* Replace sparkles with transit symbols (`Compass`, `MapPin`, `Route`).
  - *Finding:* 2D fallback toggle was functional but lacked explicit labeling for low-power and screen-reader modes.
  - *Fix:* Enhance tooltip and ARIA labels explaining the SVG vector fallback.

### C. Journey Planner (`/journey`)
- **Heuristic 4: Recognition Rather Than Recall**
  - *Finding:* Header used stock AI buzzwords ("Seamless Journeys Across Delhi", "Multimodal Urban Journey Intelligence", "real-time interchange friction scoring").
  - *Fix:* Humanize to "Plan Your Trip Across Delhi" and "Delhi Travel Route Planner" with clear, everyday commuter explanations.
  - *Finding:* Route comparison cards clearly separated Fastest, Balanced, and Comfort First, but wait time indicators needed sharper visual hierarchy.

### D. Simulation Lab (`/simulate`)
- **Heuristic 5: Error Prevention & Transparency**
  - *Finding:* Curiosity cards used raw emojis (`🚌`, `🍃`, `🌧️`) and warning emoji (`⚠️`).
  - *Fix:* Replace with precision Lucide icons (`Bus`, `Leaf`, `CloudRain`, `AlertTriangle`) on high-contrast surfaces.
  - *Finding:* Ensure that "signal preemption" language does not imply live traffic light actuation (preserving the `READ-ONLY + PASSIVE + ADVISORY` invariant).

### E. Navigation & Onboarding Components
- **Heuristic 6: Flexibility and Efficiency of Use**
  - *Finding:* `Navbar.tsx` had `backdrop-blur-md` and unused `Sparkles` import.
  - *Finding:* `ExperienceLevelSelector.tsx` used `Sparkles` for "Easy Explore".
  - *Finding:* `WelcomeOnboardingModal.tsx` used `Sparkles` for "Important Stops" and `backdrop-blur-xs`.
  - *Fix:* Replace `Sparkles` with `Compass` and `MapPin`; replace blur backdrops with solid architectural ivory/ink surfaces.

---

## 2. Priority Remediation Register

| Issue ID | Route / Component | Problem Description | Severity | Planned Fix |
| :--- | :--- | :--- | :---: | :--- |
| **UX-2501** | `Navbar.tsx`, `twin/page.tsx`, `ExperienceLevelSelector.tsx`, `WelcomeOnboardingModal.tsx` | Generic AI `Sparkles` icon used across 6 files | **Major** | Replace with authentic domain transit icons (`Compass`, `MapPin`, `Bus`). |
| **UX-2502** | `page.tsx`, `simulate/page.tsx`, `WhatAmILookingAtGuide.tsx` | Raw emojis (🗺️, 🧭, 👥, 🧪, 📊, 🚌, 🍃, 🌧️) used as UI badges | **Moderate** | Replace with crisp SVG/Lucide transit iconography in geometric frames. |
| **UX-2503** | `page.tsx`, `journey/page.tsx` | AI-generated marketing cliches ("seamless", "souls carved into arteries", "corridors that breathe") | **Moderate** | Rewrite text using Humanizer directives to be clear, grounded, and human-written. |
| **UX-2504** | `Navbar.tsx`, `ProvenanceIndicator.tsx`, `WelcomeOnboardingModal.tsx` | Unnecessary `backdrop-blur` glassmorphism | **Minor** | Replace with solid Swiss ivory and charcoal overlays. |
| **UX-2505** | `page.tsx` | Table rows using hardcoded passenger strings | **Minor** | Route through deterministic formatters (`formatPax`, `formatPercent`). |
