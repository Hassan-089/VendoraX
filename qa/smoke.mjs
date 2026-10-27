import { writeFile } from "node:fs/promises";
const base = process.env.QA_BASE_URL || "http://localhost:3000";
const results = [];
async function check(route, expected, options = {}) {
  try {
    const response = await fetch(base + route, {
      redirect: "manual",
      signal: AbortSignal.timeout(45000),
      ...options,
    });
    const body = await response.text();
    const location = response.headers.get("location");
    const pass =
      response.status === expected &&
      (expected !== 307 || location?.endsWith("/login")) &&
      !body.includes("NEXT_HTTP_ERROR_FALLBACK;500");
    const result = {
      route,
      method: options.method || "GET",
      status: response.status,
      expected,
      location,
      pass,
    };
    results.push(result);
    console.log(JSON.stringify(result));
  } catch (error) {
    results.push({ route, error: error.message, pass: false });
    console.log(route, error.message);
  }
}
for (const route of [
  "/",
  "/events",
  "/events?city=Lahore&category=Technology&q=conference&sort=soonest",
  "/events?q=a&q=b",
  "/categories",
  "/cities",
  "/for-organizers",
  "/for-businesses",
  "/about",
  "/contact",
  "/help",
  "/terms",
  "/privacy",
  "/cookies",
  "/login",
  "/signup?role=organizer",
  "/signup?role=business",
  "/forgot-password",
  "/reset-password",
  "/blog",
  "/blog/popular-events-lahore-2024",
  "/blog/popular-events-karachi-2024",
  "/blog/popular-events-islamabad-2024",
  "/sitemap.xml",
  "/robots.txt",
])
  await check(route, 200);
for (const route of [
  "/profile",
  "/favorites",
  "/onboarding",
  "/user/dashboard",
  "/business/dashboard",
  "/business/applications",
  "/organizer/dashboard",
  "/organizer/my-events",
  "/organizer/create-event",
  "/organizer/applications",
  "/admin/dashboard",
])
  await check(route, 307);
for (const route of [
  "/events/not-a-valid-id",
  "/blog/not-a-real-article",
  "/organizers/not-a-valid-id",
])
  await check(route, 404);
for (const route of ["/api/chat", "/api/seo/generate"])
  for (const body of [
    "{",
    "null",
    "{}",
    JSON.stringify(
      route.includes("chat")
        ? { messages: [{ sender: "user", text: 4 }] }
        : { title: 4 },
    ),
  ])
    await check(route, 400, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    });
for (const [route, method, body] of [
  ["/api/applications", "POST", {}],
  [
    "/api/applications/00000000-0000-0000-0000-000000000001/decision",
    "POST",
    { status: "approved" },
  ],
  ["/api/events", "POST", {}],
  ["/api/events/00000000-0000-0000-0000-000000000001", "PATCH", {}],
  ["/api/profile", "PATCH", { name: "QA fixture" }],
  ["/api/admin/events/00000000-0000-0000-0000-000000000001", "POST", {}],
  ["/api/seo/generate", "POST", { title: "QA fixture" }],
])
  await check(route, 401, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
for (const [route, method] of [
  ["/api/applications", "POST"],
  ["/api/applications/00000000-0000-0000-0000-000000000001/decision", "POST"],
  ["/api/events", "POST"],
  ["/api/events/00000000-0000-0000-0000-000000000001", "PATCH"],
  ["/api/profile", "PATCH"],
  ["/api/admin/events/00000000-0000-0000-0000-000000000001", "POST"],
])
  await check(route, 403, {
    method,
    headers: {
      "Content-Type": "application/json",
      Origin: "https://untrusted.invalid",
    },
    body: "{}",
  });
await writeFile(
  "qa/http-results.json",
  JSON.stringify(
    {
      base,
      passed: results.filter((r) => r.pass).length,
      total: results.length,
      results,
    },
    null,
    2,
  ),
);
if (results.some((r) => !r.pass)) process.exitCode = 1;
