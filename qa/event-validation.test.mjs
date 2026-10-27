import test from "node:test";
import assert from "node:assert/strict";
import { validateEventDraft, validDate } from "../src/lib/event-validation.ts";
const draft = () => ({
  title: "QA fixture — not a live listing",
  description: "Used only inside a local unit test.",
  city: "Lahore",
  venue: "Test venue",
  category: "Custom category",
  start_date: "2026-11-01",
  end_date: "2026-11-02",
  expected_visitors: "100",
  packages: [
    {
      name: "Test package",
      price: "15000.50",
      size: "3 × 3 m",
      perks: ["Table"],
    },
  ],
});
test("normalizes a valid draft and keeps PKR decimal values as strings", () => {
  const result = validateEventDraft(draft());
  assert.equal(result.error, undefined);
  assert.equal(result.value.expected_visitors, 100);
  assert.equal(result.value.packages[0].price, "15000.50");
});
test("rejects invalid calendar dates and backwards schedules", () => {
  assert.equal(validDate("2026-02-31"), false);
  assert.equal(validDate("2028-02-29"), true);
  assert.ok(validateEventDraft({ ...draft(), end_date: "2026-10-01" }).error);
});
test("rejects fractional, negative and excessive attendance", () => {
  for (const n of ["1.5", "-1", "100000001", "NaN"])
    assert.ok(validateEventDraft({ ...draft(), expected_visitors: n }).error);
});
test("rejects money that would require rounding or floating point coercion", () => {
  for (const price of ["-1", "0.005", "1e5", "Infinity", 15000])
    assert.ok(
      validateEventDraft({
        ...draft(),
        packages: [{ ...draft().packages[0], price }],
      }).error,
    );
});
test("rejects oversized payloads and missing required fields", () => {
  assert.ok(validateEventDraft(null).error);
  assert.ok(validateEventDraft([]).error);
  assert.ok(validateEventDraft({ ...draft(), title: " " }).error);
  assert.ok(
    validateEventDraft({
      ...draft(),
      packages: Array(21).fill(draft().packages[0]),
    }).error,
  );
});
