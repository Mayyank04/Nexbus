# NEW PROJECT ONBOARDING: ACTIVATING THE HUMAN-QUALITY DESIGN SYSTEM

This guide explains how to activate the Antigravity Human-Quality Web Design System in any new or existing project.

---

## 1. Prerequisites Check

Because the system is installed globally in `~/.gemini/config/skills/` and registered in `~/.gemini/AGENTS.md`, any Antigravity agent operating on your machine automatically inherits these capabilities.

Verify that your global environment is active:
```bash
ls -la ~/.gemini/config/skills/human-quality-frontend
cat ~/.gemini/AGENTS.md | grep -A 5 "GLOBAL FRONTEND DESIGN QUALITY STANDARD"
```

---

## 2. Onboarding Workflow for a New Project (10 Minutes)

### Step 1: Initialize Workspace Linkage
From your new project root, create a local link to the global design skills:
```bash
mkdir -p .agents/skills
cd .agents/skills
ln -sf ~/.gemini/config/skills/human-quality-frontend .
ln -sf ~/.gemini/config/skills/taste-skill .
ln -sf ~/.gemini/config/skills/awesome-design-md .
ln -sf ~/.gemini/config/skills/humanizer .
ln -sf ~/.gemini/config/skills/ponytail .
ln -sf ~/.gemini/config/skills/impeccable .
cd ../..
```

### Step 2: Seed the Project `DESIGN.md`
Copy the standard template from the global website-starter directory:
```bash
cp ~/.gemini/config/website-starter/DESIGN.md ./DESIGN.md
```

### Step 3: Fill in the Design Brief & Surface Mode
Fill out the top section of `DESIGN.md`:
1. **Product Identity:** What does this project do?
2. **Target Audience:** Who will use it and under what physical/cognitive conditions?
3. **Surface Mode:** Choose one primary mode:
   - **Persuade:** Landing page, product launch, marketing, conversion focus.
   - **Operate:** Dashboard, settings, editor, technical workbench, operational control.
   - **Read:** Documentation, technical papers, guides, changelogs.
   - **Experience:** Portfolio, gallery, immersive showcase.
4. **Aesthetic Archetype:** Select an archetype from `awesome-design-md` (e.g. Linear dark craft, Stripe financial clarity, Apple editorial hierarchy, Supabase emerald panels).

### Step 4: Map Semantic Color & Typography Tokens
Define your CSS variables or Tailwind classes using the tokens defined in `DESIGN.md`:
- `bg-canvas`, `bg-surface-1`, `bg-surface-2`
- `border-subtle`, `border-strong`
- `text-primary`, `text-secondary`, `text-muted`
- `accent-primary`, `accent-hover`
- `status-live`, `status-warn`, `status-alert`

### Step 5: Implement Using Ponytail Restraint
- Build the simplest complete components that fulfill the user requirements.
- Never add unnecessary third-party animation libraries or complex abstractions.
- Follow the 20 mandatory rules in `~/.gemini/AGENTS.md`.

### Step 6: Run Humanizer on Copy
- Replace generic filler headlines with authentic, domain-grounded copy.
- Check against `~/.gemini/config/website-starter/anti-slop-review-checklist.md`.

### Step 7: Multi-Viewport Browser Verification
- Start your local dev server.
- Capture screenshots across the 5 standard viewports (1440x900, 1280x800, 768x1024, 390x844, 360x800).
- Check against `~/.gemini/config/website-starter/responsive-testing-matrix.md`.

### Step 8: Execute Impeccable Design Audit
- Verify contrast, focus rings, hover states, and typography rhythm.
- Verify production build succeeds cleanly.
