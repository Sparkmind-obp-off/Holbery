# HOLBERY MASTER COMMERCE IMPLEMENTATION

## Mission

Turn HOLBERY from a documented parent commerce architecture into a production-grade commerce platform that can execute real transactions and later support multiple owned businesses, child businesses, portfolios, storefronts, and distribution channels without rebuilding the commerce core.

## Locked product direction

HOLBERY is a parent commerce platform.

The platform owns one canonical commerce core and can expose many customer-facing surfaces:

- HOLBERY direct store
- portfolio marketplaces
- child storefronts
- embedded commerce
- distribution channels

The first milestone is NOT an open marketplace.

The first milestone is one verified production sale.

## Master transaction loop

DISCOVER
-> PRODUCT
-> CART
-> CHECKOUT
-> ORDER
-> DUITKU CREATE INVOICE
-> DUITKU REFERENCE
-> DUITKU POP JS
-> HTTP CALLBACK
-> VERIFIED PAYMENT
-> PAID ORDER
-> FULFILLMENT
-> COMPLETION
-> EVIDENCE

## Payment architecture

Duitku Pop JS is the customer-facing payment experience.

Server responsibilities:

1. Validate the HOLBERY cart and checkout.
2. Create the HOLBERY order before contacting Duitku.
3. Generate a unique merchantOrderId.
4. Calculate and persist the authoritative amount and item snapshot.
5. Call the Duitku production Create Invoice API.
6. Persist the returned Duitku reference/payment data.
7. Return only the required reference/payment information to the browser.
8. Let the browser call Duitku Pop JS checkout.process(reference, options).
9. Receive the Duitku HTTP callback server-side.
10. Verify callback authenticity using the current documented signature mechanism.
11. Idempotently persist the payment event.
12. Transition payment/order state only from verified server-side evidence.
13. Reconcile uncertain states using provider inquiry/status where required.

The browser JS callbacks are UX signals only. They must never mutate payment or order truth.

Production Duitku JS:
https://app-prod.duitku.com/lib/js/duitku.js

Production Create Invoice endpoint:
https://api-prod.duitku.com/api/merchant/createInvoice

Production secrets:
- DUITKU_MERCHANT_CODE
- DUITKU_API_KEY

Secrets must exist only in Cloudflare production secret/binding configuration.

## Implementation layers

### M0 — Runtime foundation

- Cloudflare runtime configuration
- D1 production binding
- migration process
- environment validation
- typed environment contract
- tenant/storefront resolution
- structured API errors
- request correlation
- safe logging

Exit condition:
The commerce runtime can connect to the production D1 database and resolve a storefront safely.

### M1 — Catalog

- organization
- brand
- storefront
- product
- product variant
- offer
- publication state
- canonical product URL
- catalog read APIs
- operator CRUD

Exit condition:
One approved product is published and purchasable from the canonical storefront.

### M2 — Transaction

- cart
- cart items
- checkout validation
- authoritative pricing
- stock policy
- order creation
- idempotency
- order state machine
- immutable item/price snapshots
- commerce events

Exit condition:
A checkout creates exactly one durable order for a given idempotency key.

### M3 — Duitku Pop JS

- provider-neutral payment interface
- Duitku production adapter
- Create Invoice request
- reference persistence
- Pop JS frontend integration
- payment page state
- HTTP callback endpoint
- signature verification
- duplicate callback handling
- success/pending/failure mapping
- inquiry/reconciliation
- audit events

Exit condition:
A real production payment can be initiated and verified server-side.

### M4 — Operations

- protected order list
- order detail
- payment timeline
- fulfillment creation
- fulfillment completion
- customer record
- cancellation
- refund record
- inventory adjustment
- operational event timeline

Exit condition:
A paid order can be fulfilled and closed operationally.

### M5 — Child commerce

- child organization/brand/storefront registry
- child-scoped catalog
- child-scoped orders
- permissions
- child payment policy
- child fulfillment policy
- domain mapping

Exit condition:
Two storefronts can transact through the same core without cross-tenant data access.

### M6 — Portfolio marketplace

- portfolio entity
- portfolio membership
- canonical product references
- unified discovery
- merchandising
- portfolio attribution

Exit condition:
Multiple storefronts/products can be discovered through one HOLBERY portfolio without duplicating canonical commerce objects.

### M7 — Distribution

- channel registry
- external listing mapping
- share links
- attribution
- feeds/export
- partner/affiliate capability

Exit condition:
One canonical offer can be distributed to multiple channels while HOLBERY remains source of truth.

### M8 — True marketplace, only if demanded

- seller onboarding
- seller verification
- seller agreements
- commission
- split accounting
- settlement
- payout ledger
- disputes
- seller reporting

This stage must not block the first real commerce transaction.

## Canonical state model

Order:
DRAFT
-> PENDING_PAYMENT
-> PAID
-> PROCESSING
-> FULFILLED
-> COMPLETED

Alternative states:
EXPIRED
CANCELLED
REFUNDED
FAILED

Payment:
CREATED
-> PENDING
-> PAID

Alternative:
FAILED
EXPIRED
CANCELLED
REFUNDED

Every meaningful state transition creates an auditable commerce event.

## Security boundaries

- Never trust client totals.
- Never trust browser payment callbacks as payment truth.
- Never trust returnUrl query parameters as payment truth.
- Never identify a child only from a client-supplied name.
- Resolve request -> authenticated/operator context -> storefront -> organization -> permitted resource.
- Enforce ownership on every read and mutation.
- Make callback processing idempotent.
- Reject amount mismatches.
- Do not log secrets.
- Do not commit production credentials.
- Keep customer evidence out of the public repository.

## Testing contract

Every implementation stage must include:

- happy-path tests
- validation tests
- failure-path tests
- idempotency tests
- tenant isolation tests
- payment authenticity tests
- amount mismatch tests
- state-transition tests

Production transaction evidence is separate from automated test evidence.

## Production definition of done

HOLBERY may call first commerce production-verified only when:

- product is published
- customer can add to cart
- checkout validates
- order is persisted
- Duitku transaction is created
- Duitku reference is persisted
- Pop JS opens
- real payment is completed
- HTTP callback is received
- callback authenticity is verified
- payment becomes paid server-side
- order becomes paid
- fulfillment is recorded
- duplicate callback is harmless
- forged callback is rejected
- amount mismatch is rejected
- evidence bundle is retained without secrets

## Execution rule

Build in order M0 -> M1 -> M2 -> M3 -> M4.

Do not jump to child marketplaces, affiliates, seller settlement, or visual polish before the first transaction loop is working.

## Immediate next implementation

The next engineering slice is M0 + M1 foundation:

1. D1 runtime binding and migrations.
2. Commerce environment contract.
3. Storefront/tenant resolver.
4. Catalog seed.
5. Catalog APIs.
6. Product page backed by D1.
7. Tests for tenant isolation and catalog integrity.

Then M2 and M3 will connect the real checkout to Duitku Pop JS.

## Evidence rule

Status vocabulary:

- NOT STARTED
- BLOCKED
- IMPLEMENTED
- VERIFIED
- PRODUCTION VERIFIED

Never call payment LIVE or SUCCESS merely because source code exists.
