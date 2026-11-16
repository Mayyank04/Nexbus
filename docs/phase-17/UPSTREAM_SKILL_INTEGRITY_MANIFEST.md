# UPSTREAM SKILL INTEGRITY MANIFEST

**Phase:** NEXBUS Phase 17 — Skill Runtime Verification & Enforcement  
**Audit Date:** 2026-11-16  
**Auditor:** Independent Technical & Design Systems Architecture Audit Team  
**Evaluation Standard:** Zero-fabrication, byte-level upstream repository verification  

---

## 1. Upstream Repositories and Pinned Commits

This manifest records the five mandatory upstream repositories, their exact Git remotes, pinned commit SHAs, commit dates, authors, verified licenses, and physical installation paths on this machine.

| Repository Name | Exact Upstream Remote URL | Pinned Commit SHA | Commit Date | Author & Commit Subject | Verified License | Frontmatter Skill Name | Installed Path |
|---|---|---|---|---|---|---|---|
| **humanizer** | `https://github.com/blader/humanizer.git` | `b48c832f0f809c1b5658edbb838c2521b72f2413` | 2026-11-09 17:34:24 -0800 | Siqi Chen (`Merge pull request #333 from blader/release-4.0.0`) | **MIT License** (Copyright (c) 2025 Siqi Chen) | `humanizer` | `~/.gemini/config/skills/humanizer` |
| **taste-skill** | `https://github.com/Leonxlnx/taste-skill.git` | `f6b76575f949707b4e3c37cd86cb44b0b98643e8` | 2026-11-07 13:33:21 +0100 | Leon Lin (`Merge pull request #196 from Leonxlnx/v2.5.1`) | **MIT License** (Copyright (c) 2026 Leonxlnx) | `design-taste-frontend` | `~/.gemini/config/skills/taste-skill` |
| **awesome-design-md** | `https://github.com/VoltAgent/awesome-design-md.git` | `fcc70284932276d085f01ef9f83edde90b1258cb` | 2026-10-28 18:45:37 +0300 | Necati Özmen (`docs: point starter kit banner to getdesign.md/website-starter-kit (#478)`) | **MIT License** (Copyright (c) 2026 VoltAgent) | `awesome-design-md` | `~/.gemini/config/skills/awesome-design-md` |
| **ponytail** | `https://github.com/DietrichGebert/ponytail.git` | `96608e078b2d5ea607c5c3b8b5a54d1c1fba6846` | 2026-10-29 12:59:31 +0100 | DietrichGebert (`docs: add PhotoReunion to Already built with Ponytail (#1313)`) | **MIT License** (Copyright (c) 2026 DietrichGebert) | `ponytail` (+ 5 subskills) | `~/.gemini/config/skills/ponytail` |
| **impeccable** | `https://github.com/pbakaus/impeccable.git` | `2b86d9c07b97d4bed7de23583e1bd1e58dd2baae` | 2026-11-14 17:52:02 -0800 | Paul Bakaus (`Merge pull request #1473 from pbakaus/hotfix/next-branch`) | **Apache License 2.0** (January 2004) | `impeccable` | `~/.gemini/config/skills/impeccable` |

---

## 2. Upstream License Verification & Attribution

Each repository's `LICENSE` file was read directly from the pinned checkout and verified against expected legal terms:

1. **`humanizer`:**
   - License file: `LICENSE`
   - Type: **MIT License**
   - Header text: `MIT License / Copyright (c) 2025 Siqi Chen / Permission is hereby granted, free of charge...`
   - Note on previous report: Earlier Phase 16 notes misidentified Humanizer as Apache 2.0; actual upstream file confirms MIT.

2. **`taste-skill`:**
   - License file: `LICENSE`
   - Type: **MIT License**
   - Header text: `MIT License / Copyright (c) 2026 Leonxlnx / Permission is hereby granted, free of charge...`

3. **`awesome-design-md`:**
   - License file: `LICENSE`
   - Type: **MIT License**
   - Header text: `MIT License / Copyright (c) 2026 VoltAgent / Permission is hereby granted, free of charge...`

4. **`ponytail`:**
   - License file: `LICENSE`
   - Type: **MIT License**
   - Header text: `MIT License / Copyright (c) 2026 DietrichGebert / Permission is hereby granted, free of charge...`

5. **`impeccable`:**
   - License file: `LICENSE`
   - Type: **Apache License, Version 2.0**
   - Header text: `Apache License, Version 2.0, January 2004, http://www.apache.org/licenses/`

