import { findPlaces } from "../qloo/places.ts";
import type {
  DiscoveryRequest,
  Discovery,
  DiscoveryResult,
  ReplacementRequest,
  PlaceCandidate,
} from "./types.ts";
type Search = (
  request: DiscoveryRequest,
  excludeIds: string[],
) => Promise<PlaceCandidate[]>;
function card(p: PlaceCandidate): Discovery {
  const reason = p.evidence.length
    ? `Qloo connects this place with your interest in ${p.evidence.join(", ")}. It is a cultural affinity, rather than a guarantee of what you will enjoy.`
    : "Qloo selected this place from your combined taste profile. Individual taste contributions were not available for this result.";
  return {
    place: p,
    reason,
    mapUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent([p.name, p.address].filter(Boolean).join(", "))}`,
  };
}
function unique(rows: PlaceCandidate[], excluded: string[]) {
  const seen = new Set(excluded);
  return rows.filter((p) => {
    if (seen.has(p.id)) return false;
    seen.add(p.id);
    return true;
  });
}
function rank(
  rows: PlaceCandidate[],
  request: DiscoveryRequest,
  feedback = "",
  previous?: PlaceCandidate,
) {
  const isQuiet = (p: PlaceCandidate) => {
    const e = [p.ambience, ...p.tags].join(" ").toLowerCase();
    return (
      /\b(quiet|calm|peaceful|tranquil)\b/.test(e) &&
      !/\b(noisy|loud|bustling)\b|\b(not|never|hardly|not particularly)\s+(a\s+|very\s+)?(quiet|calm|peaceful|tranquil)\b/.test(
        e,
      )
    );
  };
  const distance = (p: PlaceCandidate) =>
    Number.isFinite(p.lat) && Number.isFinite(p.lon)
      ? Math.hypot(p.lat! - request.city.lat, p.lon! - request.city.lon)
      : Infinity;
  const intent = [
    request.preferences.atmosphere,
    request.preferences.budget,
    feedback,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  const quiet = /quiet|calm|peaceful/.test(intent);
  const cheap = /cheap|budget|less expensive/.test(intent);
  const closer = /closer|nearer/.test(intent);
  const score = (p: PlaceCandidate) => {
    const evidence = [p.ambience, ...p.tags].join(" ").toLowerCase();
    let score = 0;
    if (quiet && isQuiet(p)) score += 10;
    if (cheap && p.price !== undefined)
      score +=
        previous?.price !== undefined
          ? p.price < previous.price
            ? 10
            : -10
          : 5 - p.price;
    if (closer) score -= Number.isFinite(distance(p)) ? distance(p) : 100000;
    return score;
  };
  const sorted = [...rows].sort((a, b) => score(b) - score(a));
  const warnings: string[] = [];
  if (quiet && !sorted.some(isQuiet))
    warnings.push(
      "We could not verify a quieter atmosphere from Qloo’s metadata. These are alternative taste matches.",
    );
  if (
    cheap &&
    ((previous && previous.price === undefined) ||
      !sorted.some(
        (p) =>
          p.price !== undefined &&
          (previous?.price === undefined || p.price < previous.price),
      ))
  )
    warnings.push(
      "We could not verify a cheaper option. Prices are unknown or no lower price level was available.",
    );
  if (
    closer &&
    (!previous ||
      !Number.isFinite(distance(previous)) ||
      !sorted.some((p) => distance(p) < distance(previous)))
  )
    warnings.push(
      "We could not verify a closer option than your previous discovery.",
    );
  if (closer)
    warnings.push(
      "Closer means closer to the selected city’s centre, not your home.",
    );
  if (request.preferences.area)
    warnings.push(
      "Neighbourhood preferences are not verified in this version. Results stay within the selected city.",
    );
  if (
    feedback &&
    !/quiet|calm|peaceful|cheap|budget|less expensive|closer|nearer|different|another|alternative/i.test(
      feedback,
    )
  )
    warnings.push(
      "We searched for an alternative. That specific preference could not be verified from Qloo’s metadata.",
    );
  return { rows: sorted, warnings };
}
export async function discover(
  request: DiscoveryRequest,
  search: Search = findPlaces,
): Promise<DiscoveryResult> {
  const candidates = unique(await search(request, []), []);
  const selected = rank(candidates, request);
  const items = selected.rows.slice(0, 3).map(card);
  return {
    items,
    warnings: [
      ...selected.warnings,
      ...(items.length < 3
        ? [
            `We found ${items.length} supported discoveries. Try a broader city or different favourites for more.`,
          ]
        : []),
    ],
    steps: [
      "Resolved your favourites",
      "Searched Qloo’s taste graph",
      "Compared places in your selected city",
    ],
  };
}
export async function replace(
  request: ReplacementRequest,
  search: Search = findPlaces,
): Promise<DiscoveryResult> {
  const excluded = [
    ...new Set([
      ...request.current.map((c) => c.place.id),
      ...(request.excludedIds ?? []),
    ]),
  ];
  const candidates = unique(await search(request.context, excluded), excluded);
  const selected = rank(
    candidates,
    request.context,
    request.feedback,
    request.current.find((c) => c.place.id === request.replaceId)?.place,
  );
  if (!selected.rows.length)
    return {
      items: request.current,
      warnings: [
        "No supported replacement was found. We kept your discoveries. Try a different preference.",
      ],
      steps: ["Searched again with previous places excluded"],
    };
  return {
    items: request.current.map((c) =>
      c.place.id === request.replaceId ? card(selected.rows[0]) : c,
    ),
    warnings: selected.warnings,
    steps: [
      "Kept your original tastes",
      "Excluded previous discoveries",
      "Compared alternatives with your feedback",
    ],
  };
}
