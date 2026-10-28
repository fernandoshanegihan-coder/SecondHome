# Second Home: design for approval

## Intent
Help newcomers discover places they will enjoy exploring on their own in an unfamiliar city. Translate familiar cultural tastes into three personal discoveries, using Qloo as the source of taste relationships.

## Agreed scope
- Audience: newcomers to any unfamiliar city, rather than a specific nationality.
- Purpose: independent exploration.
- Experience: three personal discoveries, rather than an itinerary or an evolving neighbourhood guide.

## Proposed first version
A responsive English-language web app, publicly hosted for the hackathon. No account required. These are proposed implementation choices, not previously agreed requirements.

1. User enters a destination city, three to five favourite artists, films, books, brands, or places, and optional preferences for budget, atmosphere, and exploration area.
2. The app resolves the destination and favourites to supported entities. Ambiguous matches require selection; unsupported favourites can be replaced. Do not silently substitute unrelated entities.
3. An agent queries Qloo for relevant place candidates, compares them with the explicit preferences, and selects three distinct discoveries. It can request clarification or revise its search when results are insufficient.
4. Each discovery displays the place name, available location details, a concise explanation tied to actual taste signals, and a map search link. Label inferred connections as such; do not present cultural affinity as a guarantee.
5. User can ask for a change such as quieter, cheaper, or closer, and receive a replacement while retaining the other discoveries. Retain the original taste inputs and apply the new constraint.

## Qloo and evidence
Validate API access, supported entity types, destination coverage, available place metadata, and relevant filtering before implementation commitments. The intended audience is worldwide, but coverage is conditional on returned data. Start validation with one well-covered city and a second contrasting city.

Qloo results must materially drive candidate discovery and ranking. An LLM may interpret preferences, choose available tools, and explain retrieved evidence; it must not fabricate places or taste relationships. Show a compact explanation of which inputs informed a result without exposing secrets or claiming unsupported statistical precision.

Do not infer actual price, current opening hours, accessibility, safety, or live availability from cultural affinity. Use verified metadata when available; otherwise mark these details unknown. Budget is a preference, not a guaranteed filter unless supported by evidence. For unsupported constraints, explain the limitation and offer a revision.

## Failure handling
- Missing city coverage or fewer than three suitable candidates: disclose the shortfall, show only supported results, and invite a broader area or changed preferences.
- Ambiguous city: let the user select the intended location.
- API or model failure: display a retryable error and retain entered preferences.
- No API key: show setup instructions during development; never disguise fixtures as live recommendations.
- Replacement failure: retain the previous card and explain why no replacement was found.

## Alternatives considered
1. Three personal discoveries: selected by the user; focuses effort on matching quality and feedback.
2. Planned afternoon: deferred because it needs reliable routing and hours.
3. Evolving neighbourhood guide: deferred because accounts and persistent history increase scope.

## Non-goals and anti-goals
No social matching, bookings, payments, turn-by-turn routes, full itinerary planning, or persistent user profiles. Do not produce generic city lists unaffected by tastes. Do not promise worldwide coverage, live venue details, or objective personal safety.

## Proposed technical direction
Use a single web application with server-side Qloo and model calls, keeping keys out of browser code and the public repository. Keep only short-lived session preferences for the first version. Avoid storing precise home addresses. Framework, model provider, hosting provider, map-link provider, and visual treatment are builder choices, subject to available credentials and deployment access. API feasibility findings may require a design revision before building.

## Validation and delivery
Verify entity resolution, real Qloo place discovery in two cities, different outputs for distinct taste profiles where the data supports this, replacement with retained context, graceful insufficient-results behavior, secret isolation, and the complete public demo flow. Deterministic checks should validate orchestration; live checks validate integration and coverage.

Deliver a hosted working demo, public source repository with an open-source license and setup instructions, and a submission description. Publishing credentials and external accounts are dependencies to resolve during implementation, not assumed available.

## Approval
User approved this scope on October 27, 2026. No product implementation has begun.
