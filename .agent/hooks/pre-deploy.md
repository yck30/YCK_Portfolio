# Hook: Pre-Deploy Guard
<!-- layer: hooks | version: 1.0 | updated: 2026-08-01 -->

## Purpose

This hook fires **before any deployment** (staging or production). Every check must pass. This is a hard gate — no exceptions without CK's explicit written override.

---

## Mandatory Gate Sequence

Run in this exact order. Stop at first failure and report.

### Gate 1 — Code Quality
```bash
pnpm lint
```
✅ Pass: 0 errors (warnings acceptable but must be noted)
❌ Fail: Fix all errors before proceeding

```bash
npx tsc --noEmit
```
✅ Pass: 0 type errors
❌ Fail: Fix all type errors before proceeding

---

### Gate 2 — Build Integrity
```bash
pnpm build
```
✅ Pass: Build completes, `dist/` or `.next/` produced
❌ Fail: Fix build errors before proceeding

---

### Gate 3 — Security Audit
```bash
npm audit --audit-level=high
```
✅ Pass: 0 high or critical vulnerabilities
❌ Fail: Patch vulnerabilities before proceeding

```bash
# Secret scan (if gitleaks installed)
gitleaks detect --source . --no-git
```
✅ Pass: 0 secrets detected
❌ Fail: Remove secrets, rotate credentials, do NOT deploy

---

### Gate 4 — Test Suite
```bash
pnpm test:e2e
```
✅ Pass: All Playwright tests pass
❌ Fail: Fix failing tests before deploying to production

For staging: test failures are allowed BUT must be documented and reported to CK.

---

### Gate 5 — HITL Checkpoint

**For staging**: Automated gates 1–4 passing is sufficient.

**For production**: 
> ⚠️ **CK must explicitly state "deploy to production approved" before this gate passes.**

Without this approval, halt the deployment regardless of technical gate status.

---

## Gate Failure Report Format

```markdown
## Pre-Deploy Gate Failure Report

**Date**: YYYY-MM-DD HH:MM
**Target Environment**: staging | production
**Branch**: <branch-name>
**Commit**: <short-hash>

### Failed Gate
**Gate**: <Gate name>
**Command**: `<command that failed>`
**Output**:
```
<paste error output here>
```

### Recommended Action
<what needs to be fixed>

### Estimated Fix Time
<your estimate>
```
