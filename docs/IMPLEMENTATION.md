# VendoraX implementation audit and plan

Baseline: 20 October 2026. Existing Next.js 16.2 App Router, React 19, TypeScript, Tailwind 4, npm, Supabase Auth/PostgREST, Gemini API. Existing Vercel project vendorax_ai, main branch, custom domain vendorax.focusnexuss.com (deployment shown by user; no production writes performed).

## Phase 1 findings

- Existing models inferred from queries and tracked historical SQL: profiles, events, stall_packages, stall_applications. This is not a verified production schema.
- No active SQL migrations, generated database types, storage configuration, payment integration, notification service, inventory constraints, or application tests found.
- Three pre-existing deleted one-time SQL scripts remain untouched. Their execution status is unknown.
- Supabase URL and anon key and Gemini key are configured. No service role key exists locally. Values have not been printed.
- Configured Supabase hostname fails DNS (ENOTFOUND); live schema, policies, storage, auth callbacks and ownership cannot be inspected. Vercel scoped deployment reads previously returned 403.
- Frontend dashboard guards originally rendered unauthorized children before redirects. Sensitive operations are browser database calls; actual protection depends on unverified RLS.
- Booking approval originally updates a status only: no inventory locking, quantity, unique application constraint, payment verification, or booking record.
- Ten linked public destinations return 404. Password recovery and attendee tickets are placeholders. Business dashboard metrics and activity are fabricated. Homepage testimonials, counts, brand claims and payment promises are unverified.
- Initial lint: 19 errors / 24 warnings. QA repairs before this prompt removed lint errors; webpack production build passed. These are baseline checks, not final acceptance of the requested upgrade.

## Controlled implementation plan

1. Audit and document real infrastructure. Keep production read-only. BLOCKED: verify live schema and storage/policies when connection is restored.
2. Replace decorative/fabricated public content with a coherent Pakistani marketplace design; reusable tokens, accessible navigation, URL-based search, real approved events, honest errors and working public information routes.
3. Add provider-supported recovery, server identity verification, role-aware navigation, honest onboarding. Require verified database roles/RLS before claiming authorization complete.
4. Extend organizer workflows only after schema inspection; version-controlled additive migrations for drafts, PKR, media, event rules, inventory and transactional writes. Never silently apply guessed DDL.
5. Replace fake business metrics with actual records; application ownership, tracking and real confirmation states. Build new features behind confirmed backend capabilities.
6. Implement admin permissions, moderation reasons, audit records and in-app notifications with tested policies.
7. Transactional approval/booking with row locks and constraints. Payment provider boundary stays unavailable until real merchant credentials/business rules exist; no simulated payment success.
8. Execute route smoke tests, unit checks, role/ownership/RLS/concurrency tests against a disposable development project, production build, responsive UI QA; preview deployment before production.

## Release gates

No production-ready claim until live schema/policy inspection, role escalation tests, cross-account ownership tests, concurrent inventory tests, and required workflows pass. Missing backend integration must remain visible and documented. Never replace missing event data with seeded events.

## Implementation delivered locally

- Shared marketplace typography, forest-green/cream tokens, responsive navigation and footer, real-photo hero, event cards, city/category directories, FAQ, visitor/organizer/business introductions, and accessible native dialogs.
- Removed active fabricated homepage counters/testimonials/brand endorsements and hardcoded business activity. Preserved old editorial articles as explicitly archived guides without fabricated analytics panels or duplicate headers/footers.
- Approved-event server queries with keyword/city/category/date filters, shareable GET URLs, date sorting, server pagination, bounded upstream requests and visible failure states. Public details show directions, organizer estimates, published packages and a share action. No invented event records.
- Server session validation and role checks on account destinations. Provider-compatible cookie refresh, email callback, recovery routes and onboarding destination. No public admin registration.
- Server endpoints for event submission/editing, profile-name updates, business applications, organizer decisions and pending-event publication. Authenticated identity supplies ownership fields. Client forms cannot set application decisions, event owners or their role through these endpoints.
- Existing schema/status values preserved. No schema DDL or production write was executed. Current APIs still require verified RLS and immutable database roles before release.
- Application and payment states are kept separate; fake Pay Now and ticket-purchase actions removed. Money labels use PKR; existing currency semantics require operator verification.
- Next.js / eslint-config-next upgraded to 16.4.2, unused next-sitemap removed, native sitemap/robots added, source formatted and meaningful unit/smoke scripts added.

## Phase completion limits

Phase 1 is complete for repository inspection, blocked for live schema/storage/policies. Phase 2's public experience is implemented; real-data integration awaits a reachable project. Phase 3's routes/provider integration and Phase 4–6's existing-table workflows have code implementations, but signed-in acceptance, richer role profiles, media, moderation reasons, notifications and independent role permissions remain blocked. Phase 7's inventory/booking/payment infrastructure is NOT implemented. Phase 8's local checks are recorded separately; no deployment has been made.

Do not interpret the amount of implemented UI as completion of all eight phases or acceptance of the production definition of done.
