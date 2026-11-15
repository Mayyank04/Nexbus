# UPSTREAM SKILL AUDIT & SECURITY ANALYSIS

This document provides a comprehensive security and structural audit of the five upstream design repositories integrated into the Antigravity engineering environment.

---

## 1. Scope & Audit Methodology

Each upstream repository was cloned into an isolated inspection environment and examined against five criteria:
1. **License Compatibility:** Verification of Open Source licenses (MIT, Apache 2.0) and preservation of copyright headers.
2. **Executable Code & Scripts:** Code review of `.sh`, `.py`, `.js`, `.mjs`, and binary launchers to detect remote fetching, privilege escalation, or arbitrary execution.
3. **Network Access & Telemetry:** Verification that no unauthorized telemetry, user tracking, or telemetry endpoints exist.
4. **Filesystem Modifications:** Ensuring skills operate strictly within documented workspace/global configuration roots.
5. **Antigravity Metadata Compliance:** Conformance of `SKILL.md` frontmatter with Antigravity’s skill discovery specification.

---

## 2. Upstream Audit Results

### 2.1 `blader/humanizer` (v4.0.0)
- **Author:** Michael Blader
- **Commit:** `b48c832f0f809c1b5658edbb838c2521b72f2413`
- **License:** MIT License
- **Architecture:** Pure markdown rules and heuristics designed to detect and eliminate AI writing patterns (contrast staging, forced triads, buzzword inflation, em-dash overuse).
- **Scripts:** `scripts/validate-package.py` (Local Python script verifying package schema).
- **Network / Telemetry:** None. Purely passive knowledge base.
- **Security Verdict:** **100% CLEAN (PASS)**. Zero attack surface.

### 2.2 `Leonxlnx/taste-skill` (v2.5.1)
- **Author:** Leonxlnx
- **Commit:** `f6b76575f949707b4e3c37cd86cb44b0b98643e8`
- **License:** MIT License
- **Architecture:** Complete design system and layout engine (`design-taste-frontend`). Establishes strict rules for visual consistency, typography scales, equal margins, and one-section-per-screen discipline.
- **Scripts:** 157 local Node.js (`.mjs`) scripts under `scripts/` and `tests/`. Includes `gate.mjs` (local visual validation), `copy-lint.mjs` (anti-slop copy checks), and `shoot.mjs` (local Chrome-based viewport screenshotting).
- **Network / Telemetry:** Scripts inspect local DOM trees and run local browser instances. No external data transmission.
- **Security Verdict:** **CLEAN (PASS)**. All scripts execute in local user space without network exfiltration.

### 2.3 `VoltAgent/awesome-design-md` (v1.0.0)
- **Author:** VoltAgent
- **Commit:** `fcc70284932276d085f01ef9f83edde90b1258cb`
- **License:** MIT License
- **Architecture:** Comprehensive repository containing 84 production `DESIGN.md` extractions from developer-focused tools and consumer sites (Linear, Stripe, Apple, Vercel, Supabase, Raycast, PostHog, Cal.com, etc.).
- **Scripts:** Zero executable scripts. 100% static Markdown.
- **Network / Telemetry:** None.
- **Security Verdict:** **100% CLEAN (PASS)**. Safe reference material.

### 2.4 `DietrichGebert/ponytail` (v1.0.0)
- **Author:** Dietrich Gebert
- **Commit:** `96608e078b2d5ea607c5c3b8b5a54d1c1fba6846`
- **License:** MIT License
- **Architecture:** YAGNI engineering restraint suite. Provides `ponytail` (core developer mode), `ponytail-audit` (repo bloat analysis), `ponytail-review` (diff review), `ponytail-debt` (shortcut tracker), and `ponytail-gain` (measured savings).
- **Scripts:** Local test suites and git-grep comment scrapers.
- **Network / Telemetry:** Local Git log and grep analysis only.
- **Security Verdict:** **CLEAN (PASS)**. Operates strictly on repository files with zero side-effects.

### 2.5 `pbakaus/impeccable` (v4.9.1)
- **Author:** Paul Bakaus
- **Commit:** `2b86d9c07b97d4bed7de23583e1bd1e58dd2baae`
- **License:** Apache License 2.0
- **Architecture:** Professional design director QA framework. Features 48 comprehensive reference playbooks covering hierarchy, typography, color palettes, craft floors, accessibility, motion, and critique rubrics.
- **Scripts:** Includes `scripts/impeccable` (CLI wrapper) and subagent dispatchers. Falls back directly to local markdown inspection if the optional binary launcher is omitted.
- **Network / Telemetry:** Safe local execution. Direct markdown fallback ensures resilience.
- **Security Verdict:** **CLEAN (PASS)**. Documented fallback path operates completely offline without external binaries.

---

## 3. License Matrix & Attribution

| Repository | Upstream License | Attribution Notice | Compatibility |
|---|---|---|---|
| `blader/humanizer` | MIT | Copyright (c) 2026 Michael Blader | Fully compatible |
| `Leonxlnx/taste-skill` | MIT | Copyright (c) 2026 Leonxlnx | Fully compatible |
| `VoltAgent/awesome-design-md` | MIT | Copyright (c) 2026 VoltAgent | Fully compatible |
| `DietrichGebert/ponytail` | MIT | Copyright (c) 2026 Dietrich Gebert | Fully compatible |
| `pbakaus/impeccable` | Apache 2.0 | Copyright 2026 Paul Bakaus | Fully compatible with Apache 2.0 terms |

All original `LICENSE` files and copyright statements are preserved verbatim in each installed skill directory under `~/.gemini/config/skills/`.
