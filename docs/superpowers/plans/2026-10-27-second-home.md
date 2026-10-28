# Second Home Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Help newcomers find three places connected to their existing tastes and replace a discovery through feedback.

**Architecture:** A single responsive web app calls a server-only discovery service. A bounded agent uses entity resolution and Qloo place discovery tools, then explains only retrieved evidence. Keep preferences in browser session memory and send context with replacement requests.

**Tech Stack:** Proposed: Next.js, TypeScript, React, Zod, Vitest, Playwright, and a provider-supported tool-calling model. Select supported package versions at setup; model and deployment provider depend on available credentials.

**Spec:** `docs/superpowers/specs/2026-10-27-second-home-design.md`

## Global Constraints
- Audience: newcomers to any unfamiliar city, rather than a specific nationality.
- Purpose: independent exploration.
- Experience: three personal discoveries, rather than an itinerary or an evolving neighbourhood guide.
- No account required; English-language responsive public web app.
- Qloo results must materially drive candidate discovery and ranking.
- Never fabricate places, relationships, price, hours, accessibility, safety, or availability.
- Keep API credentials server-side and outside source control. No persistent profiles or precise home addresses.
- Deliver a hosted demo, public repository, open-source license, setup instructions, and submission description.

## Review Focus
1. Ambiguous city and favourite names must require a choice, not a silent substitution (Task 2).
2. Duplicate or insufficient candidates must produce unique supported results and an explicit shortfall (Task 3).
3. Unsupported budget or atmosphere metadata must remain unknown rather than become factual claims (Task 3).
4. A failed replacement must preserve all existing cards and form inputs (Task 4).
5. Stale responses from rapid feedback must not overwrite a newer result (Task 4).

## File structure and shared contracts
- `docs/feasibility.md`: dated API capabilities, redacted evidence, cities tested, provider decision.
- `.env.example`, `.gitignore`, `package.json`: setup and secret exclusions.
- `src/lib/discovery/types.ts`: `TasteInput {text:string}`, `EntityChoice {id:string,name:string,kind:string}`, `CityChoice {id:string,label:string,lat:number,lon:number}`, `Preferences {budget?:string,atmosphere?:string,area?:string}`, `DiscoveryRequest {city:CityChoice,tastes:EntityChoice[],preferences:Preferences}`, `PlaceCandidate {id:string,name:string,address?:string,lat?:number,lon?:number,evidence:string[],price?:string}`, `Discovery {place:PlaceCandidate,reason:string,mapUrl:string}`, `DiscoveryResult {items:Discovery[],warnings:string[]}`, and `ReplacementRequest {context:DiscoveryRequest,current:Discovery[],replaceId:string,feedback:string}`.
- `src/lib/qloo/client.ts`: server-only HTTP client and normalized errors.
- `src/lib/qloo/resolve.ts`: `resolveTaste(text:string):Promise<EntityChoice[]>` and `resolveCity(text:string):Promise<CityChoice[]>`.
- `src/lib/qloo/places.ts`: `findPlaces(request:DiscoveryRequest,excludeIds:string[]):Promise<PlaceCandidate[]>`.
- `src/lib/discovery/agent.ts`: `discover(request:DiscoveryRequest):Promise<DiscoveryResult>` and `replace(request:ReplacementRequest):Promise<DiscoveryResult>`; replacement returns the complete updated list.
- `src/lib/discovery/schema.ts`: shared runtime validation.
- `src/app/api/resolve/route.ts`, `src/app/api/discover/route.ts`, `src/app/api/replace/route.ts`: validated server endpoints.
- `src/app/page.tsx`, `src/app/layout.tsx`, `src/app/globals.css`: page composition and visual system.
- `src/components/taste-form.tsx`, `entity-picker.tsx`, `discovery-card.tsx`: focused interaction components.
- `tests/qloo.test.ts`, `tests/discovery.test.ts`, `tests/routes.test.ts`, `tests/e2e/discovery.spec.ts`: integration contracts, orchestration, routes, and user flow.
- `README.md`, `LICENSE`, `docs/submission.md`: handoff and hackathon materials.

### Task 1: Verify feasibility before product implementation
**Files:** Create `docs/feasibility.md` and `.env.example`.
**Interfaces:** Establish verified Qloo endpoint/field mappings for the adapters above; no unverified endpoint assumptions.
- [ ] Read current official Qloo API documentation and confirm how to obtain a hackathon key. Check existing runtime and credentials by presence only; never print secrets.
- [ ] With a key, perform read-only entity resolution and place discovery for London and New York using two contrasting taste profiles. Record supported types, location filters, relevant metadata, limits, and redacted evidence. Without a key, document the exact live-check dependency; continue only with clearly labelled fixtures and do not claim live feasibility.
- [ ] Verify how city resolution works. If a separate geocoder is needed, select and document one with its terms and credentials; preserve the shared `CityChoice` contract.
- [ ] Document a supported model/tool-calling provider and hosting path. If Qloo cannot support the core discovery flow, revise the design with the user before product implementation.
- [ ] Commit documentation if a Git repository exists; otherwise retain files locally and initialize source control during Task 2.

