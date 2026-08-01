# Project Context — Live Knowledge Base
<!-- layer: memory | updated: 2026-08-01 -->

## Identity

- **Project**: CK Personal Portfolio & Brand Hub
- **Owner**: CK (yck30)
- **Goal**: A zero-cost personal branding site consolidating CK's tech/startup journey for recruiters, clients, and followers
- **Live URL**: TBD (Vercel deployment pending)
- **Staging URL**: TBD

---

## Current Phase

**Phase 1 — Foundation & Core Pages** (Active)

### Sprint Status
- [x] Hero prototype (Aurel liquid hero) — completed 2026-07-17
- [x] Docker/nginx deployment configuration — completed 2026-07-18
- [x] GitHub repository connected — completed 2026-08-01
- [x] 5-layer agent infrastructure — completed 2026-08-01
- [ ] Migrate to Next.js App Router (PRD tech stack)
- [ ] About section
- [ ] Projects showcase
- [ ] Social links (5 platforms)
- [ ] Blog/writing section (MDX)
- [ ] Contact/inquiry form (Formspree)

---

## Tech Stack (Current State)

| Component | Current | Target (PRD) |
|---|---|---|
| Framework | React + Vite | Next.js 14 App Router |
| Language | TypeScript | TypeScript |
| Animation | GSAP | GSAP |
| Package Manager | pnpm | pnpm |
| Styling | Vanilla CSS | Vanilla CSS / CSS Modules |
| Container | Docker + nginx | Docker + nginx |
| Deployment | Dokploy | Vercel (free) |

> ⚠️ **Migration needed**: Current codebase is Vite-based. PRD specifies Next.js App Router. This migration is a Phase 1 task.

---

## Key People & Entities

| Entity | Role |
|---|---|
| CK / yck30 | Owner, developer, content creator |
| KitaBuild | One of CK's key projects to showcase |
| BIKIN INGAT | One of CK's key projects to showcase |

---

## Social Platforms to Link (Phase 1)

- GitHub: https://github.com/yck30
- LinkedIn: TBD
- Twitter/X: TBD
- Instagram: TBD
- (5th platform): TBD

---

## Active Constraints

- **Zero cost**: No paid services in Phase 1
- **Solo operator**: CK is the only human contributor
- **No backend in Phase 1**: Static site only; Supabase deferred to Phase 2
- **Formspree free tier**: Max 50 submissions/month

---

## Environment Variables Required

```bash
# .env.example — copy to .env and fill values
VITE_GA4_MEASUREMENT_ID=      # Google Analytics 4 (Phase 2)
VITE_FORMSPREE_ID=             # Formspree form ID (Phase 2)
```

---

## Locked Design Decisions

- **Cinematic Liquid Editorial** aesthetic — film-still quality, restrained interface layer
- Native MP4 background video (`aurel-water.mp4`) — no JavaScript video libraries
- GSAP progressive enhancement — reduced-motion fallback required
- One-viewport hero composition — no scroll hijacking
- Anti-patterns: no blobs, colorful gradients, generic feature cards, fake metrics
