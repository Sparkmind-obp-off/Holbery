# HOLBERY

Build. Operate. Grow. HOLBERY is the parent commerce infrastructure for SYSTEMS, PRODUCTS, VENTURES and COMMERCE—not a single store or barber application.

## Current execution status — 2026-10-06

- **IMPLEMENTED / VERIFIED locally:** M0 D1 runtime, tenant resolution, request IDs, readiness/errors; M1 canonical catalog; M2 persistent cart and atomic checkout; M3 Duitku adapter, Pop JS integration and verified HTTP callback handler.
- **VERIFIED:** the actual Barber Revenue Starter System COMPLETE package, version BRS-2026-V1: one integrated9-tab Excel workbook,9 PDFs and editable SOP/WhatsApp text. LibreOffice recalculation passed18 expected results with no formula errors; ledger/customer rows are blank. Original paid-product files/build sources are private, not served as public static assets or committed to the repository.
- **VERIFIED:** supplied real merchant secrets and a newly generated COMMERCE_ADMIN_TOKEN are encrypted in Pages production. Authenticated read-only Duitku production method discovery returnedHTTP200 / responseCode00 /18 methods; this is NOT invoice or payment verification.
- **OWNER APPROVED:** commercial/support/refund/privacy/delivery policies and production activation. Operator: PT Waskita Cakrawarti Digital — Perseroan Perorangan. WhatsApp: 0856 4338 3832. Planned hello@helloberry.biz.id and support@helloberry.biz.id are not routed yet; pages explicitly disclose that. No repeated policy approval or owner-funded transaction is required.
- **NOT PRODUCTION VERIFIED:** invoice/payment/first sale. Mocked tests are engineering evidence, not revenue or provider acceptance evidence.
- Production configuration enables `COMMERCE_ENABLED=true`, `COMMERCIAL_POLICY_APPROVED=true`; all credential, tenant, catalog and private delivery readiness gates remain enforced. Readiness success is `READY`, not evidence of payment. Final deployed verification is recorded in evidence/release.json. Owner test spending: Rp0. No invoice or fictitious customer is created for activation tests.
- Existing informational website, barber calculator and canonical architecture remain intact. Earlier brand Phase0–7 deliverables are historical; they do not prove commerce readiness or customer validation. Phase8–10 branding/scale deliverables are not claimed complete.

## URLs and source

- Production: https://webapp-4.pages.dev
- Direct storefront: https://webapp-4.pages.dev/store/direct
- Readiness: https://webapp-4.pages.dev/api/commerce/readiness
- GitHub: https://github.com/Sparkmind-obp-off/Holbery — existing repository, `main`.
- Actual deploy/source references: [evidence/release.json](evidence/release.json).
- Strategic domain holberry.biz remains unverified. No registration, DNS purchase or canonical-host substitution was performed.

## Current strategic direction — BRAND-FIRST\n\nHOLBERY is now governed by a **brand-first, proof-driven, commerce-backed** strategy. The brand is the primary long-term asset; products create value and evidence; commerce converts value into real economics; distribution is a secondary acquisition capability.\n\nPrimary strategy documents:\n- [strategy/HOLBERY-BRAND-FIRST-MASTER.md](strategy/HOLBERY-BRAND-FIRST-MASTER.md)\n- [strategy/HOLBERY-PRODUCT-DIRECTION.md](strategy/HOLBERY-PRODUCT-DIRECTION.md)\n- [strategy/HOLBERY-EVIDENCE-FRAMEWORK.md](strategy/HOLBERY-EVIDENCE-FRAMEWORK.md)\n- [strategy/HOLBERY-OPERATING-ROADMAP.md](strategy/HOLBERY-OPERATING-ROADMAP.md)\n- [strategy/HOLBERY-PRODUCT-EVIDENCE-LEDGER.md](strategy/HOLBERY-PRODUCT-EVIDENCE-LEDGER.md)\n\nThe distribution engine remains available as a **secondary / optional capability**, not the primary strategic direction.\n\n## Canonical references

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
| `/systems/barber`, `/downloads/*` | Existing browser-only calculator and blank research templates |
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

`check` runs strict TypeScript,53 unit tests, a fresh build,75 integration checks in actual local workerd/D1, then document/archive/secret/whitespace checks. Integration keys/fixtures are generated locally and ALL provider network calls are intercepted. No synthetic product/customer is seeded into production. Checkout concurrency, overselling, duplicate callbacks, signature/amount mismatches, tenant isolation, provider failure, fulfillment and disabled-production gates are covered. The real production Pop JS module loaded in Chromium and exposes checkout.process; no invented reference was passed. Invoice issuance, payment modal transaction acceptance and genuine paid callback/inquiry remain NOT STARTED.

## Deployment and human configuration

Only the selected **Cloudflare BYOK** path is used, existing Pages project `webapp-4`, branch `main`. Do not use hosted deployment or unrelated databases. Build embeds the actual release Git SHA; release evidence maps that SHA to the returned Pages deployment identifier. Apply validated migrations remotely before deploying; do not drop/reset production tables. Never run wrangler login or commit `.dev.vars`/credentials.

Activation and production deployment are verified in evidence/release.json. Readiness is HTTP200 / READY with no missing gates. Source93ef3175008ab5f49602733946d7d2e5cc5074bf is deployed BYOK as13e89b59-e1f5-4a9e-a54f-75c38493058f. Both approved flags are true; production credentials/private R2 remain protected. No fake customer/order/invoice/payment was created. Two anonymous technical carts were left empty after zero-cost cart checks; stock remains100.

Use the product page to select a license, review the server-priced cart, and enter your own name/email and consent only for a genuine purchase. The real buyer may then open Duitku Pop, pay, wait for server verification, download the private package and acknowledge receipt. No owner-funded test is requested. Server snapshots/callback+inquiry remain the authority.

Owner-managed follow-up: configure and verify email routing for the supplied addresses before announcing email support is active. Cloudflare Email Routing forwards incoming mail; an outbound mailbox/reply service is separate. WhatsApp and private order tickets are already published. COMMERCE_ADMIN_TOKEN is additional operator authentication; replace it through Cloudflare with a privately retained value if direct operator API access is needed. Rotate credentials through provider/Cloudflare rather than pasting replacements into chat. This is security hygiene, not another approval gate.

ZERO-COST PRODUCTION VERIFICATION COMPLETE. FINAL PAID-STATE VERIFICATION REQUIRES A GENUINE CUSTOMER PAYMENT. REAL PAYMENT: NOT STARTED. REAL SALE: NOT ACHIEVED. Actual invoice issuance, paid notification/inquiry and paid download cannot be claimed production verified without that transaction. Automatic expiry/refunds, operator dashboard UI, shipping, automatic email delivery and self-service customer recovery remain unimplemented. Operator-reviewed recovery/support and protected APIs are present. Child/marketplace expansion waits for real proof.
