import assert from "node:assert/strict";
import test from "node:test";
import {
  readPlannerRows,
  writePlannerRows,
  guestRowsSchema,
  budgetRowsSchema,
} from "../src/lib/planner-storage.ts";
import { listingPreview } from "../src/lib/listing-preview.ts";
import { fetchProxyImage, isProxyImageUrl } from "../src/lib/image-proxy.ts";

const guest = { id: "1", name: "Household", side: "Both", partySize: 2, rsvp: "pending" };
const storage = (values) => ({ getItem: (key) => values[key] ?? null });

test("saved households and intentionally empty plans survive reading", () => {
  assert.deepEqual(
    readPlannerRows(storage({ plan: JSON.stringify([guest]) }), "plan", [], guestRowsSchema),
    [guest],
  );
  assert.deepEqual(
    readPlannerRows(
      storage({ plan: "[]", old: JSON.stringify([guest]) }),
      "plan",
      ["old"],
      guestRowsSchema,
    ),
    [],
  );
});
test("corrupt current data can recover a valid legacy plan", () => {
  assert.deepEqual(
    readPlannerRows(
      storage({ plan: "{bad json", old: JSON.stringify([guest]) }),
      "plan",
      ["old"],
      guestRowsSchema,
    ),
    [guest],
  );
});
test("malformed saved values cannot break numeric planner totals", () => {
  for (const value of [
    "null",
    "{}",
    JSON.stringify([{ ...guest, partySize: "2" }]),
    JSON.stringify([{ ...guest, partySize: -2 }]),
  ]) {
    assert.equal(readPlannerRows(storage({ plan: value }), "plan", [], guestRowsSchema), undefined);
  }
  assert.equal(
    readPlannerRows(
      storage({ plan: '[{"id":"1","estimated":"100"}]' }),
      "plan",
      [],
      budgetRowsSchema,
    ),
    undefined,
  );
});
test("unavailable browser storage and quota failures do not throw", () => {
  assert.equal(
    readPlannerRows(
      {
        getItem() {
          throw Error("blocked");
        },
      },
      "plan",
      [],
      guestRowsSchema,
    ),
    undefined,
  );
  assert.equal(
    writePlannerRows(
      {
        setItem() {
          throw Error("quota");
        },
      },
      "plan",
      [guest],
    ),
    false,
  );
});
test("card previews stay small without changing the full gallery", () => {
  const full = {
    gallery_images: Array.from({ length: 100 }, (_, i) => `https://example.com/${i}.jpg`),
    overview: "A long description. ".repeat(100),
    name: "Venue",
  };
  const preview = listingPreview(full);
  assert.equal(preview.gallery_images.length, 3);
  assert.equal(full.gallery_images.length, 100);
  assert.equal(preview.overview.length, 240);
  assert.equal(preview.name, "Venue");
});
test("an HTTP 200 HTML challenge triggers the image fallback", async () => {
  let calls = 0;
  const result = await fetchProxyImage(
    new URL("https://cdn0.hitched.co.uk/photo.jpg"),
    async () => {
      calls++;
      return calls === 1
        ? new Response("challenge", { headers: { "content-type": "text/html" } })
        : new Response("image", { headers: { "content-type": "image/webp" } });
    },
  );
  assert.equal(calls, 2);
  assert.equal(result.status, 200);
  assert.equal(result.headers.get("content-type"), "image/webp");
});
test("upstream network failure falls back rather than producing a server error", async () => {
  let calls = 0;
  const result = await fetchProxyImage(new URL("https://cdn0.hitched.ie/photo.jpg"), async () => {
    if (++calls === 1) throw Error("timeout");
    return new Response("image", { headers: { "content-type": "image/jpeg" } });
  });
  assert.equal(result.status, 200);
});
test("transient upstream failures are retriable and never CDN cached as 404", async () => {
  const result = await fetchProxyImage(
    new URL("https://cdn0.hitched.ie/photo.jpg"),
    async () => new Response("missing", { status: 404 }),
  );
  assert.equal(result.status, 503);
  assert.equal(result.headers.get("cache-control"), "no-store");
  assert.equal(result.headers.get("retry-after"), "300");
});
test("image proxy accepts only known public media sources", () => {
  assert.equal(isProxyImageUrl(new URL("https://cdn0.hitched.co.uk/photo.jpg")), true);
  assert.equal(
    isProxyImageUrl(new URL("https://s3-eu-west-1.amazonaws.com/weddingdates-media/photo.jpg")),
    true,
  );
  for (const url of [
    "https://localhost/photo.jpg",
    "https://cdn0.hitched.co.uk:8080/photo.jpg",
    "https://user:pass@cdn0.hitched.co.uk/photo.jpg",
    "https://s3-eu-west-1.amazonaws.com/other-bucket/photo.jpg",
  ]) {
    assert.equal(isProxyImageUrl(new URL(url)), false);
  }
});
