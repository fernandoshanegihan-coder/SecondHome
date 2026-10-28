import { test, expect } from "@playwright/test";

test("a delayed previous city search cannot replace the new selection", async ({page}) => {
 let release!:()=>void;
 const gate=new Promise<void>(resolve=>{release=resolve;});
 let firstStarted!:()=>void;
 const started=new Promise<void>(resolve=>{firstStarted=resolve;});
 await page.route("**/api/resolve",async route=>{
  const input=route.request().postDataJSON();
  if(input.text==='London'){firstStarted();await gate;await route.fulfill({json:{choices:[{id:'4F18635D-75D6-43EC-B8B9-8DFAEB8C5A29',label:'London, United Kingdom',lat:51.5,lon:-0.1}]}});}
  else await route.fulfill({json:{choices:[{id:'4F18635D-75D6-43EC-B8B9-8DFAEB8C5A29',label:'Tokyo, Japan',lat:35.6,lon:139.7}]}});
 });
 await page.goto('/');
 await page.getByLabel('Your new city').fill('London');await page.getByRole('button',{name:'Search cities'}).click();await started;
 await page.getByLabel('Your new city').fill('Tokyo');await page.getByRole('button',{name:'Search cities'}).click();await page.getByRole('button',{name:'Tokyo, Japan',exact:true}).click();
 release();await expect(page.getByLabel('Your new city')).toHaveValue('Tokyo');await expect(page.getByRole('button',{name:'London, United Kingdom',exact:true})).toHaveCount(0);
});
const city = {
  id: "4F18635D-75D6-43EC-B8B9-8DFAEB8C5A29",
  label: "London, England, United Kingdom",
  lat: 51.5,
  lon: -0.1,
};
const tastes = ["Radiohead", "Spirited Away", "Nike"].map((name, i) => ({
  id: [
    "70CAE5BF-2F4C-445C-A3E5-4EDACFC3591C",
    "9B33A620-68CA-49B3-BFCF-F09CCF8AD595",
    "C70CE2B8-0AD1-4150-BF18-5A6347F2E860",
  ][i],
  name,
  kind: ["artist", "movie", "brand"][i],
}));
const discoveries = ["Reading Room", "Garden Café", "City Gallery"].map(
  (name, i) => ({
    place: {
      id: tastes[i].id,
      name,
      tags: [],
      evidence: ["Radiohead"],
      address: "London",
    },
    reason: "Qloo connects this place with Radiohead.",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=London",
  }),
);
test("newcomer resolves tastes, discovers places, and retains cards on replacement failure", async ({
  page,
}) => {
  await page.route("**/api/resolve", async (route) => {
    const b = route.request().postDataJSON();
    await route.fulfill({
      json: {
        choices:
          b.kind === "city" ? [city] : tastes.filter((t) => t.name === b.text),
      },
    });
  });
  await page.route("**/api/discover", (route) =>
    route.fulfill({
      json: {
        items: discoveries,
        warnings: [],
        steps: ["Searched Qloo’s taste graph"],
      },
    }),
  );
  await page.route("**/api/replace", (route) =>
    route.fulfill({
      status: 503,
      json: { error: { message: "Please try again." } },
    }),
  );
  await page.goto("/");
  await page.getByLabel("Your new city").fill("London");
  await page.getByRole("button", { name: "Search cities" }).click();
  await page.getByRole("button", { name: city.label, exact: true }).click();
  for (const t of tastes) {
    await page.getByLabel("Search a favourite").fill(t.name);
    await page.getByRole("button", { name: "Search favourites" }).click();
    await page
      .getByRole("button", { name: new RegExp(`^${t.name} —`) })
      .click();
  }
  await page.getByRole("button", { name: "Find my three discoveries" }).click();
  await expect(
    page.getByRole("heading", { name: "Reading Room", exact: true }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "Find on map" })).toHaveCount(3);
  await page.getByRole("button", { name: "Try another place" }).first().click();
  await page
    .getByRole("button", { name: "Quieter", exact: true })
    .first()
    .click();
  await expect(
    page.getByText("Please try again.", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Reading Room", exact: true }),
  ).toBeVisible();
});
test("mobile form remains inside viewport and errors retain inputs", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.route("**/api/resolve", (r) =>
    r.fulfill({
      status: 503,
      json: { error: { message: "Qloo is busy. Try again." } },
    }),
  );
  await page.goto("/");
  await page.getByLabel("Your new city").fill("London");
  await page.getByRole("button", { name: "Search cities" }).click();
  await expect(page.getByLabel("Your new city")).toHaveValue("London");
  await expect(
    page.getByText("Qloo is busy. Try again.", { exact: true }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBeTruthy();
});
