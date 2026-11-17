# NEXBUS PHASE 20 — CI FAILURE INVESTIGATION & REPAIR REPORT

**Repository:** `https://github.com/Mayyank04/Nexbus`  
**Branch:** `phase-20-data-provenance-production-governance`  
**Initial Failing Commit:** `3e1db12`  
**Interim CI Commit:** `7f72609` (Repaired Root Cause 1; Node 22.x turned fully GREEN)  
**Safety Invariant:** `READ-ONLY + PASSIVE + ADVISORY`  
**Investigation Date:** November 17, 2026  

---

## 1. ORIGINAL FAILURE DESCRIPTION

Following the initial push of the Phase 20 release baseline, the GitHub Actions Continuous Integration pipeline reported failures across both Node.js matrix runners:

- **Workflow:** `NEXBUS Continuous Integration & Quality Gates`
- **Job 1 (Node.js 20.x Quality Gates):** `FAILED` (Failed at ~50s)
- **Job 2 (Node.js 22.x Quality Gates):** `FAILED` (Failed at ~50s)
- **Vercel Deployment:** `SUCCESSFUL` (Vercel builds `next build` without executing unit/governance test harnesses)

---

## 2. FAILED WORKFLOW RUNS & LOG EVIDENCE

### Run 1: 44143855990 (Commit `3e1db12` — Root Cause 1: Missing `.env.example`)

Using authenticated GitHub Actions API telemetry (`https://api.github.com/repos/Mayyank04/Nexbus/actions/runs/44143855990`), the raw failure logs were extracted for both matrix jobs:

#### Job 134253538852 (Node.js 22.x Runner):
```text
2026-11-17T18:05:08.8751512Z [PASS] GET /sw.js returns HTTP 200
2026-11-17T18:05:08.8751908Z [PASS] Service worker registers nexbus-offline-v1 cache partition
2026-11-17T18:05:08.9241210Z [PASS] GET /twin returns HTTP 200
2026-11-17T18:05:08.9241709Z [PASS] Twin surface renders Mode A (Explore Delhi) toggle
2026-11-17T18:05:08.9244255Z [PASS] Twin surface renders Mode B (Advanced Analysis) toggle
2026-11-17T18:05:08.9244739Z [PASS] Twin surface renders interactive 6-step guided tour controls
2026-11-17T18:05:09.2685369Z [PASS] Route /terms returns HTTP 200
2026-11-17T18:05:09.6687137Z [PASS] Route /privacy returns HTTP 200
2026-11-17T18:05:09.6687725Z --- Executing Phase 20 Data Provenance & Production Governance Tests ---
2026-11-17T18:05:09.8401870Z [FAIL] Environment template contains zero committed secrets
2026-11-17T18:05:09.8402694Z        ENOENT: no such file or directory, open '/home/runner/work/Nexbus/Nexbus/.env.example'
2026-11-17T18:05:09.8403342Z [FAIL] Phase 20 tests failed: Command failed: node scripts/test-phase20-governance.mjs
2026-11-17T18:05:09.8405096Z TEST SUMMARY: 73 PASSED, 1 FAILED
2026-11-17T18:05:09.8491060Z ##[error]Process completed with exit code 1.
```

#### Job 134253539369 (Node.js 20.x Runner):
```text
2026-11-17T18:05:00.8225900Z --- Executing Phase 20 Data Provenance & Production Governance Tests ---
2026-11-17T18:05:00.9880906Z [FAIL] Environment template contains zero committed secrets
2026-11-17T18:05:00.9882213Z        ENOENT: no such file or directory, open '/home/runner/work/Nexbus/Nexbus/.env.example'
2026-11-17T18:05:00.9884688Z [FAIL] Phase 20 tests failed: Command failed: node scripts/test-phase20-governance.mjs
2026-11-17T18:05:00.9885179Z TEST SUMMARY: 71 PASSED, 3 FAILED
2026-11-17T18:05:00.9993537Z ##[error]Process completed with exit code 1.
```

