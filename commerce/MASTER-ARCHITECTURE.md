# HOLBERY Commerce Platform — Master Architecture

HOLBERY is a parent commerce platform that can own, operate, power, and distribute multiple commerce businesses.

Canonical model: ONE COMMERCE CORE -> MANY STOREFRONTS -> MANY PORTFOLIOS -> MANY CHILD BUSINESSES -> MANY DISTRIBUTION CHANNELS.

## Commerce surfaces
- HOLBERY Direct Store: HOLBERY-owned products/services.
- Portfolio Marketplace: curated discovery across eligible stores or product portfolios.
- Child Storefront: branded commerce surface operated under HOLBERY.
- Embedded Commerce: purchase, upgrade, booking or add-on flows inside systems/products.
- Distribution Network: partner, affiliate, social, campaign, feed and future external marketplace channels.

These are surfaces, not separate commerce engines.

## Domain model
Organization -> Brand -> Storefront -> Catalog -> Product -> Variant -> Offer -> Cart -> Checkout -> Order -> Payment -> Fulfillment.

Supporting domains: Customer, Inventory, Promotion, Refund, Distribution Channel, Attribution, Subscription (later), Seller/Partner (later), Settlement (later).

Every business-critical object carries ownership context. At minimum use organization_id, brand_id and storefront_id where applicable.

## Portfolio model
A portfolio is a curated commercial collection, not another copy of a catalog. One portfolio may contain offers from multiple storefronts while preserving canonical ownership. A child/product can belong to multiple portfolios without duplication.

Example: HOLBERY -> Portfolio A -> Store 1 + Store 2; HOLBERY -> Portfolio B -> Store 3 + Store 4.

## Multi-business levels
Level 1 Managed child: shared HOLBERY core and operations.
Level 2 Independent storefront: separate brand/domain/operations while using HOLBERY Commerce APIs.
Level 3 Graduated business: dedicated runtime/database/payment account when legal, security, economics, scale or operations justify it; compatible APIs/events keep distribution possible.

## Payment
Payment is provider-independent. The payment provider is an adapter; the order model belongs to HOLBERY. Initial adapter: Duitku. Future providers can be added without rewriting catalog/order models. Order is created before payment. Callback verification and idempotency are mandatory.

## Distribution
Canonical offer -> channel -> external listing -> attribution. Channels include HOLBERY Store, Portfolio Marketplace, Child Storefront, Partner, Affiliate, Social and future external marketplaces. Channels never become the source of truth.

## Transaction state
DRAFT -> PENDING_PAYMENT -> PAID -> PROCESSING -> FULFILLED -> COMPLETED.
Alternative paths include EXPIRED, CANCELLED, REFUNDED and FAILED. Every transition creates an immutable commerce event.

## Cloudflare target
Workers + Hono for runtime; D1 for relational commerce state; R2 for media; Queues for asynchronous events/distribution jobs; KV where useful for cache/config; Secrets for payment credentials; Pages or Worker-hosted frontend for storefronts.

Start with one D1 where practical, but keep tenant boundaries explicit so a child can later migrate to a dedicated database.

## Control plane vs commerce plane
Control plane: organizations, brands, children, portfolios, storefront registry, permissions, provider configuration and platform policy.
Commerce plane: catalog, offers, carts, checkout, orders, payments, fulfillment, inventory, customers and promotions.

## API families
/api/catalog/*, /api/storefronts/*, /api/portfolios/*, /api/carts/*, /api/checkout/*, /api/orders/*, /api/payments/*, /api/fulfillment/*, /api/customers/*, /api/distribution/*, /api/platform/*.

## Security
Never identify a child solely from a client-supplied name or URL. Resolve request -> auth/session -> storefront -> organization -> allowed resources. Enforce ownership at query and mutation level. Payment callbacks are verified before state mutation.

## Maturity
C0 Sellable -> C1 Transactional -> C2 Payable -> C3 Operable -> C4 Distributable -> C5 Multi-portfolio -> C6 Partner/Affiliate -> C7 True multi-seller marketplace -> C8 Child federation.

C0-C5 is the recommended commercial core before seller settlement complexity.