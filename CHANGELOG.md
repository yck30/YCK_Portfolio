# Changelog

## 2026-08-11 (Phase 3 CMS Expansion — Full Content Control)

- **Full CMS Expansion**: Extended Supabase database and Admin Dashboard (`/admin`) to support complete content management across all key site sections: About, Journey, KitaBuild LLP Pipeline, Credentials, and Footer/Social links.
- **Supabase Schema Expansion**: Created `supabase/schema_expansion.sql` containing table definitions, RLS security policies, and seed data for `about_content`, `journey_entries`, `kitabuild_pipeline`, `credentials`, and `footer_links`.
- **Expanded Admin Dashboard**: Upgraded `<AdminDashboardClient />` with 7 content tabs and `<AdminFormModal />` to handle CRUD operations for all entities, supporting freeform categories for Credentials and custom CTAs/statuses for KitaBuild.
- **Graceful Server Fallbacks**: Converted `About.tsx`, `Journey.tsx`, `KitaBuildPipeline.tsx`, `credentials/page.tsx`, and `Footer.tsx` to fetch from Supabase with zero-downtime fallback to local static JSON arrays.

## 2026-08-11 (Blog Post Photos & Media Management)

- **Blog Post Photo Upload**: Added photo upload capability for blog posts in Admin Dashboard (`/admin`), saving uploaded photos to Supabase Storage (`portfolio-images`) and `blog_posts.images`.
- **Blog Detail Page**: Built dynamic route `/blog/[slug]` to render blog post details and display photos exclusively on individual blog post detail pages.
- **Reusable ImageManager Component**: Created `<ImageManager />` with multi-image upload, crop alignment (`Center`, `Top`, `Bottom`), and storage-backed photo deletion (`🗑 Delete`). Standardized across Key Projects, Blog Posts, and future Phase 3 CMS Expansion modules.
- **Project Image Cropping Fix**: Added Fit Mode (`Contain` / Full Original vs `Cover` / Fill) and vertical alignment options (`Top 15%`, `Upper-Center 25%`, `Center`, `Bottom Focus 85%`) to `<ImageManager />`, `ProjectImageSlider.tsx`, and project/blog detail pages. Updated database records for YCK Valcore & O.D.I.N so their full uncropped images display cleanly.
- **Footer Cursor Spotlight Glow**: Enhanced cursor spotlight glow effect opacity (`rgba(147, 51, 234, 0.24)`) and radial spread (`700px`) for high ambient visibility in Light Mode.
- **Theme Access Across Admin Pages**: Added `<ThemeToggle />` to Admin Dashboard (`/admin`) and Admin Login (`/admin/login`) for seamless Dark/Light theme switching.
- **Light Mode UI/UX Audit & Contrast Fixes**: Updated Admin modal input colors (`var(--color-paper)` and `var(--color-glass)`), fixed `.view-all:hover` text visibility in light mode, and elevated frosted glass card contrast.

## 2026-08-06 (Phase 2 Auth & CMS - Supabase)

- **Supabase Integration**: Set up Supabase PostgreSQL database for managing Projects and Blog Posts.
- **Server Components**: Migrated Next.js components to fetch dynamic content directly from Supabase via `createServerClient`.
- **Admin Dashboard**: Created an authenticated `/admin` portal with login functionality to manage CMS data without code commits.
- **Dynamic Caching**: Disabled Next.js static caching for dynamic pages to ensure the CMS content serves fresh updates immediately.

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
