# HOLBERY

Build. Operate. Grow. HOLBERY is the parent commerce infrastructure for SYSTEMS, PRODUCTS, VENTURES and COMMERCE—not a single store or barber application.

## Current execution status — 2026-10-06

- **IMPLEMENTED / VERIFIED locally:** M0 D1 runtime, tenant resolution, request IDs, readiness/errors; M1 canonical catalog; M2 persistent cart and atomic checkout; M3 Duitku adapter, Pop JS integration and verified HTTP callback handler.
- **BLOCKED — HUMAN CONFIGURATION REQUIRED:** production merchant secrets, scoped operator secret, approved first product, commercial/support/privacy/refund terms, and actual payment action.
- **NOT PRODUCTION VERIFIED:** invoice/payment/first sale. Mocked tests are engineering evidence, not revenue or provider acceptance evidence.
- Production checkout is deliberately disabled: `COMMERCE_ENABLED=false`, `COMMERCIAL_POLICY_APPROVED=false`. A disabled foundation release is safe without merchant credentials; an enabled payment release is not.
- Existing informational website, barber calculator and canonical architecture remain intact. Earlier brand Phase0–7 deliverables are historical; they do not prove commerce readiness or customer validation. Phase8–10 branding/scale deliverables are not claimed complete.

## URLs and source

- Production: https://webapp-4.pages.dev
- Direct storefront: https://webapp-4.pages.dev/store/direct
- Readiness: https://webapp-4.pages.dev/api/commerce/readiness
- GitHub: https://github.com/Sparkmind-obp-off/Holbery — existing repository, `main`.
- Actual deploy/source references: [evidence/release.json](evidence/release.json).
- Strategic domain holberry.biz remains unverified. No registration, DNS purchase or canonical-host substitution was performed.

## Canonical references

[HOLBERY-MASTER.md](HOLBERY-MASTER.md), [HOLBERY-LIBRARY.md](HOLBERY-LIBRARY.md), [MASTER-ARCHITECTURE.md](MASTER-ARCHITECTURE.md), [HOLBERY-COMMERCE-ARCHITECTURE.md](HOLBERY-COMMERCE-ARCHITECTURE.md), [commerce/MASTER-COMMERCE-IMPLEMENTATION.md](commerce/MASTER-COMMERCE-IMPLEMENTATION.md), [commerce/FIRST-SALE-SPEC.md](commerce/FIRST-SALE-SPEC.md), [commerce/DUITKU-PRODUCTION.md](commerce/DUITKU-PRODUCTION.md), [commerce/PRODUCTION-EVIDENCE.md](commerce/PRODUCTION-EVIDENCE.md), [commerce/FIRST-PRODUCT.md](commerce/FIRST-PRODUCT.md), [commerce/PRODUCTION-SECRETS.md](commerce/PRODUCTION-SECRETS.md), [DEPLOYMENT.md](DEPLOYMENT.md), [EXECUTION-REPORT.md](EXECUTION-REPORT.md).

Historical archive files remain byte-identical to baseline9babed0. Bozq/Bosku private source, assets, customers and IP have not been imported. No legal clearance or proven commercial demand is asserted.

## Data architecture and integrity

Hono + TypeScript + Cloudflare Pages + dedicated Cloudflare D1 `holbery-commerce-production`, binding `DB`. The real database was created through the authorized BYOK account; its identifier is in wrangler.jsonc, not fabricated. Executable migrations in `migrations/` are authoritative; `commerce/schema.sql` is retained as a historical design, NOT applied to production.

Entities: organizations, brands, storefronts, products, variants, offers, carts/items, customers, orders/items, payments/events, fulfillments, commerce events and short-lived rate counters. Composite foreign keys enforce ownership. Public catalog queries, capabilities and operator queries are storefront-scoped.

Checkout uses a serialized SQLite trigger transaction: validate open cart, publication, variant/offer, price freshness, stock and server total; create immutable item snapshots; reserve stock; close cart; create payment identity and audit event. Customer and order insertion is one D1 batch; failures roll everything back. Duplicate keys return the same order; keys reused for another cart fail. Client totals/prices are rejected.

Cart and order access uses random bearer capabilities. D1 stores only their SHA256 hashes; the browser stores the private capability in session storage, never in URLs. Customer names/email remain in D1, not Git. The scoped operator API requires `COMMERCE_ADMIN_TOKEN` and `ADMIN_STOREFRONT_ID`; no admin token is embedded in frontend code. Cart/checkout creation is rate-limited using hashed requester identifiers in D1; stale windows are removed lazily.

