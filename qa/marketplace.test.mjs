import test from "node:test";
import assert from "node:assert/strict";
import {
  formatPKR,
  formatEventDate,
  eventTiming,
  safeExternalUrl,
} from "../src/lib/marketplace.ts";
test("PKR formatting has a currency label and no fabricated amount", () => {
  assert.equal(formatPKR(15000), "Rs. 15,000");
  assert.equal(formatPKR("15000.50"), "Rs. 15,000.5");
  assert.equal(formatPKR("bad"), "Price not provided");
});
test("event dates use Pakistan timezone including a UTC day boundary", () => {
  assert.match(formatEventDate("2026-10-20"), /20/);
  assert.match(formatEventDate("2026-10-19T22:00:00Z"), /20/);
  assert.equal(formatEventDate("bad"), "Date to be announced");
});
test("event lifecycle is derived without fabricating cancellation status", () => {
  assert.equal(eventTiming("2026-10-21", null, "2026-10-20"), "Upcoming");
  assert.equal(
    eventTiming("2026-10-19", "2026-10-21", "2026-10-20"),
    "Ongoing",
  );
  assert.equal(
    eventTiming("2026-10-19", "2026-10-19", "2026-10-20"),
    "Completed",
  );
});
test("external links reject executable and malformed schemes", () => {
  assert.equal(safeExternalUrl("javascript:alert(1)"), null);
  assert.equal(safeExternalUrl("data:text/html,test"), null);
  assert.equal(safeExternalUrl("not-a-url"), null);
  assert.equal(safeExternalUrl("https://example.com"), "https://example.com/");
});
