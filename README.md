# HOLBERY

Build. Operate. Grow. HOLBERY is the parent commerce infrastructure for SYSTEMS, PRODUCTS, VENTURES and COMMERCE—not a single store or barber application.

## Current execution status — 2026-10-06

- **IMPLEMENTED / VERIFIED locally:** M0 D1 runtime, tenant resolution, request IDs, readiness/errors; M1 canonical catalog; M2 persistent cart and atomic checkout; M3 Duitku adapter, Pop JS integration and verified HTTP callback handler.
- **VERIFIED:** the actual Barber Revenue Starter System COMPLETE package, version BRS-2026-V1: one integrated9-tab Excel workbook,9 PDFs and editable SOP/WhatsApp text. LibreOffice recalculation passed18 expected results with no formula errors; ledger/customer rows are blank. Original paid-product files/build sources are private, not served as public static assets or committed to the repository.
- **VERIFIED:** supplied real merchant secrets and a newly generated COMMERCE_ADMIN_TOKEN are encrypted in Pages production. Authenticated read-only Duitku production method discovery returnedHTTP200 / responseCode00 /18 methods; this is NOT invoice or payment verification.
- **OWNER APPROVED:** commercial/support/refund/privacy/delivery policies and production activation. Operator: PT Waskita Cakrawarti Digital — Perseroan Perorangan. WhatsApp: 0856 4338 3832. Planned hello@holbery.id and support@holbery.id are not routed yet; pages explicitly disclose that. No repeated policy approval or owner-funded transaction is required.
- **NOT PRODUCTION VERIFIED:** invoice/payment/first sale. Mocked tests are engineering evidence, not revenue or provider acceptance evidence.
- Production configuration enables `COMMERCE_ENABLED=true`, `COMMERCIAL_POLICY_APPROVED=true`; all credential, tenant, catalog and private delivery readiness gates remain enforced. Readiness success is `READY`, not evidence of payment. Final deployed verification is recorded in evidence/release.json. Owner test spending: Rp0. No invoice or fictitious customer is created for activation tests.
- Existing informational website, barber calculator and canonical architecture remain intact. Earlier brand Phase0–7 deliverables are historical; they do not prove commerce readiness or customer validation. Productization/portfolio/scale frameworks now exist; operational/commercial maturity is not claimed. See current ROADMAP.

## URLs and source

- Production: https://webapp-4.pages.dev
- Direct storefront: https://webapp-4.pages.dev/store/direct
- Readiness: https://webapp-4.pages.dev/api/commerce/readiness
- GitHub: https://github.com/Sparkmind-obp-off/Holbery — existing repository, `main`.
- Actual deploy/source references: [evidence/release.json](evidence/release.json).
- Ejaan domain: holbery (satu r). Email: hello@holbery.id / support@holbery.id, routing belum aktif. Full website apex requires suffix confirmation; keep the verified Pages host. Exact domain facts: [CONTACT-DOMAINS.md](CONTACT-DOMAINS.md).

## Current strategic direction — BRAND-FIRST + INTERNAL INTELLIGENCE FIRST

HOLBERY remains a **brand-first, proof-driven, commerce-backed** parent company. Its products, systems, ventures, and commerce must compound under one identity.

The execution order is now **INTERNAL INTELLIGENCE → EVIDENCE GATE → CONTROLLED EXTERNAL MARKET TEST → MEASURED LEARNING**. HOLBERY will build a private Intelligence OS for authorized digital demand discovery, source-backed evidence, opportunity scoring, decision records, offer preparation, and experiment learning. External distribution is activated only after a documented opportunity gate; it is not blind mass posting. Digital evidence can justify a test, but does not alone prove willingness to pay.

Primary strategy documents:
- [HOLBERY-BRAND-FIRST-MASTER.md](strategy/HOLBERY-BRAND-FIRST-MASTER.md)
- [HOLBERY-PRODUCT-DIRECTION.md](strategy/HOLBERY-PRODUCT-DIRECTION.md)
- [HOLBERY-EVIDENCE-FRAMEWORK.md](strategy/HOLBERY-EVIDENCE-FRAMEWORK.md)
- [HOLBERY-OPERATING-ROADMAP.md](strategy/HOLBERY-OPERATING-ROADMAP.md)
- [HOLBERY-PRODUCT-EVIDENCE-LEDGER.md](strategy/HOLBERY-PRODUCT-EVIDENCE-LEDGER.md)
- [HOLBERY-INTELLIGENCE-OS-ARCHITECTURE.md](strategy/HOLBERY-INTELLIGENCE-OS-ARCHITECTURE.md)

## Canonical references

