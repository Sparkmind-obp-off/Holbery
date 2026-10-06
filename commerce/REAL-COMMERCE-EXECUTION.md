# HOLBERY Real Commerce Execution Contract

## Purpose
This document turns the locked commerce architecture into a production execution contract.
The first proof is one real product, one storefront, one customer checkout, one verified payment, one durable order, and one fulfillment record.

## Commercial proof loop
DISCOVER -> PRODUCT -> CART -> CHECKOUT -> ORDER -> DUITKU -> VERIFIED PAYMENT -> FULFILLMENT -> COMPLETION -> EVIDENCE

## First-sale scope
- one HOLBERY-owned organization
- one brand
- one storefront
- one published product
- one active variant/offer
- one cart
- one customer
- one order
- Duitku production adapter
- one verified callback
- one fulfillment record

Do not add open seller onboarding, commissions, split settlement, affiliate settlement, or multi-seller accounting to first-sale scope.

## Execution stages
### E0 — Runtime foundation
- D1 binding and migration pipeline
- environment/config validation
- tenant/storefront context
- catalog APIs
- storefront product resolution
- server-side validation
- structured errors
Exit: a real product can be published and resolved from the canonical storefront.

### E1 — Transaction foundation
- cart creation/update
- checkout validation
- price snapshot
- stock validation/reservation policy
- durable order creation
- idempotency
- order state machine
- commerce events
Exit: checkout creates exactly one durable order for one idempotency key.

### E2 — Production payment
- provider-neutral payment interface
- Duitku production adapter
- payment creation
- payment URL
- callback endpoint
- signature verification
- duplicate-event protection
- payment state mapping
- provider inquiry/reconciliation
- payment audit evidence
Exit: a production order can receive a verified Duitku payment state without trusting the browser redirect.

### E3 — Operations
- protected order view
- fulfillment creation/update
- customer record
- cancellation/refund records
- inventory adjustment
- operational event timeline
Exit: a paid order can be operationally completed.

### E4 — Child commerce
Only after first-sale evidence: child registry, child storefront, isolated catalog, isolated order visibility, scoped permissions, and child payment/fulfillment policy.

### E5 — Portfolio commerce
Only after child commerce works: portfolio registry, portfolio membership, unified discovery, canonical ownership, and attribution.

## Non-negotiable rules
1. No production credentials in Git.
2. No payment success claim without verified server-side evidence.
3. Browser redirect is never authoritative for payment status.
4. Order exists before payment is created.
5. Amount and item snapshot are immutable for the payment attempt.
6. Duplicate callbacks must be harmless.
7. Every payment/order transition is auditable.
8. Every tenant query is scoped.
9. External channels never become the canonical product/order source.
10. Tests must prove failure paths, not only happy paths.

## First-sale Definition of Done
- product is published
- customer can add it to cart
- checkout validates
- order is persisted
- Duitku transaction is created
- payment URL is returned
- real payment is completed
- Duitku callback is received
- callback signature is verified
- payment becomes paid server-side
- order becomes paid
- fulfillment is recorded
- duplicate callback test passes
- forged callback test passes
- amount mismatch is rejected
- evidence is recorded without exposing credentials or sensitive customer data

## After first sale
Use the first transaction to validate checkout friction, payment reliability, operational handling, product economics, fulfillment, customer communication, and refund/cancellation behavior before expanding the commerce surface.