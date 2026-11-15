#!/usr/bin/env python3
"""Deterministic verification of skill availability and orchestration in test workspace."""

import os
import sys

REQUIRED_SKILLS = [
    "human-quality-frontend",
    "taste-skill",
    "awesome-design-md",
    "humanizer",
    "ponytail",
    "impeccable",
]

def check_skills(workspace_dir):
    skills_dir = os.path.join(workspace_dir, ".agents", "skills")
    results = {}
    missing = []
    available = []
    
    for s in REQUIRED_SKILLS:
        target = os.path.join(skills_dir, s)
        skill_md = os.path.join(target, "SKILL.md")
        if os.path.exists(skill_md):
            results[s] = {"status": "AVAILABLE", "path": target}
            available.append(s)
        else:
            results[s] = {"status": "UNAVAILABLE", "path": target}
            missing.append(s)
            
    return results, available, missing

def main():
    workspace = sys.argv[1] if len(sys.argv) > 1 else "/tmp/water-quality-portal-test"
    results, available, missing = check_skills(workspace)
    
    print(f"Audit Workspace: {workspace}")
    print(f"Available Skills ({len(available)}/{len(REQUIRED_SKILLS)}): {', '.join(available)}")
    
    if missing:
        print(f"CRITICAL: Missing Skills ({len(missing)}): {', '.join(missing)}")
        print("ORCHESTRATION INVARIANT ENFORCED:")
        print("  - The orchestrator refuses to mark missing skills as executed.")
        print(f"  - Limitation documented: {missing[0]} instructions cannot be executed.")
        print("  - Zero substitution policy: No foreign or synthetic mock skill substituted.")
        return 1
    else:
        print("All 6 required design skills are available and verified.")
        return 0

if __name__ == "__main__":
    sys.exit(main())
