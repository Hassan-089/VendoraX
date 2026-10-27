# VendoraX local QA — 20 October 2026

**Status: local upgrade implemented and checked; not accepted as production-ready.** The live Supabase hostname fails DNS lookup, so database-backed acceptance and the remaining schema-dependent phases are blocked. The local production build is running at http://localhost:3000. Nothing has been pushed or deployed.

## Executed checks

| Check                          | Result                                  | Scope                                                                                                                                                                                            |
| ------------------------------ | --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| TypeScript `npm run typecheck` | Passed                                  | Source types; also checked during final build                                                                                                                                                    |
| ESLint `npm run lint`          | Passed, zero errors/warnings            | Updated Next.js 16.4.2 lint configuration                                                                                                                                                        |
| `npm test`                     | 9/9 passed                              | PKR display, Pakistan date boundary, lifecycle dates, safe external links, valid event drafts, invalid calendar dates, attendance validation, decimal-price validation, oversized/missing fields |
| `npm run build`                | Passed                                  | Next.js 16.4.2 webpack production build, all routes and proxy compiled                                                                                                                           |
| `npm run qa`                   | 60/60 passed                            | Local production HTTP requests; exact output in `qa/http-results.json`                                                                                                                           |
| `npm audit --omit=dev`         | Zero findings                           | Production dependency tree only                                                                                                                                                                  |
| Full dependency audit          | 5 high development-only findings remain | Transitive braces/micromatch/fast-glob lint chain; suggested forced downgrade to ESLint config 14 was not applied                                                                                |
| `git diff --check`             | Passed                                  | Whitespace check                                                                                                                                                                                 |

The Node built-in test runner emits a module-type inference warning when importing standalone TypeScript utility files; all nine assertions pass. No test fixtures were inserted into a database.

### HTTP suite breakdown

- 25 public page/metadata requests return 200, including combined filters and repeated query parameters.
- 11 account routes redirect anonymous visitors to `/login` with HTTP 307.
- 3 invalid event/article/organizer routes return HTTP 404.
- 8 malformed AI endpoint requests return HTTP 400 without invoking generation.
- 7 unauthorized mutation/generation requests return HTTP 401.
- 6 cross-origin mutation requests return HTTP 403.

A public route returning 200 with an honest database-unavailable state is **not evidence that live event retrieval or result matching works**. The suite tests rendering, routing and rejection behavior, not signed-in database operations.

### Browser checks executed

- Desktop 1440×1000, tablet 768×1024, mobile 390×844. Inspected screenshots and DOM widths; no horizontal document overflow observed on the tested public screens.
- Narrow header wrapping was reproduced, fixed and rechecked.
- Homepage keyword + city search navigates to the corresponding `/events` URL.
- Category + date + city + keyword filters remain together in the URL; reset clears the URL and fields.
- Supabase connection failure resolves to a visible error and retry link instead of fabricated event cards.
- Business signup URL preselects the business role; clicking organizer updates its pressed state.
- Invalid email input is rejected by the login form's native validation without sending credentials.
- Forgot-password navigation reaches the provider recovery form. No recovery email was sent during testing.
- FAQ disclosure expands to its answer. Mobile menu navigates and closes on route change.
- Mobile assistant opens/closes and has labeled input/send controls without horizontal overflow. No paid AI reply was requested for final browser QA.
- No browser console errors were captured in the final production browser session.

Screenshots: `qa/screenshots/home-desktop.jpg`, `home-desktop-preview.jpg`, `home-mobile.jpg`, `events-tablet.jpg`, `signup-mobile.jpg`.

## Implemented route changes

Existing pages upgraded: `/`, `/events`, `/events/[id]`, `/login`, `/signup`, `/blog`, `/blog/[id]`, `/profile`, `/user/dashboard`, `/business/dashboard`, `/business/applications`, `/organizer/dashboard`, `/organizer/my-events`, `/organizer/create-event`, `/organizer/applications`, `/admin/dashboard`.

Added public/information routes: `/categories`, `/cities`, `/organizers/[id]`, `/for-organizers`, `/for-businesses`, `/about`, `/help`, `/contact`, `/terms`, `/privacy`, `/cookies`, `/sitemap.xml`, `/robots.txt`.

