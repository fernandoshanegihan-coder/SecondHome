# Warm editorial redesign progress

Plan: docs/superpowers/plans/2026-10-28-warm-editorial.md

The user approved the design and previously selected native execution. Continue within that authorization. Existing feature branch and source remain in place; no new worktree or framework is needed for this visual update.

Visual thesis: an independent travel journal, ivory paper, walnut ink, burnt-orange accents, original geometric city artwork.
Content plan: full-width masthead and poster; open discovery worksheet; editorial place entries; concise process and final discovery CTA.
Interaction thesis: brief print-like entrance, progressive scroll-rule reveal, tactile hover/focus feedback; reduced-motion fallback.

Pre-flight: all form labels, accessible action names, page state, API payloads, and discovery/replacement props remain stable. Existing browser tests exercise their interfaces.

Task 1: complete. Original geometric streetscape, oversized masthead, and revised editorial section copy replace the former presentation. All discovery state and route payloads remain unchanged.
Task 2: complete. Ivory/walnut/orange responsive stylesheet, worksheet form, horizontal editorial result entries, and reduced-motion-safe effects implemented. Wide desktop and 390-pixel mobile poster/form visually inspected.
Task 3: native tests 18/18 and typecheck pass. Browser checks in progress; final review and publication remain.
Final verification: native suite 18/18, TypeScript check, and browser suite 4/4 pass after the review fixes. Both regression checks were observed failing before their fixes. Live London search and Qloo discoveries inspected in the redesigned mobile and desktop UI. Backend source unchanged. No unaddressed important findings or deferred minors from this redesign.
Delivery: publishing the reviewed source to the existing public Site and GitHub repository; preserve the existing production secret configuration.
Review: reduced-motion discovery scrolling and placeholder contrast reproduced with failing browser checks (smooth instead of auto; contrast 3.74 instead of at least 4.5). Corrected both. Regraded small result qualification text as important for readable decision-making and increased it to 12px. No minor findings deferred.
Review scope rulings: publication/build and independent browser rendering were not judged by the reviewer. The author verifies these through the required build/deploy checks and actual desktop/mobile/live-results inspection; no additional functionality is assumed verified by the source review.
