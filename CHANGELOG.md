# Changelog

## 2026-08-01

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
