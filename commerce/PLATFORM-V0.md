# HOLBERY Commerce OS v0

HOLBERY is designed to become a reusable commerce platform, not merely a parent website.

## First transaction loop

DISCOVER → PRODUCT → CART → CHECKOUT → PAYMENT → ORDER → FULFILL → DISTRIBUTE

## Surfaces

1. HOLBERY Store — direct sales owned by HOLBERY.
2. Portfolio Marketplace — discovery across eligible child storefronts.
3. Child Storefront — isolated commerce surface for a child.
4. Embedded Commerce — buying inside a system/product.
5. Distribution Channels — partner, affiliate, social and external channel links.

## Core rule

One commerce engine, many storefronts. A storefront is a configuration and ownership boundary, not a separate codebase.

## V0 marketplace

Do not begin with a full seller marketplace.

V0 is a portfolio marketplace: HOLBERY controls the platform, eligible child offers can be listed, checkout is unified, and each order item retains storefront/brand ownership. Seller onboarding, commissions and split settlement are later.

## Distribution

Every sellable offer has one canonical product ID and canonical commerce URL. Distribution adapters publish that same offer to HOLBERY Store, child stores, portfolio discovery, partners and future external channels. Channels never become the source of truth.

## Child model

Each child receives organization, brand and storefront boundaries plus catalog scope, payment configuration, fulfillment policy, customer-data policy and distribution permissions. Shared infrastructure never implies shared business data.

## Fastest build order

C0 foundation: D1, ownership boundaries, catalog, canonical product URLs.
C1 transaction: cart, checkout, durable orders, idempotency.
C2 payment: Duitku adapter, callback verification, reconciliation.
C3 operations: fulfillment, inventory, customer records, order admin.
C4 distribution: portfolio marketplace, child storefront routing, channel registry.
C5 expansion: promotions, refunds, partner attribution, external channels.
C6 optional true marketplace: seller onboarding, commissions, split settlement and payouts.

## Definition of Done

A customer can discover an offer, open its canonical page, add it to cart, checkout, reach a Duitku payment page, pay, trigger a verified callback, see the order become paid, and follow fulfillment. A child can independently own its catalog/storefront/orders without reading another child's data.

The target is not a Shopify clone. It is reusable commerce infrastructure that HOLBERY can operate itself and use to power legitimate child businesses.
