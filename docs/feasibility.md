# Qloo feasibility — October 28, 2026

Read current Qloo-maintained documentation in https://github.com/qloo/docs-public.

- Authentication: X-Api-Key header, server-only. Hackathon origin: https://hackathon.api.qloo.com.
- Search: GET /search with query, types, take. Live response uses results array, entity_id, types array, disambiguation, and optional location.
- Cities: types=urn:entity:locality returns multiple disambiguated London matches with coordinates. Select the locality ID; do not repeat fuzzy city-name matching in Insights.
- Insights: GET /v2/insights with filter.type=urn:entity:place, signal.interests.entities, filter.location (selected locality UUID), feature.explainability=true, take. Exclude previous IDs using filter.exclude.entities.
- Live Insights results use results.entities; entity_id, subtype, properties, location, tags, query.affinity, query.explainability.
- Contribution evidence observed under query.explainability["signal.interests.entities"] as entity_id/score pairs.
- Place images, descriptions, ambience descriptions and price_level may be present. Prices and hours can be null. No live availability guarantee.
- London and New York name-query smoke checks returned six candidates for each of two profiles, with substantially different lists. London results for Radiohead/Spirited Away/Murakami included 221B Baker St; Beyoncé/Barbie/Nike included Ruby Lucy Hotel & Bar. Raw public metadata is retained only in ignored .sites-runtime for development verification. This smoke script picks first taste matches; the product requires explicit user selection and locality IDs.
- Qloo can occasionally exceed 20 seconds. Production calls use a 60-second bound and honest retry errors.

Ruling: Use a bounded deterministic tool workflow for this version: resolve, retrieve, compare explicit constraints, explain Qloo evidence, and retrieve alternatives on feedback. It does not require a second model-provider key. This is an agentic recommendation tool; no claim that an LLM autonomously reasons about the user. Cost if wrong: a future model adapter can replace orchestration without changing the Qloo/UI contracts.

Framework: Sites Vinext starter (React and Next-compatible routes), TypeScript. Node's native test runner replaces Vitest, since this Node runtime supports TypeScript stripping; browser tests use Playwright. Cost if wrong: test-runner migration only.

Finished-adapter verification: London locality ID filtering returned three supported discoveries (Georgian House Hotel, The Orangery Restaurant, Sky Pod Bar) with contributions from Radiohead, Spirited Away, and Nike. Feedback replaced only the first card with The Chesterfield Mayfair. The same flow passed through the actual browser UI.

Production: deployed successfully to https://second-home-taste-discoveries.daintytapir512.chatgpt.site with hosted secret revision 1. Hosted discovery returned HTTP 200 and three live Qloo places. Public audience enabled; an unauthenticated page fetch returned HTTP 200. Public source: https://github.com/fernandoshanegihan-coder/SecondHome (MIT license detected).

Quota protection: per-worker memory limits of 20 requests per client and 60 total per minute. These limits are best-effort across worker isolates and are not a global spending cap. Qloo-side quota settings remain authoritative.
