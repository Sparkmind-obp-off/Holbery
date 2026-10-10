# HOLBERY INTELLIGENCE OS — MASTER ARCHITECTURE

**Status:** Proposed execution architecture / internal-first strategy  
**Version:** V1.0  
**Date:** 2026-10-10  
**Repository:** `Sparkmind-obp-off/Holbery`  
**Parent brand:** HOLBERY  
**Decision rule:** Internal evidence first; external market activation only after an explicit readiness gate.

## 1. Executive Decision

HOLBERY will build an internal Intelligence OS before expanding external presence. Its purpose is to systematically discover, capture, normalize, evaluate, and prioritize digital evidence of business demand, then decide which opportunities are worth testing through public distribution.

This is one internal capability supporting HOLBERY SYSTEMS, PRODUCTS, VENTURES, and COMMERCE—not four unrelated products and not a public SaaS by default.

The Intelligence OS reduces dependence on offline interviews. It does not claim that public digital evidence alone proves willingness to pay. Actual commercial validation requires observable behavior such as qualified inbound interest, a signup or request, checkout initiation, a verified payment, and—where relevant—continued use or repeat purchase.

## 2. Operating Doctrine

1. **Evidence before exposure:** no broad public campaign simply because a product can be built.
2. **Source traceability:** every demand claim must link to source records, capture time, source type, and collection method.
3. **Separate observation from inference:** quoted/publicly observed evidence is not the same as an agent's interpretation.
4. **Deduplicate:** repeated copies, syndicated posts, and multiple posts from the same author must not be treated as independent demand.
5. **Measure commercial intent:** complaints, searches, requests for recommendations, requests for quotes, current spending, and actual transactions have different evidentiary weights.
6. **Use authorized access:** obey API terms, site terms, robots/access restrictions, privacy requirements, rate limits, and community rules. Do not scrape private spaces or automate prohibited posting/DMs.
7. **Human approval at consequential gates:** agents can research, score, draft, and recommend. Public campaigns, financial commitments, account access, and changes affecting customers require configured permissions and approval until the workflow has earned safe autonomy.
8. **No fabricated proof:** no fake customer records, testimonials, traffic, payments, market-size claims, or validation status.
9. **Kill weak opportunities early:** uncertainty should be recorded, not hidden behind a single score.
10. **Optimize for learning and revenue, not activity volume:** records collected, posts published, and tokens consumed are not business outcomes.

## 3. System Boundary

### Internal (private operator surface)

- Source registry and connector health
- Collection jobs and raw source records
- Evidence normalization, deduplication, and provenance
- Demand clusters and problem taxonomy
- Competitor and alternative-solution records
- Commercial-intent signals
- Opportunity scoring and uncertainty
- Decision ledger: reject / monitor / research more / ready for market test
- Offer briefs and experiment plans
- Channel policy registry and draft queue
- Experiment analytics and outcome ledger
- Audit log, budgets, rate limits, retention, and failure monitoring

### External (public-facing surface)

Activated only after the decision gate:

- HOLBERY-owned landing pages and product pages
- Search-oriented educational pages
- Public content and platform listings
- Community contributions where permitted
- Email/newsletter to opted-in recipients
- Checkout, product delivery, support, and consent-respecting analytics

Internal data and private notes must not be exposed by public endpoints. Source content should only be republished when rights, terms, and context allow it; otherwise publish a concise original synthesis with links/citations and no unnecessary personal data.

## 4. Intelligence Modules

### 4.1 Demand Intelligence

Purpose: capture signals that people or businesses have a problem, need, job-to-be-done, or desired outcome.

Inputs:
- Search results and query suggestions from permitted sources
- Public forums and community posts accessible under applicable terms
- Public product/service reviews
- Public marketplace listings and pricing pages
- Public requests for recommendations, quotes, tools, or alternatives
- Public job listings and service listings that reveal repeated manual work
- HOLBERY-owned first-party events with appropriate consent

Outputs:
- Raw source record
- Canonical problem statement
- Segment and context hypothesis
- Observed intent type
- Frequency and recency
- Independent-source count
- Provenance and confidence

### 4.2 Discovery Intelligence

Purpose: explain a demand signal rather than merely count it.