---

## 3. Byte-Level Comparison: Upstream Clone vs. Installed Copy

### 3.1 `humanizer`
- **Upstream Location:** Cloned from `blader/humanizer.git` at root.
- **Installed Location:** `~/.gemini/config/skills/humanizer/`
- **Diff on `SKILL.md`:** **Zero diff (Identical).**
- **Supporting Assets:** `agents/` and `scripts/validate-package.py` installed.
- **Omitted from Upstream:** `.claude-plugin/`, `.cursor-plugin/`, `.github/`, `package.json` (platform packaging metadata unnecessary for Antigravity runtime execution).

### 3.2 `taste-skill`
- **Upstream Location:** Upstream repository `Leonxlnx/taste-skill.git` contains a nested skill directory at `skills/taste-skill/`.
- **Installed Location:** `~/.gemini/config/skills/taste-skill/`
- **Diff on `SKILL.md`:** **Zero diff (Identical).**
- **Frontmatter Name:** `design-taste-frontend` (Version: 2.5.1).
- **Supporting Assets:** `references/` (19 reference documents), `library/` (`palettes.json`, `type.json`), `scripts/` (`copy-lint.mjs`, `consistency.mjs`, `effects.mjs`, `gate.mjs`, `moments.mjs`, `perf.mjs`, etc.), `assets/` (component templates, layout check scripts, effects library). All installed and functional.

### 3.3 `awesome-design-md`
- **Upstream Location:** `VoltAgent/awesome-design-md.git` is a curated design-system repository containing 84 production `DESIGN.md` analyses inside `design-md/`.
- **Installed Location:** `~/.gemini/config/skills/awesome-design-md/`
- **Skill Adapter:** Upstream does not ship a top-level `SKILL.md` because it is maintained as an awesome-list repository. A standard Antigravity `SKILL.md` adapter was authored with frontmatter `name: awesome-design-md` and instructions on selecting references from the 84 profiles.
- **Supporting Assets:** All 84 production design systems in `design-md/` are present and byte-for-byte identical to upstream.

### 3.4 `ponytail`
- **Upstream Location:** `DietrichGebert/ponytail.git` contains modular skills in `skills/` (`skills/ponytail/`, `skills/ponytail-audit/`, `skills/ponytail-debt/`, `skills/ponytail-gain/`, `skills/ponytail-help/`, `skills/ponytail-review/`).
- **Installed Location:** Installed as 6 atomic subskills in `~/.gemini/config/skills/`:
  - `ponytail`
  - `ponytail-audit`
  - `ponytail-debt`
  - `ponytail-gain`
  - `ponytail-help`
  - `ponytail-review`
- **Diff on all 6 `SKILL.md` files:** **Zero diff (Identical to upstream `skills/$sub/SKILL.md`).**

### 3.5 `impeccable`
- **Upstream Location:** `pbakaus/impeccable.git` targets multiple harnesses (`.gemini/skills/impeccable/`, `.agents/skills/impeccable/`, `.cursor/skills/impeccable/`, etc.).
- **Installed Location:** `~/.gemini/config/skills/impeccable/`
- **Diff on `SKILL.md`:** 4 lines adjusted: formatted YAML metadata (`metadata: version: 4.9.1`) and adapted paths to `.agents/skills/impeccable/scripts/impeccable` to match the local symlink layout.
- **Supporting Assets:** `reference/` (40+ design playbooks and rubrics), `scripts/impeccable` (native launcher), `live-browser.js`, `command-metadata.json`, `engine-checksums.txt`.
- **Telemetry Inspection:** Telemetry setting verified via `$HOME/.gemini/config/skills/impeccable/scripts/impeccable telemetry status`. Turned permanently OFF via `impeccable telemetry off` (persisted in `~/.impeccable/config.json`).

---

## 4. Verification Check Summary

| Component | Status | Evidence |
|---|---|---|
| Upstream Git SHAs | **VERIFIED** | Extracted directly from `.git/` refs of upstream clones |
| Upstream Licenses | **VERIFIED** | Inspected actual LICENSE text; MIT for 4 repos, Apache 2.0 for Impeccable |
| Frontmatter Names | **VERIFIED** | Parsed YAML headers; recorded `design-taste-frontend` for Taste-Skill |
| Supporting Scripts | **VERIFIED** | Inspected script headers; tested Node.js/Python execution |
| Telemetry Disabled | **VERIFIED** | Explicitly disabled in Impeccable configuration |
