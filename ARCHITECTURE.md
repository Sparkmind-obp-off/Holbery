# HOLBERY — Technical Architecture

v1.2 | 2026-10-06

## Canonical hierarchy

HOLBERY → SYSTEMS / PRODUCTS / VENTURES / COMMERCE.

The technical architecture is intentionally **platform-capable**: the current public website is only the first surface. Future commerce and child capabilities must be added as reusable domain modules rather than rebuilt per child.

## Current runtime

Hono + TypeScript + Vite on Cloudflare Pages/Workers. The current deployment is an informational/public foundation and research MVP.

Current implementation does **not** yet provide persistent commerce, accounts, checkout, payment processing, order management, inventory, or multi-tenant child data. This is an implementation-status statement, not an architectural limitation.

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
| Product catalog | Registry placeholder | Persistent catalog |
| Commerce storefront | Informational page | Transactional storefront |
| Cart | Not implemented | Durable cart |
| Checkout | Not implemented | Durable/idempotent checkout |
| Payments | Not implemented | Provider adapters + reconciliation |
| Orders | Not implemented | Durable order lifecycle |
| Fulfillment | Not implemented | Extensible fulfillment |
| Child support | Governance only | Tenant/brand-aware runtime |
| Customer data | Not implemented | Isolated persistent records |
| Analytics | Structural registries | Commerce/portfolio reporting |

## Non-negotiable

HOLBERY must be able to grow from parent website → commerce engine → multi-brand ecosystem without replacing the core architecture.

The current site is therefore the **first shell**, not the final product.