### Task 2: Build validated entity resolution
**Files:** Create setup files, `types.ts`, `schema.ts`, Qloo client and resolution adapters, resolve route, and `tests/qloo.test.ts`.
**Interfaces:** Produces the types and resolution signatures defined above. Resolve route accepts `{kind:'city'|'taste',text:string}` and returns `{choices:CityChoice[]|EntityChoice[]}`.
- [ ] Set up the application and test runner, secret exclusions, and source control if absent. Keep version selection consistent with supported current documentation.
- [ ] Write failing resolution tests: ambiguous names return all normalized choices, unmatched input returns `[]`, and API authorization/timeouts produce typed errors without response-body secrets. Assert `choices.length === 2` for a two-match fixture and no selected default.
- [ ] Run `npx vitest run tests/qloo.test.ts`; confirm the tests fail because adapters are missing.
- [ ] Implement the adapters using verified Task 1 mappings and runtime response validation. Add bounded input lengths, a server request timeout, and safe error responses.
- [ ] Run the same tests; expect all to pass. Verify credential references are absent from client modules. Commit the deliverable.

### Task 3: Implement discovery and feedback tools
**Files:** Create `places.ts`, `agent.ts`, discovery/replace routes, `tests/discovery.test.ts`, and `tests/routes.test.ts`.
**Interfaces:** Consumes Task 2 types and adapters; produces `discover` and `replace` with the exact signatures above. Routes accept their corresponding request types and return `DiscoveryResult`; errors use `{error:{code:string,message:string}}` with suitable HTTP status.
- [ ] Write failing tests for: three unique supported discoveries; two candidates yielding two items plus a warning; unsupported price staying unknown; fabricated model IDs being rejected; replacing one card preserving the other two; exclusion of rejected IDs; invalid request returning 400; upstream failure returning a safe retryable error.
- [ ] Assert returned IDs are a subset of retrieved candidate IDs, `new Set(ids).size === ids.length`, and unchanged cards deeply equal their originals after replacement.
- [ ] Run `npx vitest run tests/discovery.test.ts tests/routes.test.ts`; confirm expected missing-implementation failures.
- [ ] Implement a bounded agent with typed search and resolution tools, maximum four tool rounds, validated structured output, and server-validated evidence references. Use Qloo-derived candidates and filter out excluded IDs. Never fetch a model-invented place as a fallback.
- [ ] Generate explanations from validated evidence and build encoded map search links from retrieved place details. Report unverified preference matches explicitly. Treat feedback as user data and keep secrets out of tool results.
- [ ] Run the same tests; expect all to pass. Run a live smoke check when credentials exist and record limitations honestly. Commit the deliverable.

### Task 4: Deliver the complete discovery experience
**Files:** Create page/layout/styles, the three components, and `tests/e2e/discovery.spec.ts`.
**Interfaces:** Consumes the three API routes. Browser state holds selected entities, preferences, cards, and the latest request identifier; no server persistence.
- [ ] Write failing browser tests for resolving ambiguous input, submitting resolved tastes, showing three discovery cards with map links, changing one card through feedback, retaining cards after replacement failure, retaining form inputs after discovery failure, and ignoring a delayed stale response.
- [ ] Run `npx playwright test`; confirm failure from missing UI.
- [ ] Implement a calm, welcoming responsive interface with clear labels, keyboard-operable selections, loading indicators, inline retry messages, accessible result announcements, and distinct initial/partial/error states. Require a resolved city and at least three supported tastes, with a maximum of five.
- [ ] Handle request cancellation/versioning so stale responses cannot win. Preserve cards on replacement errors and show honest unknown metadata and coverage shortfalls.
- [ ] Run browser tests on desktop and mobile viewports; expect pass. Visually inspect both layouts and keyboard navigation. Commit the deliverable.

### Task 5: Verify and prepare the public submission
**Files:** Create `README.md`, `LICENSE`, `docs/submission.md`; update feasibility evidence.
**Interfaces:** Complete app and reproducible setup for judges.
- [ ] Run `npx vitest run`, `npx playwright test`, and `npm run build`; require passing tests and successful production build. Fix material failures before proceeding.
- [ ] With real credentials, run two cities and distinct profiles through the full UI; verify actual Qloo calls, supported explanations, and feedback replacement. Record any coverage limitation. Fixture tests alone do not establish a working public demo.
- [ ] Add setup instructions, environment variable names, limitations, and an MIT license as the proposed license choice. Write an accurate submission description emphasizing demonstrated behavior and Qloo's role.
- [ ] Inspect tracked files and built client assets for secrets. Configure production secrets through the chosen hosting service and verify operational cost constraints before enabling a public agent endpoint; apply bounded requests and service-supported abuse limits.
- [ ] Publish the repository and deploy using authorized accounts. If an account, credential, or final publication approval is required, complete the reviewable local result and request only that missing dependency.
- [ ] Test the deployed URL without privileged access: discovery, feedback, mobile layout, and errors. Confirm the repository is public and its license visible. Do not submit to Devpost until the user authorizes submission.
- [ ] Commit the final verified deliverable and report the live URL, repository, checks, and remaining limitations.

## Self-review
All agreed scope maps to Tasks 2–4; coverage and API uncertainty to Task 1; public delivery to Task 5. Shared names and types are consistent. Each review-focus condition has an explicit owning test. No live API capability, credential, hosting account, or publication state is assumed available.

## Execution handoff
Recommended: native execution in this session, with a final independent review. The five tasks share tightly coupled contracts and a small application; this keeps handoffs limited while preserving integration checks. Await user review and execution choice before implementation.
