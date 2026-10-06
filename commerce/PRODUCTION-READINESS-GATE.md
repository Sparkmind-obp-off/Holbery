# HOLBERY Production Commerce Readiness Gate

This gate determines whether HOLBERY may truthfully claim that production commerce is operational.

## Gate 1 — Infrastructure
- [ ] production runtime identified
- [ ] production D1 identified
- [ ] migrations applied
- [ ] HTTPS endpoints reachable
- [ ] production configuration validated
- [ ] observability available

## Gate 2 — Security
- [ ] Duitku merchant code stored only as production secret/binding
- [ ] Duitku API key stored only as production secret/binding
- [ ] no credential committed to Git
- [ ] callback signature verification implemented
- [ ] tenant/storefront authorization enforced
- [ ] sensitive callback access controlled
- [ ] secrets excluded from logs and responses

## Gate 3 — Commerce integrity
- [ ] canonical product exists
- [ ] offer price is server-authoritative
- [ ] cart validates ownership/storefront scope
- [ ] checkout validates inventory and purchasability
- [ ] order created before payment
- [ ] order amount snapshot persisted
- [ ] idempotency enforced
- [ ] order state transitions constrained
- [ ] commerce events persisted

## Gate 4 — Payment
- [ ] Duitku create transaction works with production credentials
- [ ] payment URL persisted
- [ ] callback endpoint reachable from Duitku
- [ ] valid callback accepted
- [ ] forged callback rejected
- [ ] duplicate callback is idempotent
- [ ] success, pending, and failure states map correctly
- [ ] amount mismatch rejected
- [ ] provider inquiry/reconciliation path exists

## Gate 5 — Operations
- [ ] paid order visible to operator
- [ ] fulfillment can be created
- [ ] fulfillment can be completed
- [ ] cancellation policy implemented
- [ ] refund record/policy exists
- [ ] customer/order evidence retained appropriately

## Gate 6 — Real transaction evidence
A real transaction must produce evidence for product publication, checkout initiation, order creation, Duitku transaction creation, customer payment, verified callback, server-side payment state change, paid order, and fulfillment.
Evidence must not contain API keys, secrets, unnecessary payment credentials, or unnecessary customer data.

## Status vocabulary
- NOT STARTED
- BLOCKED
- IMPLEMENTED
- VERIFIED
- PRODUCTION VERIFIED

Do not use LIVE or SUCCESS for payment merely because code exists.

## Release rule
HOLBERY may call the first commerce transaction production-verified only when all required gates are checked and a real payment evidence bundle exists.
Engineering tests alone are not production transaction evidence.