import { test } from "node:test";
import assert from "node:assert/strict";
import { discover, replace } from "../lib/discovery/agent.ts";
import { parseDiscoveryRequest } from "../lib/discovery/schema.ts";
const request = {
  city: {
    id: "4F18635D-75D6-43EC-B8B9-8DFAEB8C5A29",
    label: "London",
    lat: 51.5,
    lon: -0.1,
  },
  tastes: [
    {
      id: "70CAE5BF-2F4C-445C-A3E5-4EDACFC3591C",
      name: "Radiohead",
      kind: "artist",
    },
    {
      id: "9B33A620-68CA-49B3-BFCF-F09CCF8AD595",
      name: "Spirited Away",
      kind: "movie",
    },
    {
      id: "87DF7171-6204-4B87-8AE5-141DEB1DBC5D",
      name: "Murakami",
      kind: "artist",
    },
  ],
  preferences: {},
};
const place = (id, more = {}) => ({
  id,
  name: id,
  tags: [],
  evidence: [],
  ...more,
});
test("discovery deduplicates and reports a shortfall without invented places", async () => {
  const r = await discover(request, async () => [
    place("A"),
    place("A"),
    place("B"),
  ]);
  assert.deepEqual(
    r.items.map((i) => i.place.id),
    ["A", "B"],
  );
  assert.ok(r.warnings.some((w) => w.includes("2")));
  assert.ok(r.items[0].reason.includes("combined"));
  assert.equal(r.items[0].place.price, undefined);
});
test("explanation names only contribution evidence returned by Qloo", async () => {
  const r = await discover(request, async () => [
    place("A", { evidence: ["Radiohead"] }),
  ]);
  assert.ok(r.items[0].reason.includes("Radiohead"));
  assert.ok(!r.items[0].reason.includes("Spirited Away"));
});
test("replacement preserves other cards and excludes current and prior rejected IDs", async () => {
  const current = (
    await discover(request, async () => [place("A"), place("B"), place("C")])
  ).items;
  const r = await replace(
    {
      context: request,
      current,
      replaceId: "B",
      feedback: "something different",
      excludedIds: ["OLD"],
    },
    async (_, excluded) => {
      assert.deepEqual(new Set(excluded), new Set(["A", "B", "C", "OLD"]));
      return [place("B"), place("D")];
    },
  );
  assert.deepEqual(
    r.items.map((i) => i.place.id),
    ["A", "D", "C"],
  );
  assert.deepEqual(r.items[0], current[0]);
  assert.deepEqual(r.items[2], current[2]);
});
test("failed replacement leaves all cards unchanged", async () => {
  const current = (await discover(request, async () => [place("A")])).items;
  const r = await replace(
    { context: request, current, replaceId: "A", feedback: "quieter" },
    async () => [],
  );
  assert.deepEqual(r.items, current);
  assert.ok(r.warnings.length);
});
test("quieter feedback uses explicit ambience evidence and unknown matches are disclosed", async () => {
  const current = (await discover(request, async () => [place("A")])).items;
  const r = await replace(
    { context: request, current, replaceId: "A", feedback: "quieter" },
    async () => [
      place("B", { ambience: "Loud, lively bar" }),
      place("C", { ambience: "A quiet reading room" }),
    ],
  );
  assert.equal(r.items[0].place.id, "C");
  const unknown = await replace(
    { context: request, current, replaceId: "A", feedback: "quieter" },
    async () => [place("D")],
  );
  assert.ok(unknown.warnings.some((w) => w.includes("verify")));
});
test("invalid and repeated taste IDs cannot start expensive queries", () => {
  assert.throws(() => parseDiscoveryRequest({ ...request, tastes: [] }));
  assert.throws(() =>
    parseDiscoveryRequest({
      ...request,
      tastes: [request.tastes[0], request.tastes[0], request.tastes[0]],
    }),
  );
  assert.throws(() =>
    parseDiscoveryRequest({ ...request, city: { ...request.city, lat: 999 } }),
  );
});
test("closer ranks unknown coordinates last and discloses an unverified improvement", async () => {
  const current = (
    await discover(request, async () => [
      place("A", { lat: 51.5001, lon: -0.1 }),
    ])
  ).items;
  const r = await replace(
    { context: request, current, replaceId: "A", feedback: "Closer" },
    async () => [place("UNKNOWN"), place("NEAR", { lat: 51.51, lon: -0.1 })],
  );
  assert.equal(r.items[0].place.id, "NEAR");
  assert.ok(r.warnings.some((w) => w.includes("closer option")));
});
test("negated quiet descriptions do not outrank positive quiet evidence", async () => {
  const current = (await discover(request, async () => [place("A")])).items;
  const r = await replace(
    { context: request, current, replaceId: "A", feedback: "Quieter" },
    async () => [
      place("NOISY", { ambience: "Not a quiet place; loud music until late." }),
      place("QUIET", { ambience: "A quiet reading room." }),
    ],
  );
  assert.equal(r.items[0].place.id, "QUIET");
});
test("unknown original price cannot establish a cheaper replacement", async () => {
  const current = (await discover(request, async () => [place("A")])).items;
  const r = await replace(
    { context: request, current, replaceId: "A", feedback: "Cheaper" },
    async () => [place("B", { price: 3 })],
  );
  assert.ok(r.warnings.some((w) => w.includes("cheaper")));
});
