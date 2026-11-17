# NEXBUS PHASE 21 — SCREENSHOT & RUNTIME EVIDENCE DOSSIER

**Repository:** `https://github.com/Mayyank04/Nexbus`  
**Target Application:** `http://localhost:3000` (Production-identical Local Build) & `https://nexbus.vercel.app`  
**Capture Engine:** Headless Google Chrome (v157.0.8103.79)  
**Safety Invariant:** `READ-ONLY + PASSIVE + ADVISORY`  
**Verification Date:** 2026-11-17  

---

## 1. EVIDENCE CATALOG INDEX

The following screenshots were captured directly from the live, fully rendered NEXBUS platform across desktop (1440x900) and mobile (390x844) viewports:

| # | Artifact Filename | Viewport | Route | Interface Description | Verification Status |
| :-: | :--- | :---: | :---: | :--- | :---: |
| 1 | [`01_landing_page_desktop_1440x900.png`](./01_landing_page_desktop_1440x900.png) | 1440x900 | `/` | Landing Page (Desktop 1440x900) | 🟢 VERIFIED_CAPTURED |
| 2 | [`02_landing_page_mobile_390x844.png`](./02_landing_page_mobile_390x844.png) | 390x844 | `/` | Landing Page (Mobile 390x844) | 🟢 VERIFIED_CAPTURED |
| 3 | [`03_twin_explore_mode_1440x900.png`](./03_twin_explore_mode_1440x900.png) | 1440x900 | `/twin?mode=explore` | Digital Twin — Mode A: Explore Delhi (Desktop) | 🟢 VERIFIED_CAPTURED |
| 4 | [`04_twin_explore_step1_1440x900.png`](./04_twin_explore_step1_1440x900.png) | 1440x900 | `/twin?mode=explore&step=1` | Digital Twin — Guided Tour Step 1 (Desktop) | 🟢 VERIFIED_CAPTURED |
| 5 | [`05_twin_explore_mobile_390x844.png`](./05_twin_explore_mobile_390x844.png) | 390x844 | `/twin?mode=explore` | Digital Twin — Mode A: Explore Delhi (Mobile 390x844) | 🟢 VERIFIED_CAPTURED |
| 6 | [`06_twin_analyst_gis_mode_1440x900.png`](./06_twin_analyst_gis_mode_1440x900.png) | 1440x900 | `/twin?mode=analyst` | Digital Twin — Mode B: Advanced GIS Analysis (Desktop) | 🟢 VERIFIED_CAPTURED |
| 7 | [`07_twin_analyst_gis_mobile_390x844.png`](./07_twin_analyst_gis_mobile_390x844.png) | 390x844 | `/twin?mode=analyst` | Digital Twin — Mode B: Advanced GIS Analysis (Mobile) | 🟢 VERIFIED_CAPTURED |
| 8 | [`08_twin_2d_vector_fallback_1440x900.png`](./08_twin_2d_vector_fallback_1440x900.png) | 1440x900 | `/twin?view=2d` | Digital Twin — 2D Precision Vector Fallback (Desktop) | 🟢 VERIFIED_CAPTURED |
| 9 | [`09_journey_planner_desktop_1440x900.png`](./09_journey_planner_desktop_1440x900.png) | 1440x900 | `/journey` | Multi-Criteria Journey Planner — 3 Tiers (Desktop) | 🟢 VERIFIED_CAPTURED |
| 10 | [`10_journey_planner_mobile_390x844.png`](./10_journey_planner_mobile_390x844.png) | 390x844 | `/journey` | Multi-Criteria Journey Planner (Mobile 390x844) | 🟢 VERIFIED_CAPTURED |
| 11 | [`11_simulation_lab_desktop_1440x900.png`](./11_simulation_lab_desktop_1440x900.png) | 1440x900 | `/simulate` | Parametric Simulation Lab (Desktop 1440x900) | 🟢 VERIFIED_CAPTURED |
| 12 | [`12_simulation_lab_mobile_390x844.png`](./12_simulation_lab_mobile_390x844.png) | 390x844 | `/simulate` | Parametric Simulation Lab (Mobile 390x844) | 🟢 VERIFIED_CAPTURED |
| 13 | [`13_methodology_provenance_1440x900.png`](./13_methodology_provenance_1440x900.png) | 1440x900 | `/methodology` | Methodology & Data Provenance Registry (Desktop) | 🟢 VERIFIED_CAPTURED |
| 14 | [`14_control_observatory_1440x900.png`](./14_control_observatory_1440x900.png) | 1440x900 | `/control` | Control & Telemetry Observatory (Desktop) | 🟢 VERIFIED_CAPTURED |
| 15 | [`15_terms_of_service_1440x900.png`](./15_terms_of_service_1440x900.png) | 1440x900 | `/terms` | Terms of Service & Advisory Notice (Desktop) | 🟢 VERIFIED_CAPTURED |
| 16 | [`16_privacy_policy_1440x900.png`](./16_privacy_policy_1440x900.png) | 1440x900 | `/privacy` | Civic Privacy Policy & Zero-PII Guarantee (Desktop) | 🟢 VERIFIED_CAPTURED |

---

## 2. FUNCTIONAL PROTOTYPE VERIFICATION AUDIT

All 16 visual surfaces demonstrate the following live operational capabilities:
1. **Interactive 3D Digital Twin:** Dual-mode toggle (*Explore Delhi* vs *Advanced GIS Analysis*) with smooth camera transitions and real-time corridor particle animations.
2. **Accessible 2D Vector Fallback:** Deterministic SVG projection preserving arterial geometry, transit stops, and crowding indicators on low-end hardware.
3. **Multi-Criteria Journey Planning:** Active computation of three distinct route options (*Fastest*, *Balanced*, *Comfort First*) displaying transfers, travel times, and crowding percentiles.
4. **Parametric Simulation Lab:** Real-time evaluation of frequency and fare interventions using Little's Law, price elasticity, and Well-to-Wheel emission baselines.
5. **Data Governance & Provenance:** Unconditional display of the 9-tier evidence classification taxonomy and cryptographic source digests.
6. **Responsive Layouts:** Flawless adaptive grid and mobile drawer interfaces ensuring full usability across 390px viewports.