[HOLBERY-MASTER.md](HOLBERY-MASTER.md), [HOLBERY-LIBRARY.md](HOLBERY-LIBRARY.md), [MASTER-ARCHITECTURE.md](MASTER-ARCHITECTURE.md), [HOLBERY-COMMERCE-ARCHITECTURE.md](HOLBERY-COMMERCE-ARCHITECTURE.md), [commerce/MASTER-COMMERCE-IMPLEMENTATION.md](commerce/MASTER-COMMERCE-IMPLEMENTATION.md), [commerce/FIRST-SALE-SPEC.md](commerce/FIRST-SALE-SPEC.md), [commerce/DUITKU-PRODUCTION.md](commerce/DUITKU-PRODUCTION.md), [commerce/PRODUCTION-EVIDENCE.md](commerce/PRODUCTION-EVIDENCE.md), [commerce/FIRST-PRODUCT.md](commerce/FIRST-PRODUCT.md), [commerce/PRODUCTION-SECRETS.md](commerce/PRODUCTION-SECRETS.md), [DEPLOYMENT.md](DEPLOYMENT.md), [EXECUTION-REPORT.md](EXECUTION-REPORT.md).

Historical archive files remain byte-identical to baseline9babed0. Bozq/Bosku private source, assets, customers and IP have not been imported. No legal clearance or proven commercial demand is asserted.

## Data architecture and integrity

Hono + TypeScript + Cloudflare Pages + dedicated Cloudflare D1 `holbery-commerce-production`, binding `DB`. The real database was created through the authorized BYOK account; its identifier is in wrangler.jsonc, not fabricated. Executable migrations in `migrations/` are authoritative; `commerce/schema.sql` is retained as a historical design, NOT applied to production.

Entities: organizations, brands, storefronts, products, variants, offers, carts/items, customers, orders/items, payments/events, fulfillments, commerce events, rate counters, product/order delivery assets, download receipts and private support requests. Product assets live in a dedicated private R2 bucket bound as PRODUCT_BUCKET. Asset version, SHA256, bytes and policy versions are pinned at checkout; paid customer downloads verify bytes before delivery. Download preparation advances PAID→PROCESSING→FULFILLED, and explicit customer acknowledgement of the matching package completes the order. No browser acknowledgement changes payment truth. Digital orders cannot be completed through the legacy manual-fulfillment route. Composite foreign keys enforce ownership. Public catalog queries, capabilities and operator queries are storefront-scoped.

Checkout uses a serialized SQLite trigger transaction: validate open cart, publication, variant/offer, price freshness, stock and server total; create immutable item snapshots; reserve stock; close cart; create payment identity and audit event. Customer and order insertion is one D1 batch; failures roll everything back. Duplicate keys return the same order; keys reused for another cart fail. Client totals/prices are rejected.

Cart and order access uses random bearer capabilities. D1 stores only their SHA256 hashes; the browser stores the private capability in session storage, never in URLs. Customer names/email remain in D1, not Git. The scoped operator API requires `COMMERCE_ADMIN_TOKEN` and `ADMIN_STOREFRONT_ID`; no admin token is embedded in frontend code. Cart/checkout creation is rate-limited using hashed requester identifiers in D1; stale windows are removed lazily.

Payments use a provider interface and a separate Duitku adapter. Current official documentation checked 2026-10-06 specifies HMAC-SHA256 for invoice headers, callback and inquiry. The callback HMAC does not cover resultCode, so server inquiry corroborates status, identity, reference and amount before applying a notification. Duplicate events are harmless; PAID never downgrades. Browser success/pending/error/close and redirect queries are UX only. Unknown invoice outcomes are quarantined rather than retried blindly. Reconciliation can recover a reference; it does NOT mark PAID without a verified notification.

Orders progress PENDING_PAYMENT → PAID → PROCESSING → FULFILLED → COMPLETED. Manual cancellation of an unissued or provider-confirmed failed payment releases stock once. Physical-product publication is blocked until shipping/address policy is implemented. Automatic expiry/refunds are not implemented; the schema lists those states but does not offer arbitrary state mutation.

## Functional entry URIs

