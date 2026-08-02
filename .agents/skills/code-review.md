# Skill: Code Review
<!-- layer: skills | version: 1.0 | updated: 2026-08-01 -->

## Trigger

Use this playbook when reviewing any diff before it merges to `main`.

---

## Review Checklist

### 1. Security (Blocker — must all pass)
- [ ] No hardcoded secrets, API keys, or tokens
- [ ] No `eval()`, `new Function()`, or `dangerouslySetInnerHTML` without sanitization
- [ ] No external URLs fetched and executed as code
- [ ] `npm audit --audit-level=high` passes on the branch
- [ ] No new dependencies added without justification in the PR description

### 2. PRD Alignment (Blocker)
- [ ] Feature matches the PRD specification — no scope creep
- [ ] No features from the Icebox implemented without CK approval
- [ ] No UI/UX changes that contradict the locked design direction

### 3. TypeScript Quality (Blocker)
- [ ] `tsc --noEmit` passes with 0 errors
- [ ] No `any` types introduced (use `unknown` + narrowing)
- [ ] All new functions have explicit return types
- [ ] Interfaces used for object shapes (not inline types for complex shapes)

### 4. Code Quality (Major)
- [ ] No duplicate logic — DRY applied appropriately
- [ ] Functions are single-purpose and under 50 lines where possible
- [ ] No commented-out code blocks left in (use git history instead)
- [ ] Meaningful variable/function names (no `temp`, `data2`, `foo`)
- [ ] No `console.log` statements in production code

### 5. Accessibility (Major)
- [ ] All images have `alt` text (descriptive, not "image of...")
- [ ] Interactive elements are keyboard-navigable
- [ ] Color contrast meets WCAG AA (4.5:1 for normal text)
- [ ] No axe-core critical violations
- [ ] `prefers-reduced-motion` respected for all animations

### 6. Performance (Minor)
- [ ] Images are next/image or have width/height set (no CLS)
- [ ] No blocking synchronous operations in render path
- [ ] Heavy components lazy-loaded where appropriate
- [ ] No unnecessary re-renders (memoization where justified)

### 7. Documentation (Minor)
- [ ] `CHANGELOG.md` updated
- [ ] `BACKLOG.md` task marked `[x]`
- [ ] Complex logic has inline comments
- [ ] Any new environment variables added to `.env.example`

---

## Review Output Format

When reporting a code review, use this structure:

```markdown
## Code Review — <branch-name>

**Reviewer**: <agent-name>
**Date**: <date>
**Status**: ✅ APPROVED / ⚠️ APPROVED WITH NOTES / ❌ CHANGES REQUIRED

### Blockers
- (list any blocking issues, or "None")

### Major Issues
- (list major issues, or "None")

### Minor / Suggestions
- (list minor notes, or "None")

### Summary
<1-2 sentence summary of the diff quality and recommendation>
```
