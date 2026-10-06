# HOLBERY — Technical Architecture

v1.2 | 2026-10-06

## Canonical hierarchy

HOLBERY → LIBRARY (SYSTEMS / PRODUCTS / VENTURES / COMMERCE / KNOWLEDGE / CAPABILITIES / ASSETS) + BRAND PORTFOLIO / CHILD BRANDS.

The technical architecture is intentionally **platform-capable**: the current public website is only the first surface. Future commerce and child capabilities must be added as reusable domain modules rather than rebuilt per child.

## Current runtime

Hono + TypeScript + Vite on Cloudflare Pages/Workers. Existing commerce uses persistent D1, Duitku server adapter, private R2 digital delivery and protected support; current utility surfaces add browser-only math and an opt-in anonymous event module.

Catalog/cart/checkout/order/stock/payment verification/digital delivery are implemented and engineering-tested; readiness is not a genuine payment/outcome. End-user accounts, marketplace and active child businesses are not introduced. The target diagram below is a capability map, not launched portfolio.

## Target platform architecture

```text
                    HOLBERY
                       │
          ┌────────────┼────────────┐
          │            │            │
       Systems      Products     Ventures
          │            │            │
          └────────────┴────────────┘
                       │
                    Commerce
                       │
        ┌──────────────┼──────────────┐
        │              │              │
     Catalog         Checkout       Orders
        │              │              │
     Inventory       Payments      Fulfillment
        │              │              │
        └──────────────┼──────────────┘
                       │
                Shared Platform
                       │
             ┌─────────┼─────────┐
             │         │         │
          HOLBERY    Child A   Child B ...
```

## Platform domains

Future runtime modules should be separated by business responsibility:

- identity/access
- organizations and brands
- catalog
- pricing
- storefront
- cart
- checkout
- payments
- orders
- fulfillment
- inventory
- customers
- promotions
- notifications
- analytics
- reconciliation
- governance

Each module should expose small interfaces and avoid coupling the business model to a specific vendor.

## Multi-brand / child support

Every persisted business resource must have an explicit ownership boundary. At minimum, future records should be scoped through an organization/tenant boundary and, where applicable, brand/storefront identifiers.

A shared runtime may serve many children. It must never imply that children share customer, payment, inventory, or financial data.

See [HOLBERY-CHILD-ECOSYSTEM.md](HOLBERY-CHILD-ECOSYSTEM.md).

## Commerce

Commerce is a first-class HOLBERY capability, not merely a navigation page.

The target lifecycle is:

DISCOVER → CATALOG → CART → CHECKOUT → PAYMENT → ORDER → FULFILL → COMPLETE → RECONCILE → RETAIN

See [HOLBERY-COMMERCE-ARCHITECTURE.md](HOLBERY-COMMERCE-ARCHITECTURE.md).

The first implementation should be direct commerce for a real offer. A marketplace is optional and should not be built speculatively.

## Cloudflare target

When persistence is justified:

- D1: relational commerce/application state
- R2: product/media/document assets
- Workers: API/domain services
- Queues: asynchronous payment/order/fulfillment events
- Secrets/bindings: provider credentials
- Pages: public storefront/application surface

Add infrastructure only with a validated use case.

## Payment architecture

Use a provider adapter:

```text
Checkout
  ↓
Payment interface
  ├─ provider adapter A
  ├─ provider adapter B
  └─ future adapter
```

The core order/payment model must remain provider-independent. Idempotency, webhook authenticity, transaction state, refunds, and reconciliation are mandatory before production payment claims.

## Security

Authorization must be evaluated at the tenant/brand/resource boundary. Secrets remain outside source. Private customer evidence never enters the public repository. Financial and customer records are persistent application data and must not use browser-only storage as their system of record.

## Current versus target

| Capability | Current | Target |
|---|---|---|
| Parent website | Implemented | Keep |
| Library/governance | Implemented | Keep/evolve |
| Systems | Research implementation | Reusable platform modules |
| Product catalog | Existing canonical D1 BRS offer | Evidence-led improvements |
| Commerce storefront | Database-backed direct storefront | No marketplace required |
| Cart | Durable capability-protected cart | Maintain integrity |
| Checkout | Durable atomic/idempotent checkout | Real-customer delivery evidence |
| Payments | Duitku adapter/callback+inquiry/reconciliation | Genuine transaction verification |
| Orders | Durable guarded lifecycle | Real operations and repeatability |
| Fulfillment | Private R2 entitlement/versioned package/support | Genuine paid delivery/outcome |
| Child support | Scoped runtime/guards; no active child implied | Validated independent units only |
| Customer data | Isolated private D1 commerce records | Lawful minimal data, never public Git |
| Analytics | Opt-in utility ledger; separate server commerce evidence | Meaningful weekly learning, no identity joins |

## Non-negotiable

HOLBERY must be able to grow from parent website → commerce engine → multi-brand ecosystem without replacing the core architecture.

The current site is therefore the **first shell**, not the final product.

## Utility boundary

Browser math has no persistent financial values. Shared strict event contract feeds /api/field-events only after opt-in, hashed short sessions, DNT/GPC, test isolation, rate cap and UUID dedup. Three additive D1 tables reuse DB, no commerce joins or duplicate payment truth. Review reuses existing admin secret. Ledger/aggregate deletion is lazy, not cron. See execution/HOLBERY-FIELD-EVENT-SSOT.md and README for current capabilities; current table reports implementation, not verified market maturity.
