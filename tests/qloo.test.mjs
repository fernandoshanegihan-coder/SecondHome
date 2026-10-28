import { test } from "node:test";
import assert from "node:assert/strict";
import { createQlooClient, QlooError } from "../lib/qloo/client.ts";
import { resolveTaste, resolveCity } from "../lib/qloo/resolve.ts";
import { findPlaces } from "../lib/qloo/places.ts";
const id = "70CAE5BF-2F4C-445C-A3E5-4EDACFC3591C";
const cityId = "4F18635D-75D6-43EC-B8B9-8DFAEB8C5A29";
const client = (data, check = () => {}) =>
  createQlooClient({
    key: "test-private-key",
    base: "https://api.qloo.com",
    fetcher: async (u) => {
      check(new URL(u));
      return Response.json(data);
    },
  });
test("resolution preserves ambiguous choices and removes duplicate IDs", async () => {
  const c = client({
    results: [
      { entity_id: id, name: "Radiohead", types: ["urn:entity:artist"] },
      { entity_id: id, name: "Radiohead", types: ["urn:entity:artist"] },
      {
        entity_id: cityId,
        name: "Radiohead cover",
        types: ["urn:entity:artist"],
      },
    ],
  });
  const result = await resolveTaste("Radiohead", c);
  assert.equal(result.length, 2);
  assert.equal(result[0].kind, "artist");
});
test("city resolution returns locality IDs and disambiguating labels", async () => {
  const result = await resolveCity(
    "London",
    client(
      {
        results: [
          {
            entity_id: cityId,
            name: "London",
            disambiguation: "London, England, United Kingdom",
            types: ["urn:entity:locality"],
            location: { lat: 51.5, lon: -0.1 },
          },
        ],
      },
      (u) => assert.equal(u.searchParams.get("types"), "urn:entity:locality"),
    ),
  );
  assert.equal(result[0].label, "London, England, United Kingdom");
  assert.equal(result[0].id, cityId);
});
test("unmatched searches are an empty choice list", async () =>
  assert.deepEqual(await resolveTaste("missing", client({ results: [] })), []));
test("upstream authentication errors never disclose body secrets", async () => {
  const c = createQlooClient({
    key: "test-private-key",
    fetcher: async () => new Response("secret-provider-body", { status: 401 }),
  });
  await assert.rejects(
    () => c("/search", {}),
    (e) =>
      e instanceof QlooError &&
      e.code === "AUTH" &&
      !e.message.includes("secret"),
  );
});
test("places query uses selected locality ID, tastes, exclusions, and explainability", async () => {
  const result = await findPlaces(
    {
      city: { id: cityId, label: "London", lat: 51.5, lon: -0.1 },
      tastes: [{ id, name: "Radiohead", kind: "artist" }],
      preferences: {},
    },
    [id],
    client(
      {
        results: {
          entities: [
            {
              entity_id: cityId,
              name: "Bookshop",
              subtype: "urn:entity:place",
              properties: { address: "London", is_closed: false },
              query: { affinity: 0.8 },
              tags: [],
            },
          ],
        },
      },
      (u) => {
        assert.equal(u.searchParams.get("filter.location"), cityId);
        assert.equal(u.searchParams.get("signal.interests.entities"), id);
        assert.equal(u.searchParams.get("feature.explainability"), "true");
        assert.equal(u.searchParams.get("filter.exclude.entities"), id);
      },
    ),
  );
  assert.equal(result[0].price, undefined);
  assert.equal(result[0].name, "Bookshop");
});
