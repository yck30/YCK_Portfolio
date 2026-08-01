# Security Policy — CK Personal Portfolio

> This document describes the security posture, vulnerability reporting process, and security controls for the CK Personal Portfolio project.
> Updated: 2026-08-01

---

## Scope

This security policy applies to:
- The codebase at https://github.com/yck30/YCK_Portfolio
- The production site (Vercel deployment)
- The staging environment (Dokploy deployment)

**Out of scope**:
- Social media accounts linked from the portfolio
- Third-party services (Formspree, GA4, Buttondown) — report to respective vendors

---

## Reporting a Vulnerability

If you discover a security vulnerability in this project:

1. **Do NOT open a public GitHub issue** — this could expose the vulnerability
2. **Contact CK directly** via:
   - Email: (CK's contact — see live site)
   - GitHub: @yck30 (private message or security advisory)
3. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (optional but appreciated)
4. **Response time**: I aim to respond within 72 hours

---

## Security Controls

### Repository
| Control | Status |
|---|---|
| `.gitignore` excludes secrets | ✅ Active |
| Branch protection on `main` | 🔧 Configure in GitHub Settings |
| No direct push to `main` | 🔧 Enforce via branch protection |
| Secret scanning (gitleaks) | 🔧 Setup pending |

### Application
| Control | Status |
|---|---|
| No hardcoded secrets | ✅ Enforced by constitution |
| HTTPS enforced | ✅ Vercel provides automatically |
| Security headers | 🔧 Configure in next.config.js |
| Input sanitisation (contact form) | ✅ Formspree handles |
| No eval() / new Function() | ✅ Enforced by code review |
| CSP configured | 🔧 Phase 1 task |

### Dependencies
| Control | Status |
|---|---|
| `npm audit` on every deploy | ✅ Enforced by pre-deploy hook |
| Dependency updates tracked | 🔧 Manual process |
| No abandoned packages | ✅ Checked on install |

---

## Security Protocols Referenced

This project follows the controls appropriate for a **Solo/Startup** tier as defined in:

- `artifacts/260718-Cybersecurity_Protocol.pdf`
- `artifacts/260718-Universal_Project_Security_Protocol.pdf`

> Note: Enterprise-tier controls (SOC2, SIEM, formal incident response) from the Supplementary Whitepaper are explicitly excluded — this is a personal portfolio, not a commercial product.

---

## Data Handling

**Phase 1 (current)**:
- No user accounts, no authentication
- Contact form data goes directly to Formspree (not stored in this codebase)
- No database

**Phase 2 (planned)**:
- Newsletter email collection via Buttondown (opt-in only)
- Analytics via GA4 (anonymized IP)
- Privacy policy will be published before Phase 2 launch

---

## Security Audit Schedule

| Activity | Frequency |
|---|---|
| `npm audit` | Every deploy |
| Secret scan (gitleaks) | Every deploy |
| OWASP checklist review | Monthly during active development |
| Dependency update sweep | Monthly |
| Full security posture review | Before each major release |

Current posture: see `.agent/memory/security-posture.md`

---

## Incident Response

For a personal portfolio, the incident response is simple:

1. **Identify**: Detect the issue (via monitoring, report, or personal discovery)
2. **Contain**: Take down the affected deployment if necessary
3. **Eradicate**: Fix the vulnerability in code
4. **Rotate**: Rotate any compromised credentials immediately
5. **Recover**: Redeploy the fixed version
6. **Document**: Record in `.agent/memory/security-posture.md`

---

*Maintained by CK (yck30) · Governed by AIM Whitepaper v1.0 & Universal Project Security Protocol*