Payments use a provider interface and a separate Duitku adapter. Current official documentation checked 2026-10-06 specifies HMAC-SHA256 for invoice headers, callback and inquiry. The callback HMAC does not cover resultCode, so server inquiry corroborates status, identity, reference and amount before applying a notification. Duplicate events are harmless; PAID never downgrades. Browser success/pending/error/close and redirect queries are UX only. Unknown invoice outcomes are quarantined rather than retried blindly. Reconciliation can recover a reference; it does NOT mark PAID without a verified notification.

Orders progress PENDING_PAYMENT → PAID → PROCESSING → FULFILLED → COMPLETED. Manual cancellation of an unissued or provider-confirmed failed payment releases stock once. Physical-product publication is blocked until shipping/address policy is implemented. Automatic expiry/refunds are not implemented; the schema lists those states but does not offer arbitrary state mutation.

## Functional entry URIs

| URI | Purpose / inputs |
|---|---|
| `/`, `/about`, `/systems`, `/products`, `/ventures`, `/commerce` | Existing parent/pillars; Commerce links to the direct store |
| `/contact`, `/docs`, `/privacy` | Public enquiry/method/data boundaries; never send credentials to GitHub Issues |
| `/systems/barber`, `/downloads/*` | Existing browser-only calculator and blank research templates |
| `/api/health`, `/robots.txt`, `/sitemap.xml` | Existing hosting health/SEO |
| `GET /api/commerce/readiness` | DB/migration/config/product readiness;503 is expected while gated |
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
| `POST .../stores/:slug/admin/orders/:orderId/fulfillment` | Validated PROCESSING/FULFILLED/COMPLETED; fulfilled requires deliveryReference |

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

`check` runs strict TypeScript,53 unit tests, a fresh build,66 integration checks in actual local workerd/D1, then document/archive/secret/whitespace checks. Integration keys/fixtures are generated locally and ALL provider network calls are intercepted. No synthetic product/customer is seeded into production. Checkout concurrency, overselling, duplicate callbacks, signature/amount mismatches, tenant isolation, provider failure, fulfillment and disabled-production gates are covered. Pop's real production iframe/provider acceptance is still NOT PRODUCTION VERIFIED.

## Deployment and human configuration

Only the selected **Cloudflare BYOK** path is used, existing Pages project `webapp-4`, branch `main`. Do not use hosted deployment or unrelated databases. Build embeds the actual release Git SHA; release evidence maps that SHA to the returned Pages deployment identifier. Apply validated migrations remotely before deploying; do not drop/reset production tables. Never run wrangler login or commit `.dev.vars`/credentials.

Owner action required:
1. In Cloudflare dashboard → Workers & Pages → webapp-4 → Settings → Variables and Secrets → Production, set encrypted `DUITKU_MERCHANT_CODE`, `DUITKU_API_KEY` from the actual production Duitku project; set `COMMERCE_ADMIN_TOKEN` to a fresh32-byte random hex value. Do not paste values into chat, GitHub or source.
2. Confirm one deliverable digital/service product, price, available units, fulfillment owner, private support and commercial/privacy/refund terms. Create draft through the protected API, then publish only after approval. No fake first product is selected by the agent.
3. Keep `DUITKU_ENV=production`, `ENVIRONMENT=production`, `PUBLIC_ORIGIN=https://webapp-4.pages.dev`, `ADMIN_STOREFRONT_ID=holbery-direct`. Only after commercial approval set `COMMERCIAL_POLICY_APPROVED=true` and `COMMERCE_ENABLED=true` in the authoritative deployment configuration and redeploy after tests. Missing required secrets forbid an enabled deployment.
4. Verify readiness returns200 with no missing fields; verify provider supports the documented HMAC contract using real merchant credentials. Run one controlled real customer payment, verify the HTTP callback/inquiry, then manual fulfillment and evidence. Never treat browser success as payment truth.

Next priority: configure the real production merchant and approved first product, then verify the first sale. Child storefront/portfolio/distribution/marketplace expansion waits for this proof. Automatic expiry/refunds, operator dashboard UI, shipping and customer recovery workflow remain explicit future work; existing protected APIs are operational primitives, not a complete admin console.
