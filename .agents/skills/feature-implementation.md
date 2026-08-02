# Skill: Feature Implementation
<!-- layer: skills | version: 1.0 | updated: 2026-08-01 -->

## Trigger

Use this playbook when implementing any new feature from the approved backlog.

---

## Pre-conditions (Check ALL before starting)

- [ ] Task exists in `BACKLOG.md` with status `[ ]` (not icebox)
- [ ] PRD section for this feature is understood (re-read if needed)
- [ ] Current branch is NOT `main` — create a feature branch first
- [ ] No `.env` secrets in the working tree that could be accidentally committed
- [ ] Invoke **Okanagan Rule** if any requirement is ambiguous

---

## Step-by-Step Playbook

### Step 1 — Branch
```bash
git checkout main
git pull origin main
git checkout -b feat/<feature-name>
```
Branch naming: `feat/`, `fix/`, `chore/`, `docs/` + kebab-case description.

### Step 2 — Implement
- Follow the locked tech stack (see `constitution.md` §4)
- Use CSS custom properties, not inline styles
- Client components must have `'use client'` directive (Next.js)
- All animations must have `prefers-reduced-motion` fallback
- No `any` TypeScript types — use explicit types or `unknown`

### Step 3 — Self-Review (Before Committing)
```bash
pnpm lint                  # Must pass with 0 errors
npx tsc --noEmit           # Must pass with 0 type errors
pnpm build                 # Must complete without errors
npm audit --audit-level=high  # Must return 0 high/critical
```

### Step 4 — Test
```bash
# Run Playwright E2E (if configured)
pnpm test:e2e

# Manual check:
# - Desktop (1440px): layout, animation, interactions
# - Mobile (375px): layout, touch targets, navigation
# - Reduced motion: GSAP animations disabled gracefully
# - No console errors in browser DevTools
```

### Step 5 — Commit
```bash
git add .
git commit -m "feat: <concise description>"
# Commit message format: <type>: <description>
# Types: feat, fix, chore, docs, style, refactor, test
```

### Step 6 — Update Docs
- Mark task `[x]` in `BACKLOG.md`
- Add entry to `CHANGELOG.md`
- Update `WORKING_STATE.md` if state changes

### Step 7 — Push & Request Review
```bash
git push origin feat/<feature-name>
```
Then notify CK with:
- What was built
- What was tested
- Any open questions or risks
- Link to diff/PR

---

## Definition of Done

All items in `constitution.md` §6 must be checked before declaring the task complete.

---

## Common Pitfalls

| Pitfall | Prevention |
|---|---|
| Scope creep | Re-read the PRD section; stick to MoSCoW Must-Haves |
| TypeScript `any` | Use `unknown` and narrow the type |
| Missing reduced-motion | Always wrap GSAP in `matchMedia('(prefers-reduced-motion: no-preference)')` |
| Hardcoded strings | Use constants or content config files |
| Direct `main` commit | Always check `git branch` before committing |
