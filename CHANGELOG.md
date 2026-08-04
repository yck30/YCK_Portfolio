# Changelog

## 2026-08-05 (Phase 2 Integrations & Vercel Deploy)

- **Vercel Deployment**: Officially deployed the production build to Vercel (`https://yck-portfolio.vercel.app/`).
- **Buttondown Integration**: Built a secure Server Action to subscribe users to the newsletter via Buttondown's API. Added a `<Newsletter />` component to the bottom of the blog index page.
- **Google Analytics 4**: Integrated GA4 tracking across the Next.js App Router using `@next/third-parties/google`.
- **Privacy Policy**: Added a Privacy Policy page outlining tracking, Formspree data collection, and newsletter subscription terms.

## 2026-08-04 (Credentials & UI Polish)

- **Credentials Page**: Created a dedicated page detailing academic background, certifications, and technical qualifications.
- **Glassmorphism UI**: Designed an immersive pipeline grid using frosted glass layouts (`backdrop-filter`) for premium readability.
- **Dynamic Background**: Integrated a hardware-accelerated scattered background composition using CSS Lissajous curves to animate 24 digital badges and key achievement portraits without JavaScript overhead.
- **Footer Fix**: Upgraded the global Footer to an opaque background to properly block fixed layouts and act as a visual anchor.
- **Blog Update**: Updated the blog description to include "entrepreneurship".

## 2026-08-01 (CI/CD Governance)

- Created `.github/workflows/ci.yml` — GitHub Actions CI gate (lint → typecheck → build → npm audit).
- Created `.github/workflows/security.yml` — Gitleaks secret scan + dependency audit + OWASP static check (on push/PR/weekly cron).
- Created `.github/PULL_REQUEST_TEMPLATE.md` — Structured PR checklist enforcing Definition of Done.
- Created `.github/CODEOWNERS` — All files require `@yck30` review; enforces RACI matrix.
- Created `.github/dependabot.yml` — Automated weekly dependency update PRs (npm + GitHub Actions).
- Deleted remote `master` branch; `main` is now the sole default branch.

## 2026-08-01 (Foundation)

- Renamed default branch `master` → `main` (GitHub convention).
- Established 5-layer Agentic Infrastructure under `.agent/`:
  - **Layer 1 — Constitution**: Master operating contract, RACI matrix, zero-trust defaults, Okanagan Rule.
  - **Layer 2 — Skills**: 5 playbooks (feature-implementation, code-review, deployment, security-audit, content-update).
  - **Layer 3 — Hooks**: 3 guards (pre-execution, pre-deploy, post-deploy).
  - **Layer 4 — Subagents**: 5 specialist agents (CI, Security/PenTest, UX/QA, DevOps, Content).
  - **Layer 5 — Memory**: project-context, ADR decisions log, security-posture log.
- Created project documentation suite: `README.md`, `BACKLOG.md`, `ARCHITECTURE.md`, `SECURITY.md`.
- Documented MoSCoW backlog aligned to PRD v1.0 Phase 1 requirements.
- Recorded 9 Architecture Decision Records (ADRs) covering full tech stack choices.
- Established security posture log and vulnerability reporting policy.

## 2026-07-18

- Added the Dokploy-ready multi-stage Docker and nginx configuration.
- Pinned the container build to the repository's canonical pnpm 10 toolchain.
- Documented the `main` branch and staging deployment target.
- Added reproducible HorizonX gallery capture and media packaging scripts.
- Published the hero as a premium featured Code / Hero product on HorizonX.

## 2026-07-17

- Built the responsive Aurel liquid hero prototype with GSAP choreography.
- Added the supplied hero video, derived poster fallback, mobile navigation, and enquiry interaction.
