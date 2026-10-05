# HOLBERY — KPI Framework

Parent HOLBERY; count real observations, not launch-page visits as product proof.

## Metric dictionary

| Metric | Formula / source | Review / guardrail |
|---|---|---|
| Activation | operators completing first independent daily close / operators onboarded | day3; report denominator, avoid % at zero sample |
| Completeness | complete required close records / scheduled open days | weekly; closures excluded explicitly |
| Close time | minutes from task start to reconciled output; baseline vs pilot median | weekly; sample/time window and source |
| Cash discrepancy | actual cash - expected cash | daily; investigate any unexplained value; not profit |
| Receipt gap | cash receipts + digital receipts - expected service revenue | daily; refunds/discounts/tips handled outside MVP |
| Repeated use | operators using workflow >=10 days / operators with 14-day window | day14; not subscription retention |
| Support load | support minutes / active operator / window | weekly; target hypothesis <=30 minutes after onboarding |
| Paid conversion | confirmed paid commitments / eligible offers made | end pilot; no revenue until collected/recognized appropriately |
| Contribution | net collected revenue - variable delivery/support/fees/refunds | monthly; not accounting/tax profit |
| CAC | attributed acquisition cost / new paying customer | by channel; zero paid sample = UNKNOWN, not zero CAC |
| Retention | active paying customers end-window / eligible cohort start | only when recurring product exists |

Targets for first barber experiment are hypotheses in VALIDATION-PLAN, not measured achievements. Pilot sample small; no causal attribution from two operators alone. Report absolute counts, source/date, confidence limitations, missing records and counterevidence.

## Record structure

metric_id, project_id, window_start/end, definition_version, numerator, denominator, unit, actual_or_hypothesis, data_source_private_reference, owner, next_action. public registries/metrics.csv contains sanitized aggregate/header only. Do not commit customer PII/business records. No actual values are prefilled.

## Decision rules

One primary outcome (daily closing usable/reconciled) and two guardrails (privacy/rights, support cost). If improvement is absent or missingness high, change the workflow before scaling. Economics must include delivery and support time, not only software costs. Synthetic calculator tests prove correctness, not customer adoption. Runtime analytics are separate from operational pilot metrics.
