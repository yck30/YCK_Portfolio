# Hook: Pre-Execution Guard
<!-- layer: hooks | version: 1.0 | updated: 2026-08-01 -->

## Purpose

This hook fires **before any code change is made**. It is a mandatory checkpoint that prevents unauthorized, out-of-scope, or unsafe changes from entering the codebase.

---

## Guard Checklist

Run through ALL guards. If ANY fail → **STOP and report to CK**.

### Guard 1 — Task Authorization
- [ ] The task exists in `BACKLOG.md` as an active item (not Icebox)
- [ ] The task is in the current Phase (Phase 1 items only unless CK has approved Phase 2 work)
- [ ] CK has not placed a freeze or hold on this task

**Fail action**: Ask CK to add the task to the backlog before proceeding.

---

### Guard 2 — Branch Safety
- [ ] Current branch is NOT `main` — run `git branch --show-current` to verify
- [ ] Branch name follows convention: `feat/`, `fix/`, `chore/`, `docs/` prefix

**Fail action**: Create the correct branch before making any changes.
```bash
git checkout -b feat/<task-name>
```

---

### Guard 3 — Scope Boundary
- [ ] The planned change is within the PRD scope (not inventing new features)
- [ ] The change does not touch files outside the task's domain

**Fail action**: Invoke Okanagan Rule — ask CK to clarify before proceeding.

---

### Guard 4 — Secret Safety
- [ ] No secrets, credentials, or sensitive data will be introduced
- [ ] No `.env` files are about to be committed (they should be gitignored)

**Fail action**: Remove secrets, add to `.env`, ensure `.gitignore` covers `.env`.

---

### Guard 5 — Dependency Check
- [ ] If adding a new npm package, it has been justified (not just "might be useful")
- [ ] The package is from a reputable source (npm + GitHub stars + recent maintenance)
- [ ] `npm audit` has been run after adding the package

**Fail action**: Remove the unjustified dependency. Raise to CK if genuinely needed.

---

## Okanagan Rule Trigger

If ANY of the following is true about the task, **invoke the Okanagan Rule** (stop and ask CK):

- The requirement has two or more valid interpretations
- The PRD does not cover this specific case
- The task would require changing locked technology stack items
- The task would require a deployment without prior approval

Format your question to CK:
```
🔴 Okanagan Rule Triggered

Task: <task name>
Ambiguity: <describe exactly what is unclear>
Option A: <first interpretation>
Option B: <second interpretation>
Option C: (if applicable)

Which should I proceed with?
```
