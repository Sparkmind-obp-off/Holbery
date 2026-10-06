# HOLBERY Commerce Implementation Blueprint

## C0 — Commerce Core
D1 migrations; tenant context; catalog CRUD; product/variant/offer APIs; storefront registry; public product pages.
Exit: product can be published; canonical URL resolves; child A cannot read child B data.

## C1 — Transaction
Cart; checkout validation; durable order creation; idempotency; price snapshots; inventory reservation policy; order state machine.
Exit: duplicate idempotency key cannot create duplicate order; checkout rejects invalid/out-of-stock items.

## C2 — Duitku
Provider adapter; create transaction; payment URL persistence; callback verification; duplicate callback protection; pending/success/failure mapping; inquiry/reconciliation; payment audit events.
Exit: real merchant credentials are production secrets only; real order receives payment URL; verified callback changes payment state; forged/duplicate callback cannot corrupt state.

## C3 — Operations
Protected order dashboard; fulfillment; inventory adjustment; customer record; refund/cancellation records; operational event log.

## C4 — Child Commerce
Child registry; storefront routing; catalog scope; order scope; per-child payment/fulfillment policy; domain mapping.
Exit: two child storefronts can sell simultaneously with isolated data and admin permissions.

## C5 — Portfolio Marketplace
Portfolio entity; membership; merchandising; unified discovery; canonical ownership; attribution.
Exit: one portfolio can display multiple child stores; one product can belong to multiple portfolios without duplication.

## C6 — Distribution
Channel registry; listing mapping; share links; campaign attribution; feed/export jobs; channel sync events.

## C7 — True Marketplace
Only when demand requires: seller onboarding, contracts, verification, commissions, split accounting, settlement, payout ledger, disputes and seller reporting.

## C8 — Federation
External API credentials; dedicated databases; dedicated payment accounts; independent runtimes; event synchronization; portfolio federation.

A child may become operationally independent without becoming commercially disconnected from HOLBERY.