| URI | Purpose / inputs |
|---|---|
| `/`, `/about`, `/systems`, `/products`, `/ventures`, `/commerce` | Existing parent/pillars; Commerce links to the direct store |
| `/contact`, `/docs`, `/privacy` | Operator contact/method/data boundaries; WhatsApp and email-routing disclosure |
| `/legal`, `/terms/commerce`, `/refund/commerce`, `/support/commerce`, `/delivery/commerce`, `/license/commerce` | Approved Indonesian digital-commerce policies and private order support |
| `/tools`, `/tools/templates`, `/tools/barber/daily-close`, `/tools/barber/target-omzet`, `/tools/barber/break-even` | Three Indonesian free calculators and blank templates; no signup, browser-only values |
| `/systems/barber` |301 canonical redirect to Daily Close |
| `POST /api/field-events` | Explicit opt-in strict anonymous envelope; unknown/PII/value/payment fields rejected |
| `GET /api/field-events/review?days=7` | Existing admin bearer; production-only session aggregates, days1–30 |
| `/api/health`, `/robots.txt`, `/sitemap.xml` | Existing hosting health/SEO |
| `GET /api/commerce/readiness` | DB/migration/config/product/private-asset readiness;200 READY only when every check passes, otherwise503 with exact blockers |
| `GET /store/:slug`, `/store/:slug/products/:productSlug` | Canonical database-backed catalog; `slug=direct` initially |
| `GET /api/commerce/stores/:slug/products[/:productSlug]` | Published catalog/variants/offers |
| `POST .../stores/:slug/admin/products` | Create draft product+variant+offer; name, slug, description, type, sku, variantName, stock, priceIdr |
| `GET .../stores/:slug/admin/products` | Operator catalog including drafts |
| `PATCH .../stores/:slug/admin/products/:id` | Name/description and draft/published state |
| `PATCH .../stores/:slug/admin/offers/:id` | Price and active/inactive |
| `PATCH .../stores/:slug/admin/variants/:id` | Name, available stock and active/inactive |
| `POST .../stores/:slug/carts` | Create private persistent cart; returns capability once |
| `GET .../stores/:slug/carts/:cartId` | Private cart; Authorization bearer required |
| `PUT .../stores/:slug/carts/:cartId/items` | offerId, quantity; server owns price |
| `DELETE .../stores/:slug/carts/:cartId/items/:offerId` | Remove item from open cart |
| `POST .../stores/:slug/checkouts` | cartId, name, email, consent; private bearer + Idempotency-Key required |
| `GET .../stores/:slug/orders/:orderId` | Private snapshot/server status |
| `POST .../stores/:slug/orders/:orderId/payments` | Server-only invoice creation; scoped alternative to the conceptual unscoped create endpoint |
| `POST /api/commerce/payments/duitku/callback` | Form-encoded server notification, verified signature plus provider inquiry |
| `/checkout/:orderId`, `/orders/:orderId` | Private session-backed customer UX/Pop JS; URL alone reveals no customer data |
| `GET .../stores/:slug/admin/orders` | Scoped operational order/payment list |
| `GET .../stores/:slug/admin/orders/:orderId/evidence` | Controlled non-PII order/payment/fulfillment/timeline evidence |
| `POST .../stores/:slug/admin/orders/:orderId/reconcile` | Authenticated provider inquiry/reference recovery; no unverified paid mutation |
| `POST .../stores/:slug/admin/orders/:orderId/cancel` | Safe unpaid cancellation; unknown/pending invoices require reconciliation |
| `POST .../stores/:slug/admin/orders/:orderId/fulfillment` | Legacy manual service fulfillment; rejected for versioned digital orders |
| `PUT .../stores/:slug/admin/variants/:id/digital-delivery` | Verify private R2 bytes/SHA and attach versioned delivery/policies |
| `GET .../stores/:slug/orders/:id/download/:variantId` | Private bearer, verified PAID entitlement, matching immutable asset only |
| `POST .../stores/:slug/orders/:id/delivery-confirmation` | Record matching customer package receipt; complete only fulfilled/paid order |
| `/terms/commerce`, `/refund/commerce`, `/support/commerce` | Approved policies and real private ticket channel |
| `GET/POST .../stores/:slug/orders/:id/support` | Private order-scoped ticket history/submission |
| `GET .../stores/:slug/admin/support`, `PATCH .../admin/support/:id` | Scoped operator inbox/replies; no automatic email or unapproved SLA |

In the table, `...` means `/api/commerce`. Operator routes use a separately configured bearer token scoped to HOLBERY Direct, not a customer capability. Database IDs and product IDs are server-generated, never client identities.

## Reproducible tests and preview

```sh
cd /home/user/webapp
npm ci
npm run check
npx wrangler d1 migrations apply holbery-commerce-production --local
fuser -k 3000/tcp 2>/dev/null || true
pm2 start ecosystem.config.cjs
npm run test:http
node scripts/browser-check.mjs
```

`check` runs strict TypeScript, unit tests, a fresh build,75 integration checks in actual local workerd/D1, utility Worker/D1 integration, then document/archive/secret/whitespace checks. Integration keys/fixtures are generated locally and ALL provider network calls are intercepted. No synthetic product/customer is seeded into production. Checkout concurrency, overselling, duplicate callbacks, signature/amount mismatches, tenant isolation, provider failure, fulfillment and disabled-production gates are covered. The real production Pop JS module loaded in Chromium and exposes checkout.process; no invented reference was passed. Invoice issuance, payment modal transaction acceptance and genuine paid callback/inquiry remain NOT STARTED.

## Deployment and human configuration

