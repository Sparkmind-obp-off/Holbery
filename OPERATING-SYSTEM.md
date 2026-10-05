# HOLBERY — Operating System

Phase 6 | IMPLEMENTED framework + structural registries, not customer-validated operations.

## Loop dan handoff

DISCOVER → VALIDATE → DESIGN → BUILD → LAUNCH → OPERATE → MEASURE → IMPROVE → SCALE.

| Step | Input / action | Output / gate | Accountable |
|---|---|---|---|
| DISCOVER | Interview workflow, alternatives, cost, frequency | Opportunity brief + baseline + consent boundary | Discovery owner |
| VALIDATE | Timeboxed problem/outcome/price experiment | Evidence and go/no-go, not code metrics | Experiment owner |
| DESIGN | Smallest delivery, user journey, support burden | Spec and acceptance tests | Product owner |
| BUILD | Implement only necessary workflow | Versioned artefact and passing engineering tests | Build owner |
| LAUNCH | Rights, delivery, contact, onboarding checklist | Controlled pilot/offer with truthful status | Launch owner |
| OPERATE | Deliver, reconcile, support, monitor | Delivery/support log, incidents, data boundary | Operator |
| MEASURE | Baseline vs observed outcomes/costs | KPI sample/date/limitations, no fake numbers | Metrics owner |
| IMPROVE | Investigate friction and cost | One prioritised experiment, decision log | Product owner |
| SCALE | Stable outcome/economics/capacity | Budgeted increment with rollback threshold | Parent authority |

## Actual records

registries/projects.json contains structural non-PII records. opportunities.csv holds hypotheses; experiments.csv records planned experiments; products.json catalogs offers; feedback.csv, metrics.csv, revenue.csv start with headers and no fabricated rows. DECISIONS.md remains sole permanent decision log. Customer/operator identifiable records must be stored in an approved private system with lawful basis, never public git. Markdown/CSV here are internal process artifacts, not runtime application storage.

Weekly: review work/evidence/support; monthly: portfolio economics/rights/capacity; each graduation: explicit evidence/authority. Owner placeholders are gaps, not assigned humans. Empty revenue tracker means no revenue reported.

## Reusable templates

Opportunity/discovery: [OPPORTUNITY-TEMPLATE.md](OPPORTUNITY-TEMPLATE.md). Project/product: [PROJECT-TEMPLATE.md](PROJECT-TEMPLATE.md). Experiment/validation: [VALIDATION-TEMPLATE.md](VALIDATION-TEMPLATE.md). Launch/operation: [LAUNCH-TEMPLATE.md](LAUNCH-TEMPLATE.md). KPI: [KPI-FRAMEWORK.md](KPI-FRAMEWORK.md).

Customer feedback record: ID, anonymized project/context, consent reference held privately, date, observed task, expected outcome, friction, quote only with publication permission, severity, decision/action owner, follow-up. Never add real customer names to public CSV.

Decision record: ID/date/authority, question, alternatives, evidence/limitations, choice, costs/rights, reversal trigger, next review. Append to DECISIONS only after actual decision, not as a fictional customer approval.

Postmortem record: incident/experiment ID; intended outcome; actual evidence; impact/sample/time; contributing causes; what worked; what failed; corrective action + owner/date; preventive check; learning/generalization limits; close evidence. Blameless, with private incident details outside git.

## Guardrails

Stop commercial/data-destructive decisions without right/owner approval. No giant shared platform until repeating patterns justify it. No importing private Bozq systems. Registry validation CLI checks required metadata, duplicate ID, lifecycle/category and privacy. Framework dry-run is evidence of process repeatability, not proof that an actual venture is operating.
