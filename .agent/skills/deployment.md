# Skill: Deployment
<!-- layer: skills | version: 1.0 | updated: 2026-08-01 -->

## Trigger

Use this playbook when deploying any version to staging or production.

> ⚠️ **Production deploys require explicit CK approval. Do not auto-deploy to production.**

---

## Pre-Flight Checks (ALL must pass before deploying)

```bash
# 1. Ensure on correct branch / commit
git log --oneline -5

# 2. Quality gate
pnpm lint
npx tsc --noEmit
pnpm build

# 3. Security gate
npm audit --audit-level=high
# If gitleaks installed:
gitleaks detect --source . --no-git

# 4. Confirm no .env secrets in tracked files
git diff --cached | grep -i "secret\|key\|password\|token"
```

If any check fails → **STOP**. Report to CK. Do not proceed.

---

## Staging Deploy (Dokploy)

```bash
# Build Docker image
docker build -t ck-portfolio:staging .

# Tag and push to registry (fill in your registry URL)
docker tag ck-portfolio:staging <registry>/ck-portfolio:staging
docker push <registry>/ck-portfolio:staging

# Trigger Dokploy redeploy (via Dokploy dashboard or CLI)
```

Post-staging verification:
- [ ] HTTP 200 on root URL
- [ ] Hero video loads and plays
- [ ] Contact form renders
- [ ] No console errors
- [ ] Mobile layout correct at 375px

---

## Production Deploy (Vercel)

> **HITL Checkpoint**: CK must provide "deploy approved" message before this step.

```bash
# Vercel deploys automatically on push to main
# OR manually via Vercel CLI:
vercel --prod
```

Post-production verification:
- [ ] HTTP 200 on production URL
- [ ] HTTPS enforced (no mixed content)
- [ ] Performance: Lighthouse score ≥ 90 on mobile
- [ ] All Phase 1 features functional
- [ ] No console errors

---

## Post-Deploy Steps

1. Add CHANGELOG entry:
   ```
   ## YYYY-MM-DD
   - Deployed v<version> to <staging|production>
   - <brief description of what changed>
   ```
2. Update `WORKING_STATE.md` with new deployment URLs
3. Update `memory/project-context.md` with live/staging URLs
4. Notify CK with deployment confirmation and URLs

---

## Rollback Procedure

```bash
# Vercel: roll back via dashboard → Deployments → Promote previous
# Dokploy: re-deploy previous image tag from registry

# Git: if rollback needed at code level
git revert HEAD
git push origin main
```
