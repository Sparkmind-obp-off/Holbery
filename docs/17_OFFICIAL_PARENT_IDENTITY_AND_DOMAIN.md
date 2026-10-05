# 17 — OFFICIAL PARENT IDENTITY AND DOMAIN

## Canonical identity

**Master Parent:** HOLBERY

**Canonical domain:** `holbery.biz.id`

**Domain status:** Secured according to owner confirmation on 2026-10-05.

## Purpose of the domain

The domain is the canonical public web entry point for the parent layer.

It should communicate:
- who HOLBERY is
- what the house owns
- portfolio structure
- shared capabilities
- partnership / corporate contact
- selected child-brand stories

It should not become a dumping ground for every product.

## Recommended information architecture

```
holbery.biz.id/
├── /
├── /about
├── /portfolio
├── /brands
├── /commerce
├── /house
├── /approach
└── /contact
```

Future child sites may live on separate domains or controlled subdomains.

## Parent relationship

Use the domain to make the architecture obvious:

**HOLBERY**

*The house behind a portfolio of brands, products, and businesses.*

Avoid claims that imply a larger corporate footprint than actually exists.

## Domain rollout gates

### Gate 1 — DNS
Configure the authoritative DNS records at the selected provider.

### Gate 2 — HTTPS
Verify valid TLS/HTTPS.

### Gate 3 — Parent landing page
Deploy a small, credible parent website.

### Gate 4 — Canonicalization
Choose one canonical host and redirect alternatives.

### Gate 5 — Email
Implement a domain email strategy appropriate to the business stage.

### Gate 6 — Monitoring
Track DNS, uptime, certificate expiry, and key domain configuration.

## Security

- enable domain registrar protection where available
- use strong account authentication
- keep recovery credentials offline/secure
- separate domain administration from application credentials
- document DNS changes

## Important status note

Domain possession does not prove trademark ownership or legal clearance.

Before public commercial use at material scale, complete the trademark and legal review described in `07_NAMING_AND_CLEARANCE_GOVERNANCE.md`.
