# Security Posture Log
<!-- layer: memory | updated: 2026-08-01 -->

## Current Posture: 🟡 ESTABLISHING

---

## Last Audit

| Check | Last Run | Result |
|---|---|---|
| `npm audit` | 2026-08-01 | Pending first run |
| `gitleaks` secret scan | 2026-08-01 | Pending first run |
| OWASP Top-10 checklist | 2026-08-01 | Pending first assessment |
| Dependency CVE review | 2026-08-01 | Pending first run |
| CSP headers check | — | Not yet deployed |
| HTTPS enforcement | — | Not yet deployed |

---

## Open Issues

*None logged yet — run security-agent to populate.*

---

## Resolved Issues

*None yet.*

---

## Security Controls In Place

### Repository
- [x] `.gitignore` excludes `node_modules/`, `dist/`, `*.log`
- [ ] `.env` files excluded from git (verify with `gitleaks`)
- [ ] Branch protection on `main` (enable in GitHub Settings)
- [ ] No direct push to `main` (enforce via branch protection)

### Code
- [ ] No hardcoded secrets (verify with `gitleaks`)
- [ ] `npm audit --audit-level=high` passing
- [ ] No `eval()` or `new Function()` usage
- [ ] Input sanitisation on all form fields (Phase 2 — Formspree handles)

### Infrastructure
- [ ] HTTPS enforced (Vercel provides automatically)
- [ ] CSP headers configured (add via `next.config.js` headers)
- [ ] Rate limiting on contact form (Formspree free tier: 50/month)
- [ ] No exposed environment variables in client bundle

### Compliance Notes
- **PDPA/GDPR**: Contact form collects name + email only; no data stored server-side (Formspree handles); privacy policy needed before Phase 2 launch
- **Scope**: Personal portfolio site; no financial data, no authentication in Phase 1

---

## Security Protocols Referenced

- `artifacts/260718-Cybersecurity_Protocol.pdf`
- `artifacts/260718-Universal_Project_Security_Protocol.pdf`
- `artifacts/260719-Supplementary_Modern_Cybersecurity_Development_Whitepaper.pdf`

> Note: Enterprise-tier controls from the Supplementary Whitepaper are explicitly excluded for this solo/startup project per the Universal IT Project Development Protocol.
