# HOLBERY x DUITKU POP JS — Production Payment Boundary

Duitku Pop JS is the selected customer-facing payment experience for HOLBERY.

Official documentation: https://docs.duitku.com/pop/id/

## Canonical flow

1. Customer completes HOLBERY checkout.
2. HOLBERY creates the durable order.
3. HOLBERY calls Duitku Create Invoice.
4. Duitku returns a DUITKU_REFERENCE.
5. HOLBERY persists the reference and payment attempt.
6. Browser loads production Duitku JS.
7. Browser calls checkout.process(reference, options).
8. Duitku processes the payment and invokes browser UX callbacks.
9. Duitku separately sends an HTTP payment notification to HOLBERY.
10. HOLBERY verifies the server callback and changes payment/order state.
11. HOLBERY records the event and exposes the resulting state.

## Production endpoints

Create Invoice:
https://api-prod.duitku.com/api/merchant/createInvoice

Duitku Pop JS:
https://app-prod.duitku.com/lib/js/duitku.js

## Browser integration

Load:

<script src="https://app-prod.duitku.com/lib/js/duitku.js"></script>

Then:

checkout.process(reference, {
  defaultLanguage: "id",
  successEvent: function(result) {
    // UX only. Never mutate payment/order truth here.
  },
  pendingEvent: function(result) {
    // UX only.
  },
  errorEvent: function(result) {
    // UX only.
  },
  closeEvent: function(result) {
    // UX only.
  }
});

Duitku documents these callbacks as customer-facing notifications. They must not be used as the authoritative payment state.

## Server secrets

- DUITKU_MERCHANT_CODE
- DUITKU_API_KEY

Store them only in Cloudflare production secret/binding configuration. Never commit them to GitHub.

## Server responsibilities

The server owns merchantOrderId generation, paymentAmount, itemDetails snapshot, callbackUrl, returnUrl, Duitku reference persistence, callback verification, payment/order state transitions, and reconciliation.

The browser owns presentation and customer interaction only.

## Required HOLBERY endpoints

POST /api/commerce/payments/duitku/create
POST /api/commerce/payments/duitku/callback
GET /checkout/:orderId
GET /orders/:orderId

## Signature and callback rule

Use the current Duitku callback/signature requirements from the official documentation. Do not implement the obsolete SHA256-only scheme from older examples.

A valid callback must be authenticated before mutating payment or order state.

Duplicate provider events must be harmless. Unknown or invalid callbacks must not mutate commerce state.

## Amount integrity

The amount sent to Duitku must equal the authoritative HOLBERY order total and item snapshot.

Reject or quarantine mismatches.

Never accept a browser-provided total as authoritative.

## Redirect and JS callback rule

Duitku browser callbacks and returnUrl parameters are customer-experience signals, not payment truth.

Payment truth comes from the verified server-side Duitku notification and, when necessary, provider inquiry/reconciliation.

## Production gate

Before production verification:

- production D1 exists
- production runtime exists
- production HTTPS callback is reachable
- production merchant code is configured
- production API key is configured as a secret
- callback verification is implemented
- duplicate callback tests pass
- forged callback tests pass
- amount mismatch tests pass
- success/pending/failure mapping is verified
- reconciliation exists
- refund/cancellation policy exists
- real transaction evidence is captured

## Source of truth

Official Duitku Pop documentation: https://docs.duitku.com/pop/id/

Current official documentation states that the server obtains the Duitku reference first, the browser calls Duitku Pop JS with that reference, and the server receives a separate HTTP notification for payment status. It also states that JS callback results must not be used to change database payment status.
