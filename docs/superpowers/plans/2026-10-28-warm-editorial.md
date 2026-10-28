# Warm Editorial Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give Second Home the approved warm editorial Mid-Century identity while preserving its working discovery flow.

**Architecture:** Replace presentation and vector art in the existing client page; retain all API and discovery contracts. Use a dedicated CSS system for responsive editorial composition and reduced-motion-safe animation.

**Tech Stack:** Existing React, TypeScript, CSS, Vinext/Sites stack; no new runtime dependencies.

**Spec:** docs/superpowers/specs/2026-10-28-warm-editorial-design.md

## Global Constraints
- Visual redesign only; preserve Qloo contracts, secret handling, request limits, evidence honesty, and existing features.
- Two typefaces maximum; warm ivory, walnut ink, burnt orange accent, olive only in artwork.
- Preserve mobile usability, keyboard navigation, focus states, and input readiness safeguards.
- Public Site and GitHub repository remain the delivery targets already authorized.

## Review Focus
- Large editorial type must fit narrow viewports without horizontal overflow (existing mobile browser check and visual inspection).
- Decorative artwork must not obstruct the primary action or inputs (desktop/mobile inspection).
- Text contrast, real place images, unknown-data notes, and feedback controls must stay readable (results inspection).
- Reduced-motion users must receive visible content without entrances or scroll animation (CSS inspection and emulated browser check).
- Existing name resolution, discovery, and failed replacement preservation must survive markup changes (existing browser suite).

### Task 1: Replace the visual composition
**Files:** app/page.tsx; add components/city-poster.tsx; public/second-home.svg; app/layout.tsx.
**Interfaces:** CityPoster(): React.JSX.Element. Retain Home state, route calls, input labels, button accessible names, and discovery/replacement props.
- [ ] Extract bold geometric city artwork into CityPoster, decorative and hidden from assistive technology.
- [ ] Replace the header/hero with a large Second Home masthead, concise promise, full-width poster plane, and one discovery CTA.
- [ ] Remove redundant marketing devices and use editorial numbered sections for the form, result entries, and how-it-works content.
- [ ] Update favicon and metadata to match the approved palette.

### Task 2: Apply the responsive editorial system
**Files:** app/globals.css; presentation classes in app/page.tsx.
**Interfaces:** Existing semantic form elements and controls retain behavior; CSS owns visual layout and motion.
- [ ] Replace existing CSS with ivory/walnut/orange tokens, editorial serif/sans typography, fine rules, generous whitespace, and tactile controls.
- [ ] Use an open worksheet layout rather than a rounded floating panel; editorial result entries remain readable with or without a photograph.
- [ ] Add a brief entrance sequence, progressive scroll reveal with a visible-content fallback, and restrained hover feedback. Disable nonessential motion under prefers-reduced-motion.
- [ ] Keep mobile fields and touch targets usable; avoid tiny supporting text and clipped page content.

### Task 3: Verify and deliver
**Files:** existing tests; docs/redesign-progress.md.
- [ ] Run npm test and npm run typecheck; expect 18 passing native checks and zero type errors.
- [ ] Run existing browser suite; expect all three user-flow/mobile/stale-response checks to pass. No new implementation-mirroring visual tests for this styling change.
- [ ] Inspect desktop, mobile, results, and reduced-motion views; correct observed layout defects.
- [ ] Obtain an independent review of the final changes and address material findings.
- [ ] Build with the Sites helper, scan client output for secret leakage, sync verified source to Sites and GitHub, and deploy to the existing public Site.
- [ ] Verify the deployed redesign and report its URL and any limitations.

## Execution
Continue with the user's previously selected native execution method. The approved design authorizes this presentation update and publication; no new feature or service decision is introduced.
