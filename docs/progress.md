# SDD ledger — plan: ../docs/superpowers/plans/2026-10-27-second-home.md

Ruling: New app uses a dedicated second-home directory on feat/second-home; no prior Git checkout exists, so a linked worktree is inapplicable. Cost if wrong: files can be moved before integration.
Ruling: Use Sites' Vinext starter with Next-compatible routes rather than a separate Next runtime. Cost if wrong: hosting adapter migration; domain logic remains portable.
Pre-flight: Task 2 resolution -> Task 3 discovery -> Task 4 UI use the same normalized entities and discovery contracts. Task 5 consumes the complete app.
Task 1: official Qloo documentation reviewed; live validation awaits locally saved key.
Task 1: complete — key works; live London and New York name-query responses for two distinct taste profiles recorded. Selected-locality adapter validation remains.
Task 2: complete — node --test tests/qloo.test.mjs, 5/5 pass after observed missing-adapter failure.
Task 3: complete — node --test tests/*.test.mjs, 14/14 pass before final review fixes.
Ruling: Native Node test runner replaces Vitest; no extra test dependency needed. Cost if wrong: migrate tests later.
Ruling: Bounded deterministic recommendation agent replaces optional model orchestration. User supplied a Qloo key only; the hackathon accepts an agentic tool. Cost if wrong: add model orchestration to existing tools.
Ruling: File paths follow the supplied starter's app/ and lib/ rather than src/. Cost if wrong: directory migration.
Final review: three important feedback findings reproduced with failing tests; fixes rank unknown coordinates last, conservatively reject negative quiet evidence, and disclose unknown original prices.
Setup: stock dependency helper fails because inherited npm allow-scripts setting is incompatible with project installs. Use a process-local empty setting with ignore-scripts; inspect required native dependencies before enabling their build hooks.
Task 4: complete — two Playwright desktop/mobile checks pass. Browser startup exposed a pre-hydration input race; disabling text inputs until hydration fixed the observed failure. Live browser resolution, discovery, and replacement passed against Qloo.
Final: fixed distance ranking, negated quiet evidence, and unknown original price comparison — three regression tests observed RED then GREEN; full suite 18/18.
Task 5: live backend and browser integration verified; production build and TypeScript checks pass. Client bundle scan found zero key matches. Public Site and MIT-licensed GitHub source published. Final anonymous API verification and final source sync follow.
Task 5: anonymous production discovery verified HTTP 200 with three live Qloo results. Devpost submission itself is not authorized and has not been performed.
Final verification: 18/18 native tests and 3/3 browser tests pass, including stale-response protection, replacement failure preservation, and mobile overflow. TypeScript check passes. No unaddressed important review findings remain.
Final: minor (deferred): distributed quota enforcement remains a hosting/provider configuration concern; current per-worker limits do not constitute a global spending cap.