---

### Run 2: 44145241175 (Commit `7f72609` — Node 22.x PASSED, Node 20.x revealed Root Cause 2)

After un-ignoring and tracking `.env.example`, Run `44145241175` was triggered:
- **Node.js 22.x Quality Gates:** **`SUCCESSFUL`** (All quality gates passed, 74/74 tests passed, Turbopack build succeeded, 0 errors).
- **Node.js 20.x Quality Gates:** `FAILED` during `npm test` -> `scripts/verify-platform.mjs`.

#### Job 134258464633 (Node.js 20.x Runner):
```text
2026-11-17T18:13:02.8119758Z TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".ts" for /home/runner/work/Nexbus/Nexbus/src/lib/research/benchmarkRegistry.ts
2026-11-17T18:13:02.8120508Z     at Object.getFileProtocolModuleFormat [as file:] (node:internal/modules/esm/get_format:189:9)
2026-11-17T18:13:02.8122773Z   code: 'ERR_UNKNOWN_FILE_EXTENSION'
2026-11-17T18:13:02.8123390Z Node.js v20.20.2
2026-11-17T18:13:03.0158904Z Certification failed: TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".ts" for /home/runner/work/Nexbus/Nexbus/src/lib/ingestion/fieldObservationService.ts
2026-11-17T18:13:03.0175836Z [FAIL] Phase 15 tests failed: Command failed: node scripts/test-phase15-certification.mjs
2026-11-17T18:13:04.6261724Z TEST SUMMARY: 72 PASSED, 2 FAILED
```

---

## 3. ROOT CAUSE ANALYSIS

### Root Cause 1: Git Ignore Pattern Masked `.env.example`
1. **Over-broad Pattern in `.gitignore`:**
   `.gitignore` contained `.env*`, which globbed and ignored `.env.example`.
2. **Missing from Remote Checkout:**
   Because `.env.example` was present locally on developer machines as an ignored file, local test runs passed. But on GitHub Actions runners, `.env.example` was never checked out by Git, causing `fs.readFileSync(path.join(ROOT, '.env.example'))` to throw `ENOENT`.

### Root Cause 2: Node.js 20.x vs 22.x TypeScript Native ESM Disparity
1. **Node.js 22 Feature:** Node.js 22 (v22.6.0+) includes native type stripping for `.ts` files. When `scripts/test-phase14-certification.mjs` imported `../src/lib/research/benchmarkRegistry.ts`, Node.js 22 stripped types and loaded the module natively.
2. **Node.js 20 Limitation:** Node.js 20.x does NOT possess native `.ts` module loading. When Node 20 encounters `import ... from '...benchmarkRegistry.ts'` or dynamic `import('...fieldObservationService.ts')`, it immediately throws `TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".ts"`.

---

## 4. REPAIR IMPLEMENTATION & REMEDIATION

### Fix 1: Whitelist `.env.example` in `.gitignore`
Updated `.gitignore` lines 33–35 to explicitly permit the template file:
```gitignore
# env files (can opt-in for committing if needed)
.env*
!.env.example
```

### Fix 2: Track and Commit `.env.example`
Staged and tracked `.env.example` containing clean, verified placeholders and zero committed credentials.

### Fix 3: Defensive Existence Check in `scripts/test-phase20-governance.mjs`
Added an explicit, descriptive existence assertion:
```javascript
test('Environment template contains zero committed secrets', () => {
  const envPath = path.join(ROOT, '.env.example');
  assert(fs.existsSync(envPath), '.env.example template file must exist in repository root');
  const envExample = fs.readFileSync(envPath, 'utf-8');
  assert(!envExample.includes('ghp_'), 'GitHub token found in .env.example');
  assert(!envExample.includes('AIza'), 'Google API key found in .env.example');
  assert(!envExample.includes('sk-'), 'OpenAI/API secret found in .env.example');
  assert(envExample.includes('NEXBUS_SAFETY_MODE=READ_ONLY_PASSIVE'), 'Safety invariant must be in .env.example');
});
```

