# HOLBERY

**Master Parent Brand System — v1.2**

Build. Operate. Grow.
Practical systems, products, and ventures.

## Actual status

**Phase 0–7 COMPLETE at deliverable scope; Phase 8–10 PENDING.** Execution paused for wrap-up at the user's latest instruction, not because a later phase was silently completed. HOLBERY remains the master parent, not a single barber/AI/SaaS/agency product. Full operational/commercial Definition of Done has NOT been achieved.

- Production BYOK website: **https://webapp-4.pages.dev**.
- Functional research MVP: **https://webapp-4.pages.dev/systems/barber**.
- Existing GitHub repository: **https://github.com/Sparkmind-obp-off/Holbery**, branch main. Source02202ca pushed and remote SHA matched; release/push verification recorded in EXECUTION-REPORT and evidence/release.json.
- Strategic primary domain: **holberry.biz**. No accessible CF zone, RDAP404 and DNS NXDOMAIN on 2026-10-05. Ownership/control NOT VERIFIED; custom-domain setup BLOCKED pending owner action. No DNS changes or registration purchase performed.
- Legal/trademark clearance NOT COMPLETE. Near-spelling screening lead recorded; authoritative review requires qualified counsel.
- Barber system lifecycle EXPERIMENT, actual operators0, interviews0, paid commitments0. Unit/browser tests are engineering evidence only.
- Bozq One System remains private/internal Bosku Cukur; no private code, assets, customers, credentials or IP imported.

## Canonical documentation

Start with [HOLBERY-MASTER.md](HOLBERY-MASTER.md). The canonical parent library is [HOLBERY-LIBRARY.md](HOLBERY-LIBRARY.md). Status tracker: [ROADMAP.md](ROADMAP.md). Decisions: [DECISIONS.md](DECISIONS.md). Current report: [EXECUTION-REPORT.md](EXECUTION-REPORT.md).

| Phase | Deliverables |
|---|---|
| 1 | [Brand foundation](BRAND-FOUNDATION.md): vision/mission/purpose/positioning/promise/personality/audience/territory/value/differentiation/IS/IS NOT |
| 2 | [Master architecture](MASTER-ARCHITECTURE.md), [project lifecycle](PROJECT-LIFECYCLE.md) |
| 3 | [Brand governance](BRAND-GOVERNANCE.md), [naming system](NAMING-SYSTEM.md), [brand rules](BRAND-RULES.md) |
| 4 | [Technical architecture](ARCHITECTURE.md), [deployment/configuration/rollback](DEPLOYMENT.md), public website |
| 5 | [Legal/IP register](LEGAL-IP-REGISTER.md), [asset register](ASSET-REGISTER.md), [clearance tracker](CLEARANCE-TRACKER.md) |
| 6 | [Operating system](OPERATING-SYSTEM.md), [opportunity/discovery](OPPORTUNITY-TEMPLATE.md), [project/product definition](PROJECT-TEMPLATE.md), [experiment/validation](VALIDATION-TEMPLATE.md), [launch/operations](LAUNCH-TEMPLATE.md), [KPI](KPI-FRAMEWORK.md) |
| 7 | [Barber system](BARBER-BUSINESS-SYSTEM.md), [MVP spec](MVP-SPEC.md), [customer problem](CUSTOMER-PROBLEM.md), [pricing hypothesis](PRICING-HYPOTHESIS.md), [validation plan](VALIDATION-PLAN.md); functional calculator/CSV/checklist |

Hierarchy: HOLBERY → LIBRARY → SYSTEMS / PRODUCTS / VENTURES / COMMERCE / KNOWLEDGE / CAPABILITIES / ASSETS. The Library is the canonical parent layer; category and lifecycle are separate. Products and capabilities do not automatically need a child brand or venture entity. Child brands are a later graduation decision based on evidence and strategic separation.

[Historical archive](archive/legacy-parent-house/README.md) is NON-CANONICAL. Its 19 original files remain byte-identical to baseline9babed0. Historical domain/hierarchy/status statements do not apply to current roadmap. Archive paths changed; external old links may need updates.

## Functional entry URIs

