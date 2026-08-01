# Hook: Post-Deploy Verification
<!-- layer: hooks | version: 1.0 | updated: 2026-08-01 -->

## Purpose

This hook fires **immediately after any deployment** completes. It verifies the deployment is healthy and documents the state. A deployment is NOT complete until all post-deploy checks pass.

---

## Verification Checklist

### Check 1 — HTTP Smoke Test
```bash
curl -o /dev/null -s -w "%{http_code}" https://<deployed-url>/
```
✅ Pass: Returns `200`
❌ Fail: Investigate server logs; consider rollback

```bash
# Check key pages
curl -o /dev/null -s -w "%{http_code}" https://<deployed-url>/projects
curl -o /dev/null -s -w "%{http_code}" https://<deployed-url>/blog
```

---

### Check 2 — HTTPS Enforcement
```bash
curl -I http://<deployed-url>/
```
✅ Pass: Returns `301` redirect to HTTPS
❌ Fail: Configure HTTPS redirect in hosting platform

---

### Check 3 — Critical Asset Loading
Manually verify in browser:
- [ ] Hero video loads and autoplays (or shows poster fallback)
- [ ] Fonts loaded (no flash of unstyled text beyond 1s)
- [ ] No 404 errors in Network tab
- [ ] No JavaScript errors in Console tab

---

### Check 4 — Performance Spot-Check
Run Lighthouse on the production URL (Chrome DevTools → Lighthouse):
- [ ] Performance score ≥ 85 on mobile
- [ ] LCP (Largest Contentful Paint) ≤ 2.5s
- [ ] CLS (Cumulative Layout Shift) ≤ 0.1
- [ ] No accessibility errors flagged

---

### Check 5 — Security Headers
```bash
curl -I https://<deployed-url>/ | grep -i "strict-transport\|x-content-type\|x-frame\|content-security"
```
✅ Pass: Key headers present
❌ Fail: Update `next.config.js` headers and redeploy

---

## Post-Deploy Documentation (Required)

After all checks pass, update these files:

### CHANGELOG.md entry:
```markdown
## YYYY-MM-DD
- Deployed to <staging|production>: <brief description of what's live>
- URL: https://<deployed-url>
```

### WORKING_STATE.md update:
- Update status to `published` or `staging`
- Update deployment URL
- Record validation evidence with timestamp

### memory/project-context.md update:
- Update Live URL and/or Staging URL fields

---

## Rollback Trigger

Initiate rollback if:
- HTTP smoke test returns non-200
- Hero video fails to load on 3 consecutive refreshes
- JavaScript errors break core interaction (enquiry form, navigation)
- Lighthouse performance score drops below 70

Rollback procedure: see `skills/deployment.md` → Rollback section.
