# Architecture Decision Records (ADRs)
<!-- layer: memory | updated: 2026-08-01 -->

---

## ADR-001: React + Vite as Initial Prototype Stack

- **Date**: 2026-07-17
- **Status**: Superseded by ADR-002
- **Context**: Needed a fast prototyping environment for the hero animation
- **Decision**: Used React + Vite + GSAP for the Aurel liquid hero prototype
- **Consequence**: Working hero prototype delivered; migration to Next.js required for full PRD compliance

---

## ADR-002: Next.js 14 App Router as Production Framework

- **Date**: 2026-08-01
- **Status**: Accepted
- **Context**: PRD v1.0 specifies Next.js App Router for SSR, SEO, and routing capabilities needed for blog and multi-page portfolio
- **Decision**: Migrate from Vite to Next.js 14 App Router
- **Consequence**: Hero GSAP animations must be wrapped in client components (`'use client'`); existing Vite config archived

---

## ADR-003: pnpm as Package Manager

- **Date**: 2026-07-17
- **Status**: Accepted (Locked)
- **Context**: Faster installs, strict dependency resolution, better monorepo support
- **Decision**: pnpm pinned at `10.33.2` via `packageManager` field in `package.json`
- **Consequence**: All agents must use `pnpm` commands; `npm`/`yarn` commands are rejected

---

## ADR-004: Vanilla CSS / CSS Modules (No Tailwind)

- **Date**: 2026-08-01
- **Status**: Accepted (Locked)
- **Context**: PRD specifies Vanilla CSS for maximum flexibility and control; Cinematic Liquid Editorial aesthetic requires precise CSS control
- **Decision**: No Tailwind CSS; use CSS custom properties for design tokens
- **Consequence**: More verbose CSS; greater design precision and no purge/JIT complexity

---

## ADR-005: Formspree for Contact Form (Phase 2)

- **Date**: 2026-08-01
- **Status**: Deferred to Phase 2
- **Context**: Zero-cost constraint; no backend in Phase 1
- **Decision**: Formspree free tier (50 submissions/month) for contact form
- **Consequence**: Form submissions limited; upgrade path to paid if volume increases

---

## ADR-006: MDX / JSON for Blog Content

- **Date**: 2026-08-01
- **Status**: Accepted
- **Context**: No CMS budget; CK will write content in Markdown
- **Decision**: MDX files in `src/content/posts/` for blog; JSON files for project data
- **Consequence**: Content updates require a git commit; no visual editor

---

## ADR-007: Docker Multi-Stage + nginx for Containerisation

- **Date**: 2026-07-18
- **Status**: Accepted (Locked)
- **Context**: Dokploy deployment requires Docker; multi-stage build reduces image size
- **Decision**: Multi-stage Dockerfile (Node build → nginx serve); existing `Dockerfile` retained
- **Consequence**: Build artifacts never shipped in production image; nginx handles static serving

---

## ADR-008: Vercel Free Tier as Primary Deployment Target

- **Date**: 2026-08-01
- **Status**: Accepted
- **Context**: PRD specifies zero-cost; Vercel free tier has generous limits for Next.js
- **Decision**: Vercel as primary; Dokploy as fallback/staging
- **Consequence**: Vercel's 100GB bandwidth/month limit applies; no server-side functions beyond Next.js API routes

---

## ADR-009: 5-Layer Agent Infrastructure

- **Date**: 2026-08-01
- **Status**: Accepted
- **Context**: AIM Whitepaper defines a 5-layer governance model for AI-assisted solo projects
- **Decision**: Implement all 5 layers (Constitution, Skills, Hooks, Subagents, Memory) under `.agent/`
- **Consequence**: All AI agent actions are governed by the constitution; no autonomous production deploys