Tasks:
- Identify who experiences the problem and in what context
- Extract current workaround and alternatives
- Capture stated cost, delay, risk, or lost opportunity where explicitly evidenced
- Identify what people already pay for, if observable
- Map existing competitors and substitutes
- Record unmet needs and contradictions
- Keep exact evidence excerpts short and attributable; preserve original URLs and timestamps

Outputs:
- Evidence-backed problem dossier
- Alternative/competitor map
- Unanswered questions
- Confidence and limitations

### 4.3 Opportunity Intelligence

Purpose: rank business opportunities that fit HOLBERY's identity and capabilities.

Initial scoring dimensions (0–5 each, with written rationale):
- Evidence strength and source diversity
- Recurrence and recency
- Commercial intent
- Severity / economic consequence
- Identifiable reachable segment
- Gap versus existing alternatives
- HOLBERY strategic fit
- Feasibility and time-to-first-offer
- Repeatability / reusable system potential
- Distribution feasibility

Penalties:
- Weak or inaccessible evidence
- High dependence on a single platform
- Saturated market with no credible differentiation
- Unclear buyer or payer
- High integration / compliance burden
- Inability to deliver a truthful outcome
- Strong negative evidence or failed prior tests

A score is a prioritization aid, not a claim of objective market truth. Preserve dimension scores, rationale, source references, and uncertainty; never store only a composite number.

### 4.4 Evidence & Validation Intelligence

Evidence classes:
- **D0 — Hypothesis:** an idea or model-generated claim with no external support.
- **D1 — Observed signal:** attributable public evidence that a problem or need exists.
- **D2 — Repeated pattern:** independent sources show a similar problem.
- **D3 — Commercial signal:** evidence of current spending, buying intent, quote requests, paid alternatives, or qualified inbound interest.
- **D4 — Market-test behavior:** real visits, signups, demo/request submissions, checkout initiation, or other measured behavior tied to a specific offer.
- **D5 — Verified transaction:** genuine payment confirmed by the authoritative payment system.
- **D6 — Outcome / repeatability:** customer outcome, repeated use, renewal, repeat purchase, or independent repeat transactions.

D0–D3 can justify designing a market test. They do not justify claiming paid demand. D4 is behavior, not necessarily revenue. D5 requires actual payment verification. D6 requires evidence of value or repeatability.

### 4.5 Offer Intelligence

Given an approved opportunity, prepare:
- Target segment and job-to-be-done
- Problem statement and evidence references
- Proposed outcome and explicit limitations
- Smallest deliverable offer
- Differentiation from alternatives
- Pricing hypothesis and cost-to-serve estimate
- Landing-page brief and channel-specific draft assets
- Measurement plan and pass/fail thresholds
- Refund/support/delivery implications
- Kill, revise, or expand conditions

### 4.6 Distribution Intelligence

Purpose: route a validated offer to appropriate channels without indiscriminate broadcasting.

For each channel, store:
- Access method: official API, approved integration, permitted public interface, or manual-only
- Terms and posting constraints
- Authentication and scopes
- Rate limits and budget
- Allowed content/action types
- Approval requirement
- Result metrics and attribution method

Agents may create drafts automatically. Publishing can be automated only where the platform and account authorization permit it. No mass unsolicited DMs, evasion of platform limits, private-group scraping, fake engagement, or repetitive spam. When automation is disallowed, prepare a publish-ready package and track it as awaiting authorized publication.

### 4.7 Learning Intelligence

Ingest first-party results:
- Landing-page visits and qualified source attribution
- CTA clicks and signup/request completion
- Qualified inquiries
- Checkout starts and payment attempts
- Verified payment events
- Delivery completion, refund/support events, and repeat usage where available

Use privacy-minimizing, documented event schemas. Respect consent, DNT/GPC where applicable, retention policies, and applicable law. Never infer unique people from session counts without a defensible method.

## 5. Recommended Technology Stack

Use the existing HOLBERY deployment as the first runtime. Avoid introducing another database or platform without a demonstrated requirement.

- **Runtime/API:** TypeScript + Hono on Cloudflare Workers/Pages, consistent with the current repository.
- **Primary structured store:** existing dedicated Cloudflare D1 database for internal operational metadata and evidence indexes. Keep intelligence tables logically separated from commerce tables, with migrations and access controls.
- **Raw artifacts:** Cloudflare R2 private bucket for permitted snapshots, normalized payloads, reports, and source artifacts when storage is lawful and necessary. Prefer minimal excerpts plus URL/provenance when full copies are unnecessary or disallowed.
- **Background work:** Cloudflare Queues for ingestion/normalization/scoring jobs; scheduled Workers for polling and recurring runs.
- **Coordination:** Durable Objects only when a real need for serialized state, distributed coordination, or per-source rate limiting is demonstrated.
- **Collection:** official platform APIs first; Apify Actors as pluggable connectors for sources/use cases whose access and terms permit the intended collection. Do not hard-code dependence on one actor. Validate each actor's input/output, pricing, limits, and data rights before production use.
- **Search/discovery:** permitted search APIs or licensed search providers; cache provenance and result metadata. Search result snippets are leads, not full source truth.
- **AI/LLM:** provider-agnostic adapter for extraction, clustering assistance, synthesis, and draft generation. Use deterministic code for IDs, deduplication, scoring arithmetic, permissions, quotas, and state transitions. LLM output is untrusted until schema-validated and tied to evidence.
- **Repository/CI:** GitHub, strict TypeScript, unit/integration tests, fixture datasets, secret scanning, and Cloudflare BYOK deployment workflow.
- **Commerce:** reuse the existing HOLBERY commerce implementation and Duitku adapter. Never build a parallel checkout or declare payment success based on browser redirects.
- **Operator interface:** private, authenticated internal dashboard; no internal records in public bundles or public API responses.

### Why not introduce Neon now?

The repository already uses a dedicated production D1 database. A second database adds synchronization, secrets, migration, backup, and operational complexity. Start with D1 for structured metadata and R2 for larger artifacts. Reconsider PostgreSQL only if measured query, relational, concurrency, or analytics requirements exceed the chosen design and a migration plan is justified.

## 6. Initial Data Model