Added account/provider routes: `/forgot-password`, `/reset-password`, `/auth/callback`, `/onboarding`, `/organizer/my-events/[id]/edit`. `/favorites` is protected and explicitly unavailable rather than presenting fake saved records.

Added mutation routes: `/api/events`, `/api/events/[id]`, `/api/applications`, `/api/applications/[id]/decision`, `/api/profile`, `/api/admin/events/[id]`. Existing AI routes now validate inputs, bound requests and restrict description generation to organizer/admin sessions. Per-instance rate limiting is best-effort and needs shared storage before a distributed production guarantee.

## Database and security status

**No migrations were applied, no data was converted, no storage objects were changed and no production writes were executed.** `supabase/audit.sql` is read-only inspection SQL. The three SQL deletions already present when work began have not been restored or treated as applied migrations.

Server layouts verify identity using Supabase `getUser`; mutation routes verify the existing profile role and applicable event/application owner. Owner IDs and decisions are supplied by server logic rather than trusted from a client form. Profile writes allow only the current user's display name. Origin checks reject cross-origin mutations. Anonymous denial was executed; signed-in cross-role and cross-account tests were not possible.

This does not establish database-level protection. The inherited `profiles.role` model and signup trigger must be inspected for escalation, immutable role assignments and safe grants. Direct PostgREST access must enforce ownership and field-level restrictions through verified RLS/privileges.

## Release blockers and next work

1. Restore a reachable development Supabase connection through `.env.local`. Inspect schema, constraints, functions, Auth triggers, role grants, RLS and Storage using the audit script before designing migrations.
2. Test real registration, confirmation, login/recovery, role denial and two-account ownership isolation. Configure allowed Auth callback URLs. No real credentials or accounts were used for successful-login tests.
3. Add version-controlled incremental migrations for role assignments/profiles, package quantities/deadlines/categories, favorites, notifications, booking/history, reports/verification/audit records and private storage as supported by the inspected schema. None of those migrations has been invented or executed against an unknown database.
4. Replace event/package two-insert creation with a transactional operation. The current inherited workflow reports partial package failure and prevents immediate form resubmission, but cannot guarantee atomicity or race-safe account quota enforcement.
5. Add database-backed duplicate constraints and transactional inventory reservation/confirmation. Current sequential checks and compare-and-set application decisions do not prevent concurrent overselling. Booking, withdrawal/cancellation, deadline enforcement and notifications remain incomplete.
6. Complete organizer/business contact onboarding, safe uploads/gallery, draft/review workflows, package editing, private favorites, availability/price/facility search and pagination of account lists. Some account lists currently show at most 100 records; these limits are not full-history exports.
7. Verify all existing package amounts are PKR before deploying their new PKR labels. Values were not converted. Add explicit currency and decimal-safe storage in a verified migration.
8. Configure real support contact information and operator-reviewed legal/retention/account-deletion policies. Current legal pages are operational drafts, not a claim of compliance.
9. Payments are **not implemented**. Choose business rules and verify merchant onboarding/API requirements before integrating a real provider. No payment success, escrow, refund or ticket inventory is simulated.
10. Validate schema-dependent workflows, row-lock concurrency and callbacks against disposable development data. Preview deployment and production access remain pending; previous Vercel scoped API inspection returned 403. Preserve the existing custom domain and production branch.

## Deployment

Local only, running with `npm start`. Existing hosted project: `vendorax_ai`, branch `main`, domain `vendorax.focusnexuss.com` as shown by the user. The local changes have not been committed, pushed, preview-deployed or published to production. Full definition of done is **not met** while the above gates remain.

## Final connection checks

A read-only request to the existing live homepage returned HTTP 200. Its public JavaScript contains the same Supabase hostname configured locally. This confirms the hosted frontend is reachable; it does not establish database availability or successful account workflows.

A Supabase integration is available in the plugin directory but was confirmed **not installed or connected** in this session. Installing and connecting it would allow the actual project/schema to be inspected through supported management APIs; no connection or permissions have been assumed. The next backend step depends on that connection and/or restoring the configured project hostname.
