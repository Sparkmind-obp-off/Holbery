# HOLBERY × DUITKU — Production Payment Boundary

Duitku is a payment adapter, not HOLBERY's order model. No production credential is stored in the repository.

## Runtime secrets

DUITKU_MERCHANT_CODE
DUITKU_API_KEY

Store them only as Cloudflare secrets/bindings.

## Required endpoints

POST /api/commerce/payments/duitku/create
POST /api/commerce/payments/duitku/callback
GET /checkout/:orderId
GET /orders/:orderId

## Invariants

1. Create the HOLBERY order before the external payment.
2. Generate a unique merchantOrderId.
3. Persist the amount and item snapshot used for payment.
4. Validate the Duitku callback signature.
5. Process duplicate callbacks idempotently.
6. Persist the Duitku reference.
7. Never mark an order paid from browser redirect parameters.
8. Reconcile uncertain states using provider status/inquiry where appropriate.
9. Return HTTP 200 to a valid processed callback.
10. Preserve callback evidence with controlled access.

## Production gate

D1 binding, HTTPS callback reachability, production secrets, signature verification, duplicate callback tests, success/pending/failure tests, amount-mismatch rejection, reconciliation and refund/cancellation policy are required before declaring production payment live.

Source: official Duitku API documentation at https://docs.duitku.com/api/id/
