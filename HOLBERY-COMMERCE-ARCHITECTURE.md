# HOLBERY — Commerce & Commerce Platform Architecture

Status: CANONICAL DIRECTION  
Role: reusable commerce capability under HOLBERY

## Purpose

HOLBERY must be able to operate as more than a parent website. The parent architecture must be capable of becoming a **commerce platform**: cataloging offers, presenting products/services, accepting carts and orders, coordinating payment, fulfillment, customer records, and reporting—while preserving isolation between HOLBERY and its children.

This does **not** mean HOLBERY must become a marketplace immediately. It means the architecture must not make a future store, multi-brand commerce house, or child storefront structurally impossible.

## Canonical model

```text
HOLBERY
│
├── SYSTEMS
├── PRODUCTS
├── VENTURES
├── COMMERCE
│   │
│   ├── Catalog
│   ├── Storefronts
│   ├── Cart
│   ├── Checkout
│   ├── Orders
│   ├── Payments
│   ├── Fulfillment
│   ├── Customers
│   ├── Promotions
│   └── Commerce Analytics
│
└── CHILD ECOSYSTEM
    ├── Child A
    │   └── own catalog / offers / storefront / orders
    ├── Child B
    │   └── own catalog / offers / storefront / orders
    └── ...
```

## Core rule

**One commerce engine, many controlled surfaces.**

The reusable commerce core should be provider-independent and tenant/brand-aware. A child may use HOLBERY infrastructure without becoming the HOLBERY brand in the customer's eyes.

## Commerce entities

The future persistent model should support, at minimum:

- Organization / owner
- Brand
- Storefront
- Product
- Product variant
- Service / bookable offer
- Price
- Inventory
- Customer
- Cart
- Checkout
- Order
- Order item
- Payment intent / payment transaction
- Fulfillment
- Promotion / discount
- Tax configuration
- Shipment / delivery method
- Refund
- Commerce event
- Attribution / channel

Every business-critical record must carry an ownership boundary such as `organization_id` and, where relevant, `brand_id` / `storefront_id`.

## Parent versus child

HOLBERY owns the **platform capability** only where rights and ownership are actually established.

A child can have:

- its own catalog;
- its own pricing;
- its own customer-facing storefront;
- its own order lifecycle;
- its own commerce analytics;
- its own fulfillment rules;
- its own domain or path;
- its own legal/commercial identity.

HOLBERY may provide shared infrastructure, standards, discovery, distribution, and governance.

Do not merge customer data, financial records, IP, or legal ownership merely because two offers use the same technical engine.

## Storefront modes

The platform should support these modes without changing the core:

1. **HOLBERY Store** — products/offers sold directly by HOLBERY.
2. **Child Store** — a child-facing storefront operated independently or endorsed by HOLBERY.
3. **Portfolio Catalog** — discovery surface aggregating eligible offers from multiple children.
4. **Partner Channel** — external distribution/affiliate/partner surface.
5. **Embedded Commerce** — commerce components embedded inside a system or venture.

## Payment boundary

Payment must be adapter-based.

```text
Checkout
   ↓
Payment Interface
   ├── Provider A
   ├── Provider B
   └── Future provider
```

No payment provider should become the business domain model. Store provider references, idempotency keys, transaction state, and reconciliation evidence separately.

Production payment activation remains a later gate requiring credentials, legal/business review, webhook verification, reconciliation, refund handling, and failure testing.

## Required commerce lifecycle

```text
DISCOVER
→ CATALOG
→ CART
→ CHECKOUT
→ PAYMENT
→ ORDER
→ FULFILL
→ COMPLETE
→ RECONCILE
→ RETAIN
```

Failure states are first-class: abandoned checkout, payment failure, duplicate request, partial fulfillment, cancellation, refund, dispute, and reconciliation mismatch.

## Technical direction

Cloudflare remains a viable base:

- Hono / Workers for APIs and domain services
- D1 for relational commerce state when persistence is introduced
- R2 for product/media assets where appropriate
- Queues for asynchronous order/payment/fulfillment events when justified
- provider adapters for payments, shipping, messaging, and external commerce services
- environment/secret bindings for credentials
- strict tenant/brand authorization at every persisted resource boundary

Do not introduce all infrastructure at once. Build the smallest vertical slice that proves the commerce lifecycle.

## Child onboarding

A child becomes commerce-enabled through a configuration/registry relationship, not a copy of the whole application.

Example:

```text
child_id
parent_id = HOLBERY
brand_id
storefront_id
catalog_scope
payment_account
fulfillment_policy
customer_data_policy
domain
status
```

The child may remain in HOLBERY's registry or graduate to an independent repository/runtime when permissions, deployment, economics, legal ownership, or scale justify separation.

## Non-negotiables

1. Commerce is a real operating capability, not only a navigation page.
2. A marketplace is optional; direct commerce is sufficient for the first implementation.
3. Multi-brand support must be designed before customer data exists.
4. Parent and child data boundaries are explicit.
5. Payment is provider-independent.
6. Orders are durable and idempotent.
7. Financial state is auditable and reconcilable.
8. A child does not automatically become legally owned by HOLBERY.
9. A website, catalog, or test checkout is not proof of commercial traction.
10. No fabricated products, customers, orders, revenue, or payment success.

## Target state

The target is not “build Shopify inside HOLBERY”.

The target is:

> **HOLBERY can own, operate, or provide the reusable commerce infrastructure needed to sell its own products and to power multiple legitimate child businesses without architectural replacement.**