| Path | Purpose / parameters |
|---|---|
| / | Public parent headquarters |
| /about | What HOLBERY is |
| /systems, /products, /ventures, /commerce | Four pillars with truthful development/framework status |
| /contact | Real public GitHub Issues enquiry; GitHub account required; no confidential data |
| /docs | Curated public method, not internal document mount |
| /privacy | Actual site data boundaries; no contact form/customer database/marketing trackers |
| /systems/barber | Browser-only daily-close calculator; required inputs services, price, openingCash, cashReceipts, digitalReceipts, cashExpenses, actualCash |
| /downloads/daily-close.csv | Blank daily aggregate close template |
| /downloads/weekly-review.csv | Blank aggregate weekly review template |
| /downloads/barber-onboarding.html | Printable workflow/checklist |
| /downloads/third-party-notices.txt | Preserved MIT runtime notice |
| /api/health | GET JSON health, no parameters or secrets |
| /robots.txt, /sitemap.xml | SEO discovery; canonical host stays verified Pages host until domain control/TLS |

Unknown routes/methods return404. No accounts, payment processing, CRM/loyalty/reminder services or database are implemented.

## Data architecture / security

Hono + TypeScript + Vite Cloudflare Pages; original SVG/CSS, no external frontend CDN. Browser calculator is pure computation: inputs are neither transmitted nor saved by application code. Downloads are blank sanitized templates stored on operator device. Cloudflare may process request metadata under hosting policies.

Structural process records in registries/ are versioned JSON/CSV, not runtime application data. Nine metadata fields mandatory; duplicate IDs/private projects/unsupported graduation rejected by CLI. Revenue/metrics/feedback trackers contain no fabricated customer rows. Private customer evidence must never be committed to this public repo. For future app persistence use D1/R2 only when necessary; no memory/file runtime storage.

CSP, nosniff, frame/referrer/permissions controls protect worker/static responses. Credentials remain outside code. 161 lockfile dependency license metadata entries inventoried; runtime Hono MIT notice preserved. No own-source open license or legal IP assignment inferred from public repo.

## Development / repeatable tests

```sh
cd /home/user/webapp
npm ci
npm run check
# Preview after build, using PM2:
pm2 start ecosystem.config.cjs
node scripts/check-http.mjs
node scripts/browser-check.mjs
# If Chromium missing: npx playwright install --with-deps chromium
BASE_URL=https://webapp-4.pages.dev node scripts/check-http.mjs
BASE_URL=https://webapp-4.pages.dev node scripts/browser-check.mjs
```

npm run check = typecheck + unit tests + implemented-phase/document integration audit + production build. 36 unit tests, HTTP route/asset checks and browser tests cover widths320/390/768/1440, navigation, calculator submit/errors. Tests do not certify full legal/a11y/security compliance. Full Phase1–10 document readiness check is `node scripts/check-phase.mjs`; it intentionally fails until pending deliverables exist. Implemented scope check is `--implemented`.

Project onboarding CLI example (DRY RUN ONLY, no real project/PII):

```sh
node scripts/new-project.mjs --dry-run --id EXAMPLE-ONLY --project-name "Example only" --category SYSTEMS --owner UNASSIGNED --repository "NOT REQUIRED YET" --domain "NOT REQUIRED YET" --customer-type Operator --revenue-model Hypothesis
```

## Deployment

User-selected **Cloudflare BYOK**, project webapp-4, production branch main; saved metadata and wrangler.jsonc agree. No unrelated existing project overwritten. After authorized token setup: `npx wrangler whoami`, build/tests, then `npx wrangler pages deploy dist --project-name webapp-4 --branch main`. Never wrangler login. No runtime secrets/bindings required. Full exact custom-domain/email/social/analytics/rollback steps in DEPLOYMENT.

## Master Library

[HOLBERY-LIBRARY.md](HOLBERY-LIBRARY.md) is now canonical. It defines the Library as HOLBERY's reusable knowledge/capability/asset/portfolio layer and establishes the promotion path from IDEA → RESEARCH → EXPERIMENT → PROTOTYPE → VALIDATED → PRODUCTIZED → COMMERCIAL → SCALE → optional CHILD BRAND / independent venture. No forced child-brand proliferation is intended.

## Remaining / next steps

User actions: confirm/register/control holberry.biz; verify legal owner and trademark/IP rights; provide private business email/support/approved commercial terms; nominate accountable pilot owner and two real operators. No actual pilot or revenue has been fabricated.

Phase8 (product catalog/offer/revenue framework), Phase9 (vertical engine/scorecard), Phase10 (ecosystem graduation/scale framework) remain NOT STARTED in this run due the latest wrap-up instruction. Pricing anchor in Phase7 is a hypothesis, not proof of Phase8 completion. Resume at Phase8 when execution is resumed; do not repeat Phase0 or start naming exploration.
