## PR Checklist — CK Portfolio

> **AI Agent Note**: If you are an AI agent submitting this PR, read `.agent/constitution.md` and `.agent/skills/code-review.md` before proceeding.

---

### What does this PR do?

<!-- One-sentence summary of the change -->


### Linked Backlog Item

<!-- Which BACKLOG.md item does this address? -->
- [ ] Task: `[ ] <paste task name from BACKLOG.md>`

---

### Pre-Merge Checklist

#### Security (All required)
- [ ] No hardcoded secrets, API keys, or tokens introduced
- [ ] No `eval()` or `dangerouslySetInnerHTML` without sanitization
- [ ] `npm audit --audit-level=high` passes on this branch
- [ ] No new unreviewed dependencies added

#### Code Quality (All required)
- [ ] `pnpm lint` passes (0 errors)
- [ ] `tsc --noEmit` passes (0 type errors)
- [ ] `pnpm build` completes without errors
- [ ] No `any` TypeScript types introduced
- [ ] No `console.log` left in production code

#### Scope & PRD (All required)
- [ ] Change is within PRD Phase 1 scope — no scope creep
- [ ] No Icebox features implemented without CK approval

#### Accessibility (Required for UI changes)
- [ ] All images have descriptive `alt` text
- [ ] Color contrast meets WCAG AA (4.5:1)
- [ ] `prefers-reduced-motion` respected for animations
- [ ] Keyboard navigation works for all new interactive elements

#### Documentation (All required)
- [ ] `CHANGELOG.md` updated
- [ ] `BACKLOG.md` task marked `[x]`
- [ ] `.env.example` updated if new env vars added

---

### Testing Evidence

<!-- What was tested? Paste relevant output or screenshots -->

```
pnpm lint:   PASS / FAIL
tsc:         PASS / FAIL
pnpm build:  PASS / FAIL
npm audit:   PASS / FAIL
```

**Browsers/devices tested**:
- [ ] Desktop (1440px)
- [ ] Mobile (375px)
- [ ] Reduced motion

---

### Notes for CK

<!-- Anything CK should pay attention to during review. Risks, open questions, trade-offs. -->
