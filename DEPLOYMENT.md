# HOLBERY — Deployment and Digital Foundation

## Owner-approved activation — 2026-10-06

Production flags are now approved and set true in wrangler.jsonc. No readiness gate is bypassed. Operator: PT Waskita Cakrawarti Digital — Perseroan Perorangan. Legal/contact/support/delivery pages are Indonesian and identify this operator; WhatsApp uses 6285643383832. Planned hello@holbery.id and support@holbery.id routing remains inactive and is explicitly disclosed. Current deployment identifiers and genuine readiness/provider/browser results are authoritative in evidence/release.json. No owner-funded invoice or synthetic customer/order is created. REAL PAYMENT: NOT STARTED; REAL SALE: NOT ACHIEVED until a genuine transaction occurs.

Historical digital product release | VERIFIED on Cloudflare BYOK, 2026-10-06. Source7ab2c1d8665c7bc802aecd5cc680c52c288eab6e, deployment7947ee56-b9e4-4549-b096-75c40d970fa3 at https://7947ee56.webapp-4.pages.dev. Three migrations applied, encrypted merchant/operator secrets installed, private R2 binding active and COMPLETE product published for discovery at99k. Readiness503 now lists ONLY COMMERCIAL_POLICY_APPROVED and COMMERCE_ENABLED. Owner policy approval and an actual customer payment are still required; no production sale is claimed.

Historical commerce foundation release | VERIFIED on Cloudflare BYOK, 2026-10-06. Source13982a9e06ab9058b61af6cf65fe9daa361b20e9; deployment ecc2e40f-1c9b-4a82-b097-6d6bd32b812b at https://ecc2e40f.webapp-4.pages.dev. Both validated D1 migrations are applied. Checkout/payment remains BLOCKED pending human configuration, with COMMERCE_ENABLED=false. The research-toolkit deployment references below are historical.
Primary web apex requires explicit suffix confirmation; one-r holbery naming follows CONTACT-DOMAINS.md. Live host: **https://webapp-4.pages.dev**.

## Evidence and actual scope

Hono + TypeScript + Vite Cloudflare Pages adapter; npm lockfile; PM2 preview port 3000. Ten HTML routes, health API, sitemap/robots, favicon, responsive CSS, SEO/Open Graph metadata, CSP/security headers, public approach hub and contact. Public pages do not expose private project names or registry records. GitHub repository is public, main branch and Issues enabled, verified through GitHub API. Contact uses that real channel; no invented email or nonfunctional form.

Initial deployment: https://b4e7bd9f.webapp-4.pages.dev. Stable host verified by HTTP suite and Chromium. First propagation checks reported TLS/522; stable host subsequently passed all tested pages/assets. Deploy-specific URL is not the preferred canonical. Latest rollout evidence is updated during final integration.

Project name selection: default webapp and webapp-2 collided; webapp-3 was already an unrelated existing project and was not touched. New webapp-4 created. Name saved in cloudflare_project_name metadata. Repository name and brand remain HOLBERY, not webapp-4.

## Custom domain — REQUIRES USER ACTION

Exact holbery.id has no accessible zone and public DNS returned NXDOMAIN at the recorded check. holbery.biz.id is accessible/active with existing DNS/email-routing records. Neither email naming nor zone access authorizes silently choosing/changing the primary website apex. See [CONTACT-DOMAINS.md](CONTACT-DOMAINS.md). Keep Pages origin until full suffix confirmation and safe domain/TLS review. No DNS mutation, transfer, purchase or service deletion.

## Email, social, analytics, GitHub architecture

Current owner-supplied email targets are hello@holbery.id and support@holbery.id; routing is NOT ACTIVE and that status is published. Older incorrect-spelling email designs are superseded. Configure routing and verify delivery before claiming email support works. Email routing alone does not provide an outbound mailbox; outbound replies need an appropriate mail service. Social preferred @holbery remains UNVERIFIED; reserve only after checks. Existing owner/repo reused; no organization or duplicate repo created. Public documentation hub at /docs is curated, not a raw internal-doc mount.

Cloudflare hosting metrics are the initial operational observability channel. Utility measurement is default-off explicit opt-in; no third-party marketing tracker configured. Web Analytics/RUM can be enabled later with explicit data-purpose/consent review; no invented token or fake metric. /api/health supports uptime checks. Privacy page states actual application behavior.

## Reproducible commands

```sh
cd /home/user/webapp
npm ci
npm run typecheck
npm test
npm run build
pm2 start ecosystem.config.cjs
node scripts/check-http.mjs
node scripts/browser-check.mjs
# Only after BYOK setup and metadata/account verification:
npx wrangler whoami
npx wrangler pages deploy dist --project-name webapp-4 --branch main
BASE_URL=https://webapp-4.pages.dev node scripts/check-http.mjs
BASE_URL=https://webapp-4.pages.dev node scripts/browser-check.mjs
```

Never run wrangler login. Credentials live in sandbox environment/Cloudflare secrets, not frontend or git. Commerce now requires the dedicated DB binding holbery-commerce-production and applied migrations. Disabled foundation deployment requires no merchant secrets and MUST keep COMMERCE_ENABLED=false. Enabling checkout requires DUITKU_MERCHANT_CODE, DUITKU_API_KEY and COMMERCE_ADMIN_TOKEN in Pages production secrets, correct environment/origin, and approved commercial policy/product. /api/commerce/readiness returns503 with explicit blockers until the gate is satisfied. npm run deploy uses wrangler.jsonc name; check it against saved metadata before execution. Worker build emits _worker.js/_routes.json; static files are public/static. _headers secures static responses; Hono secureHeaders secures dynamic pages. Explicit catch-all produces real 404s and avoids adapter reliance on private notFoundHandler.

## Rollback / release

Tag or record source commit and deployment URL; rerun tests before release. Roll back to a known successful Pages deployment via dashboard or rebuild a known commit; do not reset/delete current source history. Apply forward migrations with `npx wrangler d1 migrations apply holbery-commerce-production --remote` only after local validation. Never drop production tables; rolling back a Worker does not undo data migrations. Monitor health, render errors, 404s, asset delivery, and certificate status. Browser/HTTP tests do not certify legal readiness, performance SLA or full accessibility conformance.

## Verified final research-toolkit rollout

Source commit 02202ca6617ea139ef2db6bd810676e58188efac, deployed to https://e0e8c8b2.webapp-4.pages.dev; stable https://webapp-4.pages.dev. Production HTTP10 pages/18 targets and Chromium responsive/calculator workflow checks passed. Exact sanitized evidence: [release.json](evidence/release.json). Source commit was pushed and matched GitHub remote main; following documentation-only evidence commit does not change deployed application code.

## Three-utility release

Existing webapp-4 / holbery-commerce-production / PRODUCT_BUCKET are reused; secrets and approved commerce flags preserved. Migration0004 is additive; rollback Worker does not remove event tables or alter commerce records. Commit source before build so embedded Git SHA is truthful. Verify tools/redirect/metadata/privacy with HTTP/browser suites; synthetic events must remain traffic_class=test. Do not create an invoice/customer/order to test utility release. Latest evidence: evidence/utility-release.json, separate from historical commerce release.json.

Authorized weekly operator review: `node scripts/utility-review.mjs 7`; ignored private report, no customer/order/payment queries. Retention cleanup is lazy; monitor actual observations, not fake ninety-day summaries.
