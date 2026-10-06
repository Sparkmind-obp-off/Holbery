# HOLBERY Production Commerce Evidence

## Purpose
Keep a controlled, non-secret record of evidence proving that the commerce loop works in production.
Actual sensitive evidence must not be committed here.

## Evidence bundle
Retain references to release commit, deployment identifier, environment identifier, storefront, order id, merchant order id, payment provider, payment event reference, callback timestamp, final payment status, final order status, and fulfillment status.
Where policy permits, retain redacted screenshots or logs outside the public repository.

## Required assertions
### A. Order creation
Prove that the order exists before payment, the amount matches the checkout snapshot, and the idempotency key is unique.

### B. Payment creation
Prove that the Duitku transaction was created, merchant order id matches the HOLBERY payment record, amount matches the order total, and payment reference was persisted.

### C. Callback verification
Prove that the callback reached production, signature was verified, provider event was accepted, and duplicate processing is idempotent.

### D. Final state
Prove that payment state is authoritative server-side, order payment state is updated, and fulfillment state is consistent.

## Redaction policy
Never commit DUITKU_API_KEY, secret tokens, passwords, raw authorization headers, unnecessary customer identity, complete payment credentials, or private callback payloads containing unnecessary PII.
Use redacted identifiers in shared evidence.

## Public repository rule
The repository may contain schemas, tests, redacted evidence examples, deployment documentation, and status summaries.
The repository must not contain production secrets, unredacted payment credentials, or private customer datasets.

## First transaction record template
Status: NOT STARTED
Release commit:
Deployment:
Storefront:
Order:
Merchant order:
Provider:
Callback:
Payment status:
Order status:
Fulfillment:
Verified by:
Verified at:
Notes: No secrets recorded. No payment success claimed until evidence is verified.