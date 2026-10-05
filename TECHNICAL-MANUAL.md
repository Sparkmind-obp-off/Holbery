# HOLBERY — Technical Manual

**Status: CANONICAL TECHNICAL PLAYBOOK**

## Principles

Smallest architecture that satisfies a validated requirement; one source of truth; private data stays private; no speculative platform; reproducible builds/tests; explicit deployment/rollback; secrets never enter source.

## Delivery path

SPEC → IMPLEMENT → TEST → SECURITY CHECK → BUILD → RELEASE EVIDENCE → DEPLOY → VERIFY → MONITOR → ROLLBACK / IMPROVE

## Repository hygiene

Clear canonical docs, locked dependencies where applicable, separated configuration, risk-appropriate tests, no secrets/PII, release reference, ownership/rights record.

## Testing layers

1. Unit correctness.
2. Integration/interface behavior.
3. Browser/API acceptance where applicable.
4. Security and data-boundary checks.
5. Deployment verification.
6. Real-user operational evidence.

Engineering tests prove implementation behavior; they do not prove customer value.

## Data

Use no persistence when unnecessary. If persistence becomes justified, document purpose, retention, access, deletion, backup, recovery, and lawful basis first. For current Cloudflare architecture, D1/R2 may be considered only when validated requirements demand them.

## Secrets and access

Use approved secret stores/environment configuration. Never commit credentials, production keys, private customer data, or private business records. Use least privilege.

## Deployment

Record source commit, environment/project, deployment identifier/URL, verification result, and rollback reference.

Current public host: webapp-4.pages.dev. Strategic domain holberry.biz remains pending independent control/TLS verification.

## Backup and recovery

For stateful systems define backup scope, frequency, retention, access, restore procedure, restore verification, acceptable data loss/time, and owner.

A backup never restored is not proven recovery.

## Observability

Monitor useful signals: availability, errors, latency where relevant, job failures, delivery failures, support incidents, and resource/cost thresholds. Avoid surveillance-heavy analytics without purpose.

## Technical definition of done

Implementation matches scope, tests pass, security/data boundary checked, build reproducible, deployment verified, rollback known, release evidence recorded.

Technical readiness never implies operational, commercial, legal, or customer validation.
