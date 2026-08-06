# Feature Backlog — CK Personal Portfolio
<!-- PRD Reference: artifacts/260801-PRD-CK_Personal_Portfolio-v1.0.pdf -->
<!-- MoSCoW prioritisation | Updated: 2026-08-01 -->

---

## How to Use This Backlog

- `[ ]` = Not started
- `[/]` = In progress
- `[x]` = Complete
- Items in **Icebox** are out of scope until CK explicitly moves them up

Agents must not implement Icebox items without CK's written approval.

---

## 🔴 Phase 1 — Must Have (Active Sprint)

### Infrastructure & Foundation
- [x] Initialize git repository
- [x] Connect to GitHub (`yck30/YCK_Portfolio`)
- [x] Setup 5-layer agent infrastructure (`.agent/`)
- [x] Create project documentation (README, BACKLOG, ARCHITECTURE, SECURITY)
- [x] Rename branch `master` → `main`
- [x] Migrate from Vite to Next.js 14 App Router
- [x] Setup CSS design token system (custom properties)
- [x] Configure `next.config.js` with security headers
- [x] Create `.env.example` with all required variables
- [x] Setup Vercel deployment

### Core Pages & Sections
- [x] Hero section — Cinematic Liquid Editorial, GSAP choreography, MP4 background
- [x] Navigation — responsive, mobile hamburger, keyboard accessible
- [x] About section — CK's story, background, and what CK builds
- [x] Projects showcase — grid/list of key projects (KitaBuild, BIKIN INGAT, others)
- [x] Blog/writing section — listing page + individual post page (MDX)
- [x] Credentials page — immersive scattered layout with digital badges
- [x] Contact/inquiry form — Formspree integration, success/error states

### Content & Data
- [x] Create `src/data/projects.json` with all showcase projects
- [x] Create `src/data/social.json` with 5 platform links
- [x] Create `src/data/about.json` with profile content
- [x] Write first 1–2 blog posts (MDX)
- [x] Add project screenshots/thumbnails to `public/assets/`

### Social Links (Implemented in Footer)
- [x] GitHub: https://github.com/yck30
- [x] LinkedIn: https://www.linkedin.com/in/chunkityong
- [x] TikTok: https://www.tiktok.com/@yck96
- [x] Instagram: https://www.instagram.com/ck_yong96/
- [x] Threads: https://www.threads.com/@ck_yong96
- [x] Facebook: https://web.facebook.com/YCK96/

### Quality & Launch
- [x] Lighthouse mobile score ≥ 85 (Optimized via next/image and CSS)
- [x] axe-core: 0 critical violations
- [x] All Playwright E2E tests passing (desktop + mobile + reduced-motion)
- [x] `pnpm audit --audit-level=high` passes (handled via overrides)
- [x] Security headers configured

---

## 🟡 Phase 2 — Should Have (Post-Phase 1)

### Analytics & Growth
- [x] Privacy policy page (required before GA4 + newsletter)
- [x] Google Analytics 4 integration (`.env` configuration)
- [x] Buttondown newsletter signup integration
- [x] Official Production Deploy to Vercel (Combined Phase 1 & 2 features)

### Enhanced Features
- [x] Blog post search / filter by tag
- [x] Dark/light mode toggle
- [x] Project detail pages (individual project deep-dives)
- [x] Reading progress indicator on blog posts
- [x] Estimated read time on blog cards

### Auth & CMS (Supabase)
- [ ] Supabase project setup & Admin panel for content management (no more git-only content updates)

---

## 🟢 Phase 3 — Could Have (Nice to Have)

- [ ] RSS feed for blog
- [ ] Open Graph / Twitter Card meta images (dynamic)
- [ ] Sitemap.xml auto-generation
- [ ] i18n — Bahasa Malaysia / English toggle
- [ ] Portfolio PDF export
- [ ] Testimonials section
- [ ] Speaking / appearances section

---

## 🧊 Icebox (Won't Have — Until CK Decides)

- E-commerce / digital product sales
- Job board or freelance marketplace
- Community forum or comments section
- Mobile app version
- Podcast page

---

## Completed (Archive)

- [x] `2026-07-17` — Aurel liquid hero prototype (React/Vite/GSAP)
- [x] `2026-07-18` — Docker multi-stage + nginx deployment config
- [x] `2026-07-18` — Dokploy deployment and HorizonX publication
- [x] `2026-08-01` — GitHub repository initialized and pushed
- [x] `2026-08-01` — 5-layer agent infrastructure established
- [x] `2026-08-01` — Project documentation suite created
