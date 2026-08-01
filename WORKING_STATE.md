# Website Working State
<!-- website-delivery-state -->

- task_id: `aurel-liquid-hero-20260717`
- owner: `Matrix`
- thread_or_session: `discord:channel:1481411151005876337:message:1527874645850722365`
- updated_at: `2026-07-18T00:22:00-04:00`
- repository: `/home/clawd/projects/aurel-liquid-hero`
- branch: `main`
- target_route: `/`
- status: `published`

## Scope

- outcome: `A polished, responsive, temporary public hero prototype using the supplied water-logo video.`
- audience: `Prospective clients of a premium independent creative studio.`
- conversion_goal: `Submit a project enquiry.`
- in_scope: `Single full-viewport hero, responsive navigation, editorial copy, enquiry form, GSAP entrance choreography, reduced-motion fallback.`
- out_of_scope: `Backend form delivery, additional pages, analytics, client production deployment.`

## Locked Direction

- primary_style_pack_or_thesis: `Cinematic Liquid Editorial — a film still with a restrained interface layer.`
- evidence_sources: `Supplied 2560x1440 MP4 and supplied 1920x1080 UI reference screenshot.`
- dials: `variance 8, motion 7, density 4, art direction 9, clarity 9, image dependence 10, spacing 7.`
- hero_must_prove: `Aurel creates identities with the force and calm of a physical signal.`
- memorable_spatial_or_motion_idea: `The luminous A symbol stays visually central while copy and enquiry controls enter from opposing edges.`
- anti_patterns: `No blobs, colorful gradients, generic feature cards, fake metrics, busy continuous motion, or scroll hijacking.`

## Experience Structure

1. `Hero — category + visual signal — asymmetric three-zone composition — calm GSAP entrance sequence.`
2. `Contact module — conversion — translucent editorial form — magnetic submit microinteraction and inline success state.`

## Assets

- manifest: `design/asset-manifest.json`
- approved: `hero-video, hero-poster`
- missing_or_blocked: `none`

## Execution

- current_phase: `done`
- completed: `Reference extraction, asset audit, visual direction, responsive implementation, GSAP motion, interaction QA, Dokploy deployment, HorizonX publication.`
- locked_decisions: `Native MP4 background, React/Vite, GSAP progressive enhancement, one-viewport composition.`
- open_decisions: `Final human taste approval by Marcelo.`
- blockers: `none`
- next_exact_action: `No background work remains; collect human editorial feedback on the HorizonX listing.`

## Handoffs

- `none`: `Single-owner implementation.`

## Definition of Done

- [x] Scoped sections and interactions implemented
- [x] Assets approved, mapped, responsive, and have fallbacks
- [x] Desktop/mobile/reduced-motion/media-failure behavior validated
- [x] Accessibility basics validated
- [x] Lint/typecheck/build/tests pass as applicable
- [x] Browser/layout/visual QA passes when applicable
- [x] Final commit/deploy state recorded

## Validation Evidence

- `2026-07-17T23:15:00-04:00 — ffprobe/identify — video 2560x1440 H.264 5.04s; screenshot 1920x1080 PNG — local assets.`
- `2026-07-17T23:29:00-04:00 — pnpm lint + pnpm build — pass — Vite production bundle.`
- `2026-07-17T23:31:00-04:00 — Playwright structured layout — desktop 8/8, mobile 7/7, zero console/page/request errors.`
- `2026-07-17T23:32:00-04:00 — Playwright interaction — video playback, mobile navigation, form submit all pass; /home/clawd/aurel-hero-final.png visually inspected.`
- `2026-07-17T23:34:00-04:00 — public preview — HTTP 200, Aurel identity matched — https://ext-enb-janet-reception.trycloudflare.com.`
- `2026-07-18T00:10:00-04:00 — Dokploy — application done, HTTP 200 — https://aurel-liquid-hero.apps.mdxpreview.xyz.`
- `2026-07-18T00:22:00-04:00 — HorizonX — Product #98, Code / Hero, Premium + Featured, gallery 3 media, code deliverable — https://horizonx.so/explore/aurel-liquid-hero.`

## Remaining Risk

- `The supplied logo is treated as prototype brand material; trademark/ownership clearance and production form delivery remain outside scope.`
