# HOLBERY Marketplace + Shopee Integration Plan

Status: PLANNED — NOT IMPLEMENTED OR DEPLOYED
Owner intent: build a HOLBERY-owned storefront/marketplace and connect the existing Shopee shop named `holbery`.
Last reviewed: 2026-10-13

## Decision

Continue from the existing HOLBERY Commerce codebase and production Pages/D1/R2 resources. Do not create a disconnected second store or replace the working Direct storefront. Deliver in controlled increments:

1. Marketplace-capable storefront UI and product discovery.
2. Seller/catalog/order data model and owner-operated single-seller MVP.
3. Shopee read-only connection and reconciliation.
4. Only after credentials and API capability are verified: authorized listing/order synchronization.
5. Multi-seller onboarding, commission ledger, and payout controls only after the single-seller flow has real usage evidence.

The existing Direct storefront and Duitku checkout remain canonical for HOLBERY-owned digital products. Marketplace seller checkout and external Shopee checkout must be distinguished clearly; do not imply that Shopee orders are paid through Duitku or vice versa.

## Existing system constraints

- Existing app: `Sparkmind-obp-off/Holbery`, branch `main`.
- Existing production Pages host: `https://webapp-4.pages.dev`.
- Existing D1: `holbery-commerce-production`; existing private R2: `holbery-commerce-products`.
- Existing canonical Direct store, product catalog, cart, checkout, Duitku adapter, private digital delivery and support routes must be preserved.
- Current first-sale scope explicitly excludes seller onboarding, marketplace commissions, split payments, seller settlement/payouts and external marketplace synchronization. This file proposes them as future phases; it does not claim they exist.
- The connected Windsor.ai Shopee account is named `holbery` (account id available in the connected integration). Read attempts failed with a connector-side data extraction error on 2026-10-13. Product/order metrics have therefore not been verified.
- Windsor.ai's Shopee connector exposes reporting data fields (products, orders, settlement, wallet) but no Shopee write actions were listed. Treat it as an analytics/reporting connection, not as a listing/order publishing API.
- Actual Shopee listing/order sync requires authorized Shopee Open Platform API access, app/partner credentials and shop authorization with required scopes. Never put tokens or app secrets in Git, frontend code, or chat.

## MVP product experience

- Home/discovery: category navigation, search, featured items, recently added, transparent seller/store label.
- Product detail: images, description, price, delivery type, seller identity, stock/availability and terms.
- Digital goods: secure private delivery after verified payment; never expose paid source files through public static assets.
- Physical goods: keep purchase disabled until shipping address, shipping price, tracking, cancellation and returns are implemented.
- External Shopee offer: clearly labeled “Beli di Shopee” deep link when available. A link-out is not order synchronization.
- Operator catalog: draft/publish/unpublish, SKU, price, delivery type, seller/store ownership and audit history.
- Data status: show last successful sync time and errors; never silently overwrite a newer manual edit with stale imported data.

## Integration boundaries

### Phase A — Windsor.ai reporting (read-only)

- Reconnect/repair the Windsor.ai Shopee data pull.
- Validate product, order, return, settlement and wallet rows independently.
- Store only necessary aggregate metrics for internal decisions; do not import buyer personal data unless required and approved.
- Mark stale/missing data explicitly. Never use reporting rows as payment authority.

### Phase B — Shopee Open Platform (separate from Windsor)

- Register/verify an eligible Shopee Open Platform app and obtain the approved partner/app credentials.
- Implement server-only OAuth/shop authorization, signed requests, refresh/token rotation and encrypted secret storage.
- Start read-only: shop profile, product listing, stock, order list and order status where scopes permit.
- Add idempotent import, mapping table, pagination, rate limits, retries, audit trail and reconciliation.
- Test in the provider's permitted environment before any production writes.
- Listing creation/updates, stock updates or order actions are disabled until exact scopes, endpoint contracts and seller approval are verified.

### Phase C — Marketplace sellers

- Seller application and owner approval.
- Tenant-scoped seller/store/product ownership and permissions.
- Moderation, terms, privacy, prohibited-goods policy, dispute/return workflow and support.
- Commission ledger and seller statements.
- Payouts only after legal, accounting, payment-provider and reconciliation requirements are settled.
- No split-payment or payout claims until implemented and tested end-to-end.

## Security and correctness gates

- All Shopee credentials remain server-side and encrypted; never expose them to browsers or logs.
- Validate HMAC/signature and server-side provider inquiry where applicable; a browser redirect is never payment proof.
- Use idempotency keys for imports and webhook processing.
- Maintain separate identifiers for HOLBERY order IDs and Shopee order serials.
- Preserve immutable price/order snapshots and event audit records.
- Least-privilege OAuth scopes; owner approval required for writes that alter live listings, stock or orders.
- No mass listing edits, mass delisting, order cancellation or buyer messaging without a preview and explicit approval.
- Never represent a Windsor.ai reporting connection as direct Shopee API authorization.

## Acceptance criteria

- Existing Direct storefront, checkout, Duitku callback verification, private digital delivery, support and utilities continue to pass all current checks.
- Marketplace UI renders from D1-backed records and has no fake inventory, fake sellers or fake sales.
- Each product records its source: HOLBERY, seller-managed, or Shopee-imported; imported records retain external IDs.
- Read-only sync is replay-safe, paginated, rate-limited and observable; sync errors are visible to the operator.
- No listing/order write operation runs until API permissions and the exact target action have been confirmed.
- A real sale or payment is never claimed from mock data, imported order records, or a successful readiness check.

## Current blockers / next executable steps

1. Fix Windsor.ai's Shopee data extraction error and validate the `holbery` account's product/order data.
2. Obtain/verify Shopee Open Platform access and required app credentials privately.
3. Inspect the current application source and migrations before adding marketplace schema/routes; extend existing D1 rather than replacing it.
4. Implement and test the read-only Shopee adapter and marketplace discovery UI in a dedicated branch.
5. Run the full existing test suite and browser checks, review the diff, then deploy only through the authorized Cloudflare BYOK Pages workflow.
6. Keep multi-seller payments/payouts and physical checkout disabled until their end-to-end controls exist.

## Truthful status

As of this document's creation, this is an implementation plan committed to the repository, not a deployed marketplace release. No successful Shopee data import, product sync, order sync, seller onboarding, marketplace commission, or Shopee write operation has been verified.
