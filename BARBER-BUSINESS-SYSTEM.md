# HOLBERY — Barber Business System

Phase 7 | CATEGORY SYSTEMS | lifecycle EXPERIMENT; real operator validation PENDING.
Parent HOLBERY. Bozq One System tetap privat/internal Bosku Cukur; no code/data/assets imported.

## Target customer and problem

Hypothesis: owner-operated independent barber with one location, a small team, mixed cash/digital receipts, and manual end-of-day closing. Initial user is the responsible closer; buyer is owner/operator. Not multi-branch chains needing integrated POS/payroll, not customers seeking booking marketplace.

One priority problem: closing records may be incomplete and the operator may not know whether cash and service receipts reconcile. This is an unvalidated hypothesis, not a documented complaint from real customers.

## Value proposition / workflow

A small workflow to close the day consistently and see unexplained differences. Count completed services; enter effective average net price; record cash/digital receipts, opening cash, cash expenses and actual cash; compare expected vs recorded service revenue and expected vs actual cash; explain differences outside the calculator; record next action; review weekly.

## MVP and feature boundary

Implemented: browser-only daily-close calculator, input guards, service-revenue/receipt-gap/cash-discrepancy outputs, header-only daily/weekly CSVs and printable onboarding/checklist. Inputs never transmitted or saved by the application. Files are downloaded to operator-controlled device; private real records do not go into public git.

Excluded: customer CRM/PII, retention reminders, loyalty, campaigns, staff commissions/payroll, bookings, payments, inventory, subscriptions, auth/multi-tenant SaaS, refunds/tips/owner-withdrawal logic and tax/accounting profit. Add only after discovery proves demand and safe data/rights implementation.

## Delivery / onboarding / reporting

Public research toolkit at /systems/barber. No checkout. Operator-led pilot: walkthrough <=30min, one synthetic practice close, one independent actual close, day3 feedback, day14 review. Daily outputs are provisional reconciliation cues, not audited accounts or revenue guarantee. Weekly review considers completeness, task time, unresolved gaps, and support minutes.

Retention hypothesis: recurring closing task makes the workflow useful; no claimed subscription retention. Support hypothesis: one onboarding session, one day3 and one day14 review, capped at 90min total pilot effort. Verified private support channel/owner must be assigned before real pilot.

## Commercial model

Free self-use research toolkit now; Rp149,000 guided pilot offer hypothesis after owner/rights/terms approval and operator demand. No live payment collection or sales claimed. [Pricing](PRICING-HYPOTHESIS.md), [validation plan](VALIDATION-PLAN.md), [MVP spec](MVP-SPEC.md).

## Evidence and next gate

Engineering tests with synthetic inputs + browser/HTTP downloads demonstrate usable implementation, not business validation. Recruit five discovery participants and two consenting pilot operators; apply predeclared outcome/price thresholds. Owner currently UNASSIGNED, real sample 0, no paid commitments; remain EXPERIMENT.
