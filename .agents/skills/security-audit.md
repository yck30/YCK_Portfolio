# Skill: Security Audit
<!-- layer: skills | version: 1.0 | updated: 2026-08-01 -->

## Trigger

Use this playbook:
- Before any production deploy
- Weekly during active development
- Immediately if a CVE is reported for a dependency
- Any time `security-agent` is invoked

---

## Step 1 — Dependency Vulnerability Scan

```bash
npm audit --audit-level=moderate
```

**Interpret results:**
| Severity | Action |
|---|---|
| Critical | BLOCK deploy. Patch immediately. Report to CK. |
| High | BLOCK deploy. Patch before next deploy. |
| Moderate | Log in `memory/security-posture.md`. Fix within 1 sprint. |
| Low | Log. Fix when convenient. |

To apply auto-fixes (safe only):
```bash
npm audit fix
```

For breaking changes, update manually:
```bash
pnpm update <package>@latest
```

---

## Step 2 — Secret Scan

```bash
# If gitleaks is installed:
gitleaks detect --source . --no-git --report-format json --report-path gitleaks-report.json

# Manual check for common patterns:
git grep -r "sk-\|AKIA\|password=\|secret=\|api_key=" --exclude-dir=node_modules
```

If any secrets found:
1. **Do NOT push the current state**
2. Remove the secret from the file
3. Rotate the compromised credential immediately
4. Run `git filter-repo` to purge from history if already committed
5. Report to CK

---

## Step 3 — OWASP Top-10 Checklist (Solo/Startup Scope)

| # | Risk | Check |
|---|---|---|
| A01 | Broken Access Control | N/A (Phase 1 — no auth) |
| A02 | Cryptographic Failures | HTTPS enforced? No HTTP links? |
| A03 | Injection | No `eval()`, no `dangerouslySetInnerHTML` unsanitized? |
| A04 | Insecure Design | Contact form has rate limiting (Formspree)? |
| A05 | Security Misconfiguration | CSP headers configured? No debug endpoints? |
| A06 | Vulnerable Components | `npm audit` passing? |
| A07 | Auth Failures | N/A (Phase 1 — no auth) |
| A08 | Data Integrity Failures | No unsigned redirects or external script injection? |
| A09 | Logging Failures | No sensitive data logged? |
| A10 | SSRF | No server-side URL fetching? (Phase 1 — static site) |

---

## Step 4 — Headers Check (Post-Deploy)

```bash
# Check security headers on the live URL
curl -I https://<your-domain>
```

Required headers:
- `Strict-Transport-Security: max-age=31536000; includeSubDomains`
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Content-Security-Policy: <policy>`
- `Referrer-Policy: strict-origin-when-cross-origin`

For Next.js, configure in `next.config.js`:
```js
headers: async () => [{
  source: '/(.*)',
  headers: [
    { key: 'X-Content-Type-Options', value: 'nosniff' },
    { key: 'X-Frame-Options', value: 'DENY' },
    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  ]
}]
```

---

## Step 5 — Report

Update `memory/security-posture.md` with:
- Date of audit
- Results of each step
- Any open issues and their severity
- Resolved issues from previous audit
