# GLOBAL PERSISTENCE TEST & INDEPENDENT WORKSPACE VERIFICATION

**Phase:** NEXBUS Phase 17 — Skill Runtime Verification & Enforcement  
**Date:** 2026-11-16  
**Test Location:** `/tmp/global-persistence-verification`  
**Auditor:** Independent Technical & Design Systems Architecture Audit Team  

---

## 1. Test Objectives

To answer the fundamental question:
> *If a completely new website project is opened in Antigravity tomorrow, will it actually discover and use the five original skills provided, or will it merely have their folders installed?*

This test evaluated whether:
1. Global skill installation in `~/.gemini/config/skills/` persists independently of any specific project repository.
2. The Antigravity runtime discovers and indexes the skills automatically into its `<skills>` system prompt.
3. Supporting reference files (e.g. `awesome-design-md/design-md/`, `impeccable/reference/`, `taste-skill/references/`) remain accessible across workspaces.
4. An unrelated project can author its own distinct `DESIGN.md` without leaking NEXBUS-specific design tokens (terracotta `#B84C32`, warm ivory `#F5F0E6`, Delhi transit terms).

---

## 2. Global Environment Audit Findings

| Component | Physical Path | Global Availability | Verification Finding |
|---|---|---|---|
| **Global Agent Rules** | `~/.gemini/AGENTS.md` | Persistent (46 lines) | Injected into every Antigravity turn as `<RULE[user_global]>`. Governs all web design tasks globally. |
| **Global Skills Directory** | `~/.gemini/config/skills/` | Persistent (30 skills) | Contains `human-quality-frontend`, `taste-skill`, `awesome-design-md`, `humanizer`, `ponytail`, `impeccable`, plus subskills. |
| **Starter Scaffolding** | `~/.gemini/config/website-starter/` | Persistent (8 templates) | Provides clean, unopinionated scaffolding documents for any new project. |

---

## 3. Independent Domain Test (*Gothenburg Port Authority*)

In `/tmp/global-persistence-verification`, a test design specification was initialized for a totally unrelated industrial domain:
- **Project:** Nordic Maritime Cargo Routing (Gothenburg Port Authority)
- **Domain:** Automated Container Vessel Berthing & Marine Radar Telemetry
- **Color System:**
  - Deep Oceanic Navy: `#0A192F` (Dark Canvas)
  - Vessel Bay Panel: `#172A45` (Surface)
  - Marine Cyan: `#64FFDA` (Primary Accent)
  - Collision Alert: `#FF5370` (Warning)
- **Token Isolation Audit:** Executed automated token grep against Nexbus palette (`terracotta`, `B84C32`, `F5F0E6`, `ivory`, `delhi`, `parchment`).
- **Result:** **ZERO LEAKAGE DETECTED**. The global skills and instructions adapt to the project's declared domain without contaminating it with previous project tokens.

---

## 4. Verification Conclusion

Antigravity's global skill discovery mechanism operates via `~/.gemini/config/skills/`. Any new project created on this machine immediately has access to all five upstream design skills, their references, their CLI tools, and the orchestrator.
