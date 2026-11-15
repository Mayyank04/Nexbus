# NEXBUS Phase 15 — Scientific Reproduction Guide

**Document Reference**: `GUIDE-PHASE15-REPRODUCE-2026-V1`  
**Purpose**: Single-command and modular reproduction instructions for independent researchers and auditors.  
**Operational Invariant**: `READ-ONLY + PASSIVE + ADVISORY`

---

## 1. Prerequisites & Environment Setup

- **Operating System**: macOS / Linux / Windows WSL2
- **Node.js**: Version 18.0.0 or higher
- **Package Manager**: npm 9.0.0 or higher
- **Local Port**: Port 3000 (for Next.js dev server and API endpoints)

### Initial Setup Commands:
```bash
# 1. Install dependencies
npm install

# 2. Start Next.js development server
npm run dev
# (or in background daemon: npx next dev -p 3000 &)
```

---

## 2. Master Reproduction Command

To reproduce all Phase 15 validations, audits, and mathematical recalculations in a single command:

```bash
node scripts/phase15-reproduce-all.mjs
```

This master runner automatically executes all domain verification suites in sequence:
1. `node scripts/phase15-audit-data-registry.mjs`: Verifies source manifest, SHA-256 hashes, licenses, and evidence registry integrity.
2. `node scripts/phase15-journey-validation.mjs`: Evaluates the 5 candidate journey models on 240 matched runs, confirms 79.4% error reduction and cluster-aware bootstrap CIs.
3. `node scripts/phase15-headway-validation.mjs`: Evaluates empirical headway distributions, proves EWT = 21.3s and wait penalty = 11.5%, validates dual arrival regimes and edge-case guards.
4. `node scripts/phase15-od-validation.mjs`: Audits Furness IPF mass conservation, checks 8 RITES screenlines (calibration vs holdout sets), verifies GEH < 5.0.
5. `node scripts/phase15-ml-holdout-validation.mjs`: Evaluates ST-GNN crowding load generalization on dual-axis holdouts ($N=500$), checks Bayesian PICP-95 coverage (95.6%), and executes OOD stress tests.

---

## 3. Individual Script Reproduction

| Domain | Execution Command | Key Assertions Verified |
|---|---|---|
| **Data Registry** | `node scripts/phase15-audit-data-registry.mjs` | 8 sources registered, SHA-256 valid, ethics status `PENDING`, zero synthetic-to-observed promotion. |
| **Journey Times** | `node scripts/phase15-journey-validation.mjs` | Schedule MAE: 4.33m, ST-GNN MAE: 0.89m, 79.4% error reduction, Cluster CI: [0.80, 1.01]m, Width Ratio: 1.49x. |
| **Headways & EWT** | `node scripts/phase15-headway-validation.mjs` | Aurobindo $\mu=6.20\text{m}, \sigma=2.10\text{m}$, EWT = 21.3s, Penalty = 11.5%, Seddon-Day transition at $\mu > 12\text{m}$. |
| **OD Screenlines** | `node scripts/phase15-od-validation.mjs` | Furness mass delta < 1 pax, 100% calibration GEH < 5, 100% holdout GEH < 5, GEH symmetry. |
| **ML Holdouts** | `node scripts/phase15-ml-holdout-validation.mjs` | ST-GNN MAE = 1.21%, $R^2 = 0.977$, PICP-95 = 95.6%, Transfer degradation = 1.25x, OOD errors < 10%. |
| **Full Platform** | `npm test` | All 61+ platform verification tests passing cleanly. |

---

## 4. Deterministic Seeds & Hardware Specifications

- **PRNG Multiplier**: Linear Congruential Generator ($a = 9301, c = 49297, m = 233280$)
- **Journey Seed**: `101` (in `phase15-journey-validation.mjs`)
- **ML Holdout Seed**: `303` (in `phase15-ml-holdout-validation.mjs`)
- **Inference Runtime**: Standard V8 Node.js runtime on Apple Silicon / x86_64, zero external GPU dependencies required.