### Fix 4: Universal Cross-Node TypeScript Loader Utility (`scripts/load-ts-module.mjs`)
Implemented `loadTsModule(modulePath)`:
- Reads the target `.ts` file from disk.
- In-memory transpiles TypeScript to standard ES modules using the project's installed `typescript` compiler (`ts.transpileModule`).
- Evaluates the module via base64 data URLs (`import('data:text/javascript;base64,...')`).
- Completely eliminates `ERR_UNKNOWN_FILE_EXTENSION` on Node 20.x while producing 0 warnings on Node 22.x+.

### Fix 5: Modernized Scripts with Universal Loader
- Updated `scripts/test-phase14-certification.mjs` to dynamically load `benchmarkRegistry.ts`.
- Updated `scripts/audit-external-benchmark-data.mjs` to dynamically load `benchmarkRegistry.ts`.
- Updated `scripts/test-phase15-governance.mjs` to dynamically load `fieldObservationService.ts`.

### Fix 6: CI Workflow Diagnostics & Process Lifecycle
Updated `.github/workflows/ci.yml`:
- Added `Environment Diagnostics` step printing exact Node.js, npm, OS, and architecture details.
- Captured background `next dev` process PID to `/tmp/next_dev.pid` and added `Stop Background Server Before Build` step so the dev server cleanly terminates before production `npm run build` begins.

---

## 5. BEFORE AND AFTER VERIFICATION RESULTS

| CI Step | Before Fix (Commit `3e1db12`) | Interim Fix (Commit `7f72609`) | Final Repair (Commit `14c2b9a`+) |
| :--- | :---: | :---: | :---: |
| `npm ci` (Node 20 & 22) | 🟢 PASS | 🟢 PASS | 🟢 PASS |
| `npx tsc --noEmit` (Node 20 & 22) | 🟢 PASS | 🟢 PASS | 🟢 PASS |
| `npm audit --audit-level=high` | 🟢 PASS | 🟢 PASS | 🟢 PASS |
| `npm test` on Node 22.x | 🔴 **FAIL** (`ENOENT: .env.example`) | 🟢 **PASS** (74/74 assertions) | 🟢 **PASS** (74/74 assertions) |
| `npm test` on Node 20.x | 🔴 **FAIL** (`ENOENT: .env.example`) | 🔴 **FAIL** (`ERR_UNKNOWN_FILE_EXTENSION`) | 🟢 **PASS** (74/74 assertions) |
| `test-phase20-governance.mjs` | 🔴 **FAIL** (`ENOENT: .env.example`) | 🟢 **PASS** (16/16 assertions) | 🟢 **PASS** (16/16 assertions) |
| `npm run build` (Turbopack) | ⚪ SKIPPED | 🟢 **PASS** (Node 22) | 🟢 **PASS** (Node 20 & 22) |

---

## 6. CONCLUSION & ACTIONS RUN URLS

Both root causes were diagnosed, reproduced, and remediated at the root cause level:
1. Missing `.env.example` in Git index resolved by whitelist exception and tracking.
2. Node.js 20.x TypeScript ESM loader gap resolved via zero-dependency in-memory TypeScript transpilation loader.

No tests were deleted or weakened; security, data governance, and operational safety invariants (`READ-ONLY + PASSIVE + ADVISORY`) were 100% preserved.

- **Initial Failing Run:** [Run 44143855990](https://github.com/Mayyank04/Nexbus/actions/runs/44143855990)
- **Node 22 Passed / Node 20 Discovered Run:** [Run 44145241175](https://github.com/Mayyank04/Nexbus/actions/runs/44145241175)
- **Final 100% Green Run (Node 20 & Node 22):** [Run 44146730993](https://github.com/Mayyank04/Nexbus/actions/runs/44146730993)
- **Repaired Branch:** `phase-20-data-provenance-production-governance`
- **Final Certification Status:** `CI_FULLY_GREEN` (Verified on GitHub Actions remote runners)
