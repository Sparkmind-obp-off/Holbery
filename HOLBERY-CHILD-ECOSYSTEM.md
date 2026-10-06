# HOLBERY — Child Ecosystem Architecture

Status: CANONICAL DIRECTION

## Objective

HOLBERY must be able to contain multiple children without becoming a monolithic brand or duplicating the platform for every project.

A child can be a product, system, venture, commerce concept, or eventually an independent brand. The architecture separates **technical tenancy** from **brand identity** and from **legal ownership**.

## Model

```text
HOLBERY
│
├── Shared Platform Capabilities
│   ├── Identity / access
│   ├── Commerce
│   ├── Catalog
│   ├── Payments
│   ├── Orders
│   ├── Fulfillment
│   ├── Notifications
│   ├── Analytics
│   └── Governance
│
├── HOLBERY-NATIVE UNITS
│   ├── System
│   ├── Product
│   └── Commerce offer
│
└── CHILD UNITS
    ├── Child Brand A
    ├── Child Brand B
    └── Child Brand C
```

## Child record

Every onboarded child should have a stable identity:

- `child_id`
- `parent_id`
- category
- lifecycle
- owner/operator
- customer/audience
- commercial model
- repository
- domain
- storefront
- enabled capabilities
- rights/IP status
- data policy
- status
- review date

## Capability model

A child consumes capabilities rather than copying the parent.

Example:

```text
Child
 ├─ commerce: enabled
 ├─ catalog: enabled
 ├─ checkout: enabled
 ├─ payments: enabled
 ├─ fulfillment: enabled
 └─ analytics: enabled
```

A system-only child may enable only the capabilities it needs.

## Isolation

At runtime, authorization must prevent one child from reading or mutating another child's records.

Isolation applies to:

- customers;
- carts;
- orders;
- payments;
- inventory;
- analytics;
- files;
- API credentials;
- webhook events.

Shared infrastructure does not mean shared business data.

## Graduation

A child may remain inside HOLBERY forever.

Independent graduation is considered only when there is a material reason such as:

- distinct market identity;
- independent economics;
- separate legal ownership;
- separate team/operations;
- separate infrastructure/security boundary;
- licensing or acquisition;
- scale requirements.

Graduation must preserve historical ownership, customer, financial, domain, and IP records correctly.

## Parent surfaces

HOLBERY should eventually expose:

- parent headquarters;
- portfolio/catalog discovery;
- commerce/store surface;
- child directory;
- system/product library;
- venture portfolio;
- operator/admin control plane.

The customer-facing surface may be one site or several domains. The underlying architecture must not depend on one URL.

## Principle

**One parent. One reusable platform. Many legitimate expressions.**

The number of children is not the success metric. The ability to operate several distinct businesses without losing data, rights, commerce, or governance integrity is.
