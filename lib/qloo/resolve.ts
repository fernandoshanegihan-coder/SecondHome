import { createQlooClient, type QlooClient, QlooError } from "./client.ts";
import type { EntityChoice, CityChoice } from "../discovery/types.ts";
function entities(data: any): any[] {
  const rows = Array.isArray(data?.results)
    ? data.results
    : data?.results?.entities;
  if (!Array.isArray(rows))
    throw new QlooError(
      "UPSTREAM",
      "Qloo returned an unreadable search result.",
    );
  return rows;
}
export async function resolveTaste(
  text: string,
  client: QlooClient = createQlooClient(),
): Promise<EntityChoice[]> {
  const data = await client("/search", {
    query: text,
    types:
      "urn:entity:artist,urn:entity:movie,urn:entity:book,urn:entity:brand,urn:entity:place",
    take: "8",
  });
  const seen = new Set();
  return entities(data).flatMap((e) => {
    const type = e.types?.[0] ?? e.subtype;
    if (
      !e.entity_id ||
      typeof e.name !== "string" ||
      !type ||
      seen.has(e.entity_id)
    )
      return [];
    seen.add(e.entity_id);
    return [
      {
        id: e.entity_id,
        name: e.name,
        kind: type.replace("urn:entity:", ""),
        detail:
          typeof e.disambiguation === "string" ? e.disambiguation : undefined,
      },
    ];
  });
}
export async function resolveCity(
  text: string,
  client: QlooClient = createQlooClient(),
): Promise<CityChoice[]> {
  const data = await client("/search", {
    query: text,
    types: "urn:entity:locality",
    take: "8",
  });
  const seen = new Set();
  return entities(data).flatMap((e) => {
    if (
      !e.entity_id ||
      !e.name ||
      seen.has(e.entity_id) ||
      !Number.isFinite(e.location?.lat) ||
      !Number.isFinite(e.location?.lon)
    )
      return [];
    seen.add(e.entity_id);
    return [
      {
        id: e.entity_id,
        label: e.disambiguation || e.name,
        lat: e.location.lat,
        lon: e.location.lon,
      },
    ];
  });
}
