# HOLBERY First Sale Specification

## Objective
Create the smallest production-grade commercial surface that proves HOLBERY can transact real commerce.

## Canonical first-sale object graph
Organization -> Brand -> Storefront -> Product -> Variant -> Offer -> Cart -> Checkout -> Order -> Payment -> Fulfillment

## First product policy
The first product must be genuinely deliverable, simple to explain, easy to fulfill, commercially approved, intentionally priced, and suitable for the current HOLBERY environment.
Digital, physical, or service products are allowed. The commerce model must remain product-type independent.

## Checkout rules
Checkout calculates the authoritative total server-side.
The server validates storefront, product/variant existence, publication status, purchasability, quantity, stock policy, price, customer data, currency, and idempotency key.
Client-provided totals are never trusted.

## Order rules
Persist order id, organization, brand, storefront, customer, item snapshot, quantity, unit price snapshot, subtotal, discount, shipping when applicable, total, currency, idempotency key, status, payment status, fulfillment status, and timestamps.
The order is the source of truth for the transaction.

## Payment rules
A payment attempt is attached to an existing order.
Persist provider, unique merchant order id, order amount, provider reference, payment URL when available, payment status, and timestamps.
Payment state is reconciled against provider evidence when necessary.

## Fulfillment rules
A paid order becomes eligible for fulfillment.
Minimum states: pending, processing, fulfilled, and cancelled where applicable.
Physical orders may later add tracking. Digital/service fulfillment may use delivery or completion references.

## First-sale test matrix
Happy path: product -> cart -> checkout -> order -> payment -> callback -> paid -> fulfillment
Negative paths: invalid product, unpublished product, invalid quantity, insufficient stock, invalid customer data, duplicate idempotency key, amount mismatch, forged callback, duplicate callback, unknown provider event, failed payment, expired payment, and cancellation after payment where policy permits.

## Scope exclusions
Not part of first sale: seller onboarding, marketplace commissions, split payments, seller settlement, seller payouts, affiliate settlement, external marketplace synchronization, subscriptions, complex promotions, and multi-currency.