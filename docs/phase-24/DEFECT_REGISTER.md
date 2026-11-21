# NEXBUS Phase 24 — Defect Register and Resolution Audit

**Audit Date:** November 21, 2026  
**Scope:** Discovered Defects, Root Causes, and Permanent Resolutions in Phase 24  
**Status:** All Identified Defects Permanently Resolved

---

## 1. Defect Log & Tracking

| Defect ID | Severity | Component / Area | Description | Root Cause | Resolution | Verification Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **DEF-2401** | **Critical** | `src/app/page.tsx:324:21` | React SSR/CSR hydration mismatch warning (`642,000` vs `6,42,000`) on Safari/Chrome in India. | `num.toLocaleString()` evaluates to `en-US` on Node.js server and `en-IN` on browser client. | Replaced unpinned calls with `formatNumber` (`en-US` pinned) or `formatIndianNumber` (`en-IN` pinned). Prohibited `suppressHydrationWarning`. | **RESOLVED & VERIFIED** (25/25 hydration tests pass) |
| **DEF-2402** | **Major** | `src/lib/content/plainLanguage.ts` | Jargon-heavy transit terms alienating non-technical commuters and students. | Single-tier technical definitions without plain-language translations or analogies. | Implemented Two-Level Explainer system (`TwoLevelExplainer.tsx`) with Level 1 plain language and Level 2 expandable technical cards. | **RESOLVED & VERIFIED** (14 terms encoded, 172 assertions pass) |
| **DEF-2403** | **Major** | `src/app/twin/page.tsx` | 3D Digital twin markers creating false impression of sub-second live GPS satellite tracking. | Lack of explicit data boundaries and layer provenance disclosures. | Authored `gisLayersRegistry.ts` covering all 11 GIS layers with explicit "What this layer does NOT prove" disclosures. | **RESOLVED & VERIFIED** (11/11 layers documented and verified) |
| **DEF-2404** | **Moderate** | `src/app/journey/page.tsx` | Journey planner presenting routes purely by theoretical speed without crowding context. | Lack of ergonomic route categorization and confidence intervals. | Added 3 distinct choices (Fastest, Balanced, Comfort First), wait times in metric bars, and triple-encoded crowding. | **RESOLVED & VERIFIED** (Visually and automated verified) |
| **DEF-2405** | **Moderate** | `src/app/simulate/page.tsx` | Policy simulation results presenting complex delta distributions without plain-language context. | Raw mathematical output without narrative translation. | Introduced 1-click curiosity cards and 4 plain-language outcome questions while preserving Little's Law equations. | **RESOLVED & VERIFIED** (Visually and automated verified) |
| **DEF-2406** | **Minor** | `src/data/gisLayersRegistry.ts` | TypeScript compiler error `TS2322: Type '"STATIC"' is not assignable to type 'FreshnessStatus'`. | Registry used non-canonical string literal `'STATIC'`. | Replaced `'STATIC'` with `'FRESH'` in `gisLayersRegistry.ts`. | **RESOLVED & VERIFIED** (`tsc --noEmit` exits 0) |

---

## 2. Prevention Mechanisms

To prevent recurrence of these defects in future releases:
1. **Hydration Regression Gate:** `scripts/test-phase24-hydration.mjs` is integrated into CI and platform verification scripts, failing the build if any unpinned `.toLocaleString()` or `suppressHydrationWarning` is introduced.
2. **Usability & Governance Gate:** `scripts/test-phase24-usability.mjs` validates that all new terminology or GIS layers provide plain-language titles, descriptions, and limitations.
3. **Safety Gate:** Automated scans verify that no vehicle dispatch or traffic actuation endpoints are ever created.
