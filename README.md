# VendoraX

The existing Pakistani event marketplace, upgraded in place. Next.js App Router, React, TypeScript, Tailwind and Supabase remain the application stack. Next.js and its ESLint configuration are now 16.4.2 following a dependency security audit.

## Run locally

Use Node.js 22.6+ (Node 24 is used for the local checks), then:

```sh
npm ci
# Configure the keys listed in .env.example in .env.local; never commit real values.
npm run dev
```

Open http://localhost:3000. Development and production builds explicitly use webpack because the earlier Turbopack build failed in the Windows workspace path. Production mode:

```sh
npm run build
npm start
```

## Checks

```sh
npm run typecheck
npm run lint
npm test
npm run qa  # Requires a running local server. Only public reads and unauthorized/invalid API requests.
npm audit --omit=dev
```

`qa/http-results.json` is overwritten with actual HTTP check results. Unit fixtures are not inserted into a database. Browser checks do not create real accounts, events, applications or payments.

## Configuration

- `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`: existing project connection. Supabase must be reachable.
- `GEMINI_API_KEY`: optional server-only AI integration. The description endpoint requires an organizer/admin session. Never expose this key in public variables.
- `NEXT_PUBLIC_SITE_URL`: canonical site origin for sitemap and robots (existing domain is the default).
- `NEXT_PUBLIC_SUPPORT_EMAIL` / `NEXT_PUBLIC_SUPPORT_WHATSAPP`: optional verified support channels. No made-up email address or number is used.
- Supabase Auth redirect allowlist must include the local and approved deployed `/auth/callback` URLs. Recovery uses `/auth/callback?next=/reset-password`.
- No service-role key is needed or used by the app. Session-bearing server queries use the anonymous project key plus the verified user's session and are subject to RLS.

## Current workflows

- Public browsing uses approved upcoming/ongoing records, backend keyword/city/category/date filters and pagination. Filters remain in the URL.
- Visitors can view event details, directions, real stall packages, organizer estimates and organizer event listings.
- Auth supports registration roles, email-confirmation messaging, login, logout and password recovery UI/provider integration.
- Protected server layouts verify identity and the existing database role. Server routes check record ownership for application decisions and event editing. Profile updates permit only display-name changes.
- Organizer event creation preserves the existing pending-review workflow and five-event account limit. New submissions validate fields server-side. Pending event edits are restricted when applications exist. Administrator approval publishes a pending event.
- Business applications use server-verified identity. A sequential duplicate check and handling of existing unique constraints are included; race-safe uniqueness still requires a verified database constraint.
- Application approval is **not** booking confirmation, inventory reservation or payment. No online payments are enabled.

## Database safety and incomplete capabilities

The configured Supabase hostname failed DNS during this work. No live schema, RLS, role immutability, storage, trigger, concurrency or signed-in flow has been verified. No migrations or production data mutations have been performed. `supabase/audit.sql` is read-only inspection SQL, **not a migration**.

Do not deploy as production-ready until the live schema/policies have been inspected and development integration tests pass. Current role checks still depend on the existing `profiles.role` model; this must be immutable to ordinary users at database level. Direct PostgREST access must enforce the same ownership and field restrictions as server APIs.

Event and package creation currently uses the inherited two-insert workflow. Partial package failure is reported honestly and the form prevents immediate resubmission; a verified transactional RPC is still required. The five-event quota and duplicate application checks are not concurrency guarantees.

Inventory quantities/reservations, transactional booking, cancellation/withdrawal, notification/audit records, verification records, private media uploads, role-specific onboarding profiles, database-backed favorites, advanced stall filters and payments require schema work. Their controls are not presented as working integrations. Support contact details and operator-approved legal content are also release gates.

The provider must confirm existing package prices are actually denominated in PKR before deploying the PKR display. No financial records were converted.

See `docs/IMPLEMENTATION.md` for the audit and phase plan and `docs/QA.md` for verified checks and remaining release gates. Nothing has been pushed or deployed to Vercel during this work.
