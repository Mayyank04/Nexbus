# NEXBUS PHASE 20 — CI/CD REPRODUCIBILITY & RELEASE PIPELINE SPECIFICATION

**Workflows:** `.github/workflows/ci.yml` & `.github/workflows/release-governance.yml`  
**Execution Environment:** GitHub Actions Ubuntu Runners (`ubuntu-latest`)  
**Safety Invariant:** `READ-ONLY + PASSIVE + ADVISORY`

---

## 1. CONTINUOUS INTEGRATION WORKFLOW (`.github/workflows/ci.yml`)

The NEXBUS CI pipeline executes automatically on every `push` and `pull_request` against `main` and `phase-*` branches across a Node.js matrix ($20.x$ and $22.x$):

```
┌────────────────────────────────────────────────────────────────────────┐
│                   NEXBUS AUTOMATED CI PIPELINE                         │
├────────────────────────────────────────────────────────────────────────┤
│ 1. Checkout Repository (`actions/checkout@v4`)                         │
│                           │                                            │
│ 2. Setup Node.js Matrix (`actions/setup-node@v4` with npm cache)       │
│                           │                                            │
│ 3. Deterministic Dependency Install (`npm ci`)                         │
│                           │                                            │
│ 4. Static Type Verification (`npx tsc --noEmit`)                       │
│                           │                                            │
│ 5. Dependency Security Scan (`npm audit --audit-level=high`)           │
│                           │                                            │
│ 6. Background Dev Server Launch (`npx next dev -p 3000 &`)             │
│                           │                                            │
│ 7. Platform Verification Harness (`npm test` — 74 passing tests)       │
│                           │                                            │
│ 8. Phase 20 Governance & Provenance Suite (`test-phase20-governance`)   │
│                           │                                            │
│ 9. Production Turbopack Compilation (`npm run build`)                  │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. PRODUCTION RELEASE GOVERNANCE (`.github/workflows/release-governance.yml`)

When a formal release tag (`v*`) is pushed, the release governance pipeline executes strict non-negotiable release gates:

1. **Safety Invariant AST Scan:**
   ```bash
   ! grep -rnE "dispatchBus|switchSignal|interlockingControl|sendVehicleCommand" src/app/api/
   ```
   If any physical actuation keyword is detected in the API directory, the release build fails immediately and aborts.
2. **Deterministic Build & Checksums:**
   - Compiles production static and dynamic bundles via `npm run build`.
   - Generates SHA-256 cryptographic checksums for every source file:
     ```bash
     find src/ public/ -type f -exec sha256sum {} + | sort -k 2 > release-artifacts/source-checksums.sha256
     ```
   - Bundles the release metadata, commit SHA, and build timestamp into an auditable release dossier uploaded to GitHub Artifacts.

---

## 3. BUILD REPRODUCIBILITY GUARANTEE

- **Lockfile Enforcement:** Uses `npm ci` to guarantee that all transitive dependencies match `package-lock.json` bit-for-bit.
- **Node.js Parity:** Minimum supported engine is Node.js $20.0.0$; verified compatible with Node.js $22.x$ and Node.js $24.x$.
- **Zero Global Dependencies:** All build tools, TypeScript compilers, and test runners are pinned directly in `package.json` devDependencies.

---

## 4. CONCLUSION

The NEXBUS CI/CD pipeline ensures that every code change is subjected to automated type checking, security auditing, multi-criteria test assertions, and cryptographic release verification.