Only the selected **Cloudflare BYOK** path is used, existing Pages project `webapp-4`, branch `main`. Do not use hosted deployment or unrelated databases. Build embeds the actual release Git SHA; release evidence maps that SHA to the returned Pages deployment identifier. Apply validated migrations remotely before deploying; do not drop/reset production tables. Never run wrangler login or commit `.dev.vars`/credentials.

Activation and production deployment are verified in evidence/release.json. Readiness is HTTP200 / READY with no missing gates. Source93ef3175008ab5f49602733946d7d2e5cc5074bf is deployed BYOK as13e89b59-e1f5-4a9e-a54f-75c38493058f. Both approved flags are true; production credentials/private R2 remain protected. No fake customer/order/invoice/payment was created. The cart/stock statement in that historical release is not a current inventory or customer-count assertion.

Use the product page to select a license, review the server-priced cart, and enter your own name/email and consent only for a genuine purchase. The real buyer may then open Duitku Pop, pay, wait for server verification, download the private package and acknowledge receipt. No owner-funded test is requested. Server snapshots/callback+inquiry remain the authority.

Owner-managed follow-up: configure and verify email routing for the supplied addresses before announcing email support is active. Cloudflare Email Routing forwards incoming mail; an outbound mailbox/reply service is separate. WhatsApp and private order tickets are already published. COMMERCE_ADMIN_TOKEN is additional operator authentication; replace it through Cloudflare with a privately retained value if direct operator API access is needed. Rotate credentials through provider/Cloudflare rather than pasting replacements into chat. This is security hygiene, not another approval gate.

ZERO-COST PRODUCTION VERIFICATION COMPLETE. FINAL PAID-STATE VERIFICATION REQUIRES A GENUINE CUSTOMER PAYMENT. REAL PAYMENT: NOT STARTED. REAL SALE: NOT ACHIEVED. Actual invoice issuance, paid notification/inquiry and paid download cannot be claimed production verified without that transaction. Automatic expiry/refunds, operator dashboard UI, shipping, automatic email delivery and self-service customer recovery remain unimplemented. Operator-reviewed recovery/support and protected APIs are present. Child/marketplace expansion waits for real proof.

## Free utility release and weekly operation — 2026-10-06

Latest strategy: [utility-first lock](strategy/HOLBERY-FREE-UTILITY-ORGANIC-GROWTH.md). Daily Close, Target Omzet and Break-even are the only three initial tools. One intent per page, Indonesian formulas/limitations/FAQ, clean sharing URLs, relevant optional existing-product CTA. Blank CSVs are not the private paid operating package.

Measurement is OFF by default. Explicit session opt-in; DNT/GPC respected. Values/results stay in browser. Random tab session expires in30 minutes, SHA256 hash only in D1. Sessions are not unique humans or cross-day retention. Separate production/test traffic, UUID deduplication and80/minute cap. Ledger30-day/aggregates90-day retention uses lazy request cleanup, so dormancy may delay deletion. Migration0004 adds three utility tables to the existing DB; no new checkout/database. See [event SSOT](execution/HOLBERY-FIELD-EVENT-SSOT.md).

Use a tool without opting in; enter your own numbers and review assumptions. Opt in only if you want anonymous step measurement, and disable anytime. No tool inputs or results in copy-link sharing.

Owner can publish [Instagram/TikTok/Threads drafts](strategy/HOLBERY-ORGANIC-CONTENT-LOOP.md). They are not published posts. Start the observation window at actual publication. Authorized BYOK operator: `node scripts/utility-review.mjs 7`, writes ignored private aggregate report; use [UTILITY-REVIEW-TEMPLATE.md](UTILITY-REVIEW-TEMPLATE.md) and `/downloads/utility-weekly-review.csv`. Empty denominator = unavailable, not0% conversion. Real usage/90-day outcomes are not asserted.

Additional checks: `node scripts/utility-browser.mjs`; `npm run test:field-events`. Latest utility release evidence is recorded separately in `evidence/utility-release.json` after deployment; existing commerce evidence is preserved. Future Pricing/Snapshot and other verticals remain candidates. Email activation, domain binding, social publishing, real payment/outcome and repeated economics remain separate actions/evidence gates.

### Verified utility rollout

Production https://webapp-4.pages.dev/tools; source70d4e5651150ffd0f0fffb99ccb910124840e8ab, BYOK deployment5a480bc9-ff81-4acc-a3ac-d136233df280. Matching release SHA/readiness verified on stable and deployment-specific origins. Production HTTP21 pages/34 targets, both browser suites and six privacy/auth negative checks pass. Unit113 / commerce integration75 / field integration10; audit0 vulnerabilities. Actual release record: [evidence/utility-release.json](evidence/utility-release.json). Subsequent documentation/evidence-only commit does not change the deployed runtime. Initial opt-in utility baseline has no production step sessions;31 synthetic test events excluded. This is not a completed usage period or proof about actual customers/sales.