Logical entities (names are proposed; migrations must follow the repository's current schema conventions):

- `source_registry`: source ID, source class, access mode, terms reviewed date, allowed operations, rate limits, retention class, active state.
- `collection_runs`: source ID, run ID, scheduled/started/finished times, status, item counts, cost units, error summary.
- `source_records`: canonical record ID, source ID, external ID/hash, URL, published/captured timestamps, content type, normalized excerpt, language, author pseudonymous key if needed and lawful, content hash, access/retention classification.
- `evidence_items`: claim, supporting source-record IDs, evidence type, observed text/span, confidence, counter-evidence, created time.
- `problem_clusters`: canonical problem, segment hypothesis, context, frequency, recency, independent source count, current state.
- `alternatives`: competitor/substitute, URL, observed features, pricing evidence, capture time.
- `opportunities`: problem cluster, buyer hypothesis, proposed outcome, strategic fit, score vector, uncertainty, stage, owner/agent, next decision date.
- `offers`: opportunity ID, offer version, deliverables, pricing hypothesis, costs, claims/limitations, landing page, status.
- `experiments`: hypothesis, audience, channel, asset/version, budget cap, start/end, threshold, outcome.
- `experiment_events`: consented/allowed event, source attribution, timestamp, minimal payload, deduplication key.
- `decisions`: decision, rationale, evidence IDs, reviewer/agent, timestamp, expiry/review date.
- `audit_events`: actor, action, object, timestamp, outcome; never log secrets or unnecessary personal data.

Every record must have provenance, versioning where meaningful, and a deletion/retention policy. Build actual D1 migrations only after checking the current migration sequence and schema; do not create production tables by editing historical schema files.

## 7. Decision Gate: When May HOLBERY Go External?

An opportunity may become **READY FOR MARKET TEST** only when all applicable conditions pass:

1. At least three independent, attributable source records support the problem, unless a documented exceptional case explains why a different evidence base is appropriate.
2. At least two different source types or channels support the pattern where feasible.
3. Sources are recent enough for the market and problem; stale evidence is flagged.
4. The buyer, user, and payer hypotheses are explicit.
5. Existing alternatives and competitor pricing have been reviewed.
6. Commercial-intent signals and counter-evidence are recorded.
7. A specific offer, deliverable, price hypothesis, and landing page exist.
8. Delivery capability, support, privacy, legal, and refund implications are reviewed.
9. A channel plan follows the platform's rules and authorization.
10. A measurable test and explicit stop/revise thresholds exist.
11. No material claim in public copy exceeds the available evidence.
12. The decision is recorded in the private ledger.

This gate authorizes a limited market test, not a claim that demand is proven. Only real observed behavior can advance the evidence class.

A limited number of sources does not automatically mean weak evidence; quality, independence, recency, context, and commercial intent matter. Agents should flag exceptions rather than manufacture completeness.

## 8. Internal-to-External Workflow

1. Register a source and confirm access method, terms, and retention policy.
2. Run a bounded collection job with quota and cost limits.
3. Validate payload schema and store provenance.
4. Normalize language/content and deduplicate exact and near-duplicate records.
5. Extract claims and evidence spans; preserve source URLs and timestamps.
6. Cluster related problems and attach counter-evidence.
7. Map alternatives, competitors, prices, and current workarounds.
8. Score opportunities and estimate uncertainty.
9. Generate an evidence dossier and recommended next decision.
10. Pass the decision gate; reject, monitor, research more, or approve a bounded test.
11. Generate offer and channel assets.
12. Publish only via authorized channels; attribute activity.
13. Capture first-party behavior and verified commerce outcomes.
14. Compare outcomes with thresholds and record continue / revise / stop.
15. Feed the learning back into problem, segment, offer, and channel models.

## 9. Cost and Reliability Controls

- Every collection run has a maximum item count, time limit, and provider-cost budget.
- Deduplicate before expensive LLM processing.
- Use deterministic filters and small/batched model calls before deep analysis.
- Cache unchanged source records and avoid repeatedly fetching identical pages.
- Track actual provider cost per run and per qualified opportunity.
- Retry transient errors with bounded backoff; quarantine malformed or policy-unclear sources.
- Include source health and freshness; failed jobs must not silently appear as zero demand.
- Keep a kill switch for each connector and for all scheduled collection.
- Use idempotent job IDs and record run outcomes.
- Do not assume Genspark credits are runtime infrastructure. Genspark helps build and maintain the system; production collection must use configured providers and budgets.

## 10. Security, Privacy, and Governance

- Private dashboard requires authentication and server-side authorization.
- Public endpoints expose only intentionally published offers/content.
- Secrets stay in Cloudflare secret storage; never commit credentials or put them in prompts/logs.
- Store the minimum personal data needed. Prefer pseudonymous author identifiers only where lawful and necessary.
- Define retention and deletion behavior per source class.
- Respect opt-outs, takedown requests, platform restrictions, and data subject rights as applicable.
- Do not scrape behind authentication, paywalls, or group membership barriers without explicit authorization.
- Do not publish private source content or identifiable personal details without a lawful basis and appropriate permission.
- Maintain a manual kill switch and audit trail for automated publishing.
- Keep production commerce truth in the existing verified payment system.

## 11. Repository Strategy

Start inside `Sparkmind-obp-off/Holbery` as a modular subsystem. Do not split into separate repositories merely to make the architecture look larger.

Proposed boundaries:
- `src/intelligence/sources/`
- `src/intelligence/ingestion/`
- `src/intelligence/normalization/`
- `src/intelligence/evidence/`
- `src/intelligence/clusters/`
- `src/intelligence/opportunities/`
- `src/intelligence/offers/`
- `src/intelligence/distribution/`
- `src/intelligence/learning/`
- `src/intelligence/policy/`
- `migrations/` (append-only numbered migrations)
- `scripts/intelligence/`
- `tests/intelligence/`
- `docs/intelligence/`

These are target boundaries, not a claim that the folders or modules already exist. First inspect the current repository tree, package scripts, migrations, deployment workflow, and existing private event instrumentation. Reuse and extend existing capabilities where sound.

Split a connector or worker into another repository only when it needs independent permissions, deployment cadence, runtime, or security boundary. Keep the HOLBERY brand and decision ledger canonical.

## 12. Implementation Roadmap

### I0 — Repository and access audit
- Inspect the current tree, migrations, tests, release records, environment bindings, and current evidence/event collection.
- Inventory available API credentials and approved access scopes without printing secrets.
- Deliver: audit report, source capability matrix, risk list, exact baseline commit.

Exit: no duplicate database or conflicting schema introduced.

### I1 — Intelligence contract and source registry
- Define strict schemas for source, run, source record, evidence, problem cluster, opportunity, decision, and experiment.
- Create source registry with allowed access mode, policy review, limits, and retention.
- Implement a fixture-only pipeline before connecting live sources.

Exit: fixtures validate; provenance and policy checks are enforced.

### I2 — First authorized ingestion connectors
- Select two or three high-value source classes, not every platform at once.
- Prefer official/publicly permitted access and search-provider results.
- Add one Apify Actor only after inspecting its exact schema, price/limits, data access method, and terms compatibility.
- Implement quotas, idempotency, deduplication, error handling, and run-cost records.

Exit: repeatable ingestion with known source coverage and no unbounded jobs.

### I3 — Evidence and Discovery engine
- Extract problem, context, current workaround, commercial intent, alternatives, and counter-evidence.
- Every generated claim points to supporting source IDs.
- Add human-readable evidence dossiers and uncertainty labels.

Exit: reviewer can trace every key conclusion to source records.

### I4 — Opportunity scoring and decision ledger
- Implement transparent dimension scoring with rationale and penalty rules.
- Support REJECT / MONITOR / RESEARCH MORE / READY FOR MARKET TEST.
- Require a dossier and explicit gate checks before READY.

Exit: decisions are reproducible, versioned, and auditable.

### I5 — Private operator dashboard
- Search and filter evidence, clusters, opportunities, source health, and run costs.
- View source evidence, counter-evidence, scoring breakdown, and gate blockers.
- Add pause/kill controls for connectors and jobs.

Exit: no private intelligence record leaks to public surfaces.

### I6 — Offer generation and bounded market test
- Generate offer brief, price hypothesis, landing page/content drafts, and measurement plan.
- Integrate with existing HOLBERY public pages and commerce instead of duplicating checkout.
- Require approved channel policy and an authorized publish action.
- Start with one opportunity and a bounded test.

Exit: a traceable experiment runs with defined budget, metrics, and stop conditions.

### I7 — Outcome feedback
- Connect first-party event analytics, qualified inquiries, checkout and authoritative payment events.
- Distinguish visits, intent, and verified payment.
- Record support, delivery, refund, and repeat-use signals where available.

Exit: one complete trace from public source evidence → decision → offer → external behavior → learning.

## 13. First Release Scope

The first release is NOT a universal social scraper, not an autonomous spam agent, and not a multi-tenant public SaaS.

Include:
- Private source registry
- Bounded ingestion for 2–3 permitted source classes
- Provenance-preserving source records
- Evidence extraction and problem clustering
- Transparent opportunity scoring
- Decision dossier and readiness gate
- Private operator dashboard or review interface
- Manual/approved publication handoff
- Basic experiment and cost tracking

Exclude initially:
- Every social platform at once
- Private-group scraping or account-session impersonation
- Autonomous mass posting or unsolicited DMs
- Autonomous spending/paid ads
- Claims that digital signals prove willingness to pay
- New public subscription product for the intelligence engine
- Premature microservices or multiple repositories
- New database provider without a demonstrated need

## 14. Definition of Done

The Intelligence OS is operationally credible when:
- Every finding can be traced to source records and capture time.
- Duplicates and syndicated evidence are controlled.
- Source permissions, limits, and retention are explicit.
- Model-generated claims are schema-validated and grounded.
- Counter-evidence and uncertainty are visible.
- Opportunity scores have readable rationales.
- A documented gate separates internal research from external activation.
- One bounded market test can be launched through an authorized channel.
- Results distinguish traffic, qualified interest, checkout, verified payment, and outcomes.
- Collection and model costs are measured.
- Jobs can be paused, retried, audited, and deleted according to policy.
- No claim of customer validation is made without matching evidence.

## 15. Strategic Outcome

HOLBERY should not need to start each new product from zero. Its durable asset is the accumulating system of source knowledge, demand patterns, evidence quality, opportunity decisions, offer experiments, channel performance, and commercial outcomes.

The Intelligence OS is an internal compounding capability. Public products and campaigns are outputs of that capability—not substitutes for it.

**Canonical sequence:**
`OBSERVE → DISCOVER → VERIFY → SCORE → DECIDE → PACKAGE → PUBLISH → MEASURE → LEARN`

**External activation rule:** no broad presence before an opportunity dossier passes the market-test gate. A passed gate authorizes a controlled test; only real outcomes can establish commercial proof.
