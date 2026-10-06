# HOLBERY Production Secrets & Operator Access

## Actual configuration — 2026-10-06

VERIFIED: supplied Duitku credentials were installed into the existing Pages project's encrypted production DUITKU_MERCHANT_CODE and DUITKU_API_KEY secrets. A fresh cryptographically random COMMERCE_ADMIN_TOKEN was also installed for scoped operator API authorization. No secret value is recorded here, embedded in frontend code, or committed to Git. The local credential file is ignored and mode0600. Tests scanned actual secret values against tracked/unignored source files.

VERIFIED: read-only production payment-method discovery used the current HMAC-SHA256 contract and returned HTTP200, responseCode00,18 available methods. This is authentication evidence, NOT invoice, paid order or sale evidence. No sandbox fallback was used for this call.

Because the operator posted the original API key in chat, rotate it directly in Duitku and update the Cloudflare production secret; do not paste its replacement. COMMERCE_ADMIN_TOKEN is an additional auth secret. If you need direct operator access, set a new privately retained random token in Cloudflare; the encrypted existing value cannot be read back from the dashboard. Customer access remains a separate per-cart/order capability. R2 uses a native private binding, not exposed access keys.

Required non-secret delivery configuration is in wrangler.jsonc: PRODUCT_BUCKET binding, SUPPORT_CHANNEL=/support/commerce, TERMS_VERSION=BRS-TERMS-2026-1, REFUND_POLICY_VERSION=BRS-REFUND-2026-1, PRIVACY_POLICY_VERSION=BRS-PRIVACY-2026-1, FULFILLMENT_MODE=secure-download. Only COMMERCIAL_POLICY_APPROVED and COMMERCE_ENABLED remain false. Owner approval must cover the proposed policies, responsible support operator and actual customer payment action.

## Never send production secrets in chat

Never paste these into ChatGPT, GitHub, commits, source files, screenshots, or public documents:

- Duitku production merchant code
- Duitku production API key
- HOLBERY commerce operator token
- customer private capabilities
- sensitive private payment payloads

The operator should configure them directly in the Cloudflare production environment.

## Required production secret names

Cloudflare Workers & Pages → webapp-4 → Settings → Variables and Secrets → Production:

| Name | Type | Purpose |
|---|---|---|
| DUITKU_MERCHANT_CODE | Secret | Real production Duitku merchant code |
| DUITKU_API_KEY | Secret | Real production Duitku API key |
| COMMERCE_ADMIN_TOKEN | Secret | Random 32-byte hex operator bearer token |

Non-secret deployment variables:

- DUITKU_ENV=production
- ENVIRONMENT=production
- PUBLIC_ORIGIN=https://webapp-4.pages.dev
- ADMIN_STOREFRONT_ID=holbery-direct

## Operator ownership

The operator retains direct control of the Cloudflare account and production secrets. The development agent does not need to know the secret values.

If a secret-dependent test is needed, configure the secret in Cloudflare and report only the resulting readiness/error status.

## Operator token

Generate locally with:

    openssl rand -hex 32

Store the output only as the Cloudflare COMMERCE_ADMIN_TOKEN secret. Never commit it.

## Activation gate

Keep commerce disabled until:

1. real Duitku production secrets exist
2. first product is approved
3. commercial/support/privacy/refund terms are approved
4. fulfillment package is ready
5. production deployment is rebuilt
6. readiness reports no missing production configuration

Only then set:

- COMMERCIAL_POLICY_APPROVED=true
- COMMERCE_ENABLED=true

## Verification

1. readiness check
2. published product check
3. product → cart
4. checkout
5. server-created Duitku invoice
6. Pop JS opens
7. real payment
8. Duitku HTTP callback
9. server-side signature + inquiry verification
10. order becomes PAID
11. fulfillment becomes FULFILLED
12. completion
13. evidence bundle

Browser success is not payment proof.

## Emergency safety

If payment behavior is uncertain:

- never manually mark an order paid
- never trust browser return parameters
- use provider inquiry/reconciliation
- quarantine unknown outcomes
- preserve the original payment event
- keep secrets unchanged
