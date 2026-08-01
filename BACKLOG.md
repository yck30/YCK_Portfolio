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
- [ ] Migrate from Vite to Next.js 14 App Router
- [ ] Setup CSS design token system (custom properties)
- [ ] Configure `next.config.js` with security headers
- [ ] Create `.env.example` with all required variables
- [ ] Setup Vercel deployment

### Core Pages & Sections
- [x] Hero section — Cinematic Liquid Editorial, GSAP choreography, MP4 background
- [ ] Navigation — responsive, mobile hamburger, keyboard accessible
- [ ] About section — CK's story, background, and what CK builds
- [ ] Projects showcase — grid/list of key projects (KitaBuild, BIKIN INGAT, others)
- [ ] Blog/writing section — listing page + individual post page (MDX)
- [ ] Contact/inquiry form — Formspree integration, success/error states

### Content & Data
- [ ] Create `src/data/projects.json` with all showcase projects
- [ ] Create `src/data/social.json` with 5 platform links
- [ ] Create `src/data/about.json` with profile content
- [ ] Write first 1–2 blog posts (MDX)
- [ ] Add project screenshots/thumbnails to `public/assets/`

### Social Links (5 Platforms)
- [ ] GitHub: https://github.com/yck30
- [ ] LinkedIn: (URL from CK)
- [ ] Twitter/X: (URL from CK)
- [ ] Instagram: (URL from CK)
- [ ] (5th platform — confirm with CK)

### Quality & Launch
- [ ] Lighthouse mobile score ≥ 85
- [ ] axe-core: 0 critical violations
- [ ] All Playwright E2E tests passing (desktop + mobile + reduced-motion)
- [ ] `npm audit --audit-level=high` passes
- [ ] Security headers configured
- [ ] Phase 1 production deploy to Vercel

---

## 🟡 Phase 2 — Should Have (Post-Phase 1)

### Analytics & Growth
- [ ] Google Analytics 4 integration
- [ ] Buttondown newsletter signup integration
- [ ] Privacy policy page (required before GA4 + newsletter)

### Enhanced Features
- [ ] Blog post search / filter by tag
- [ ] Dark/light mode toggle
- [ ] Project detail pages (individual project deep-dives)
- [ ] Reading progress indicator on blog posts
- [ ] Estimated read time on blog cards

### Auth & CMS (Supabase)
- [ ] Supabase project setup
- [ ] Admin panel for content management (no more git-only content updates)

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
