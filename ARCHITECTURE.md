# HOLBERY — Technical Architecture

v1.1 | 2026-10-05. Strategic domain holberry.biz; live technical host https://webapp-4.pages.dev.
Parent definition: [HOLBERY-MASTER.md](HOLBERY-MASTER.md). Portfolio hierarchy: [MASTER-ARCHITECTURE.md](MASTER-ARCHITECTURE.md). Deployment evidence: [DEPLOYMENT.md](DEPLOYMENT.md).

## Canonical hierarchy

HOLBERY → SYSTEMS / PRODUCTS / VENTURES / COMMERCE. Technical implementation does not introduce another parent brand or fifth pillar. Category and lifecycle remain separate dimensions.

## Current implementation

Hono on Cloudflare Pages/Workers; TypeScript; Vite Pages build. Dynamic informational pages rendered server-side. CSS, original SVG assets, browser-only code and downloadable templates in public/. No third-party CDN dependency required for frontend. No runtime fs/Node APIs or database. Browser calculators use pure functions; inputs are not sent, persisted or logged by application code.

```text
/
├── *.md                  # Canonical system and phase deliverables
├── src/index.ts          # Public routes, metadata, security headers
├── public/static/        # CSS, JS, original SVGs
├── public/downloads/     # Sanitized reusable templates only
├── registries/           # Versioned structural records; NO customer PII
├── scripts/              # Build/test/verification helpers (Node/Python at build time only)
├── tests/                # Unit/governance/data-boundary tests
├── evidence/             # Sanitized phase/deployment/check results
├── archive/legacy-parent-house/ # NON-KANONIS; byte-exact preserved history
├── package.json / package-lock.json
├── vite.config.ts / tsconfig.json / wrangler.jsonc
└── ecosystem.config.cjs  # Local preview via PM2
```

Build output dist/ and local .wrangler state are ignored. Internal governance records are not imported into public app bundle. /docs is curated public guidance, not a raw file server for the repository. No identity/access multi-tenant platform, giant SaaS, payment service, or customer database is built speculatively.

## Architecture principles

Clarity first; modularity when patterns repeat; smallest delivery model first; real user evidence before scale; one source of truth; private stays private. Do not copy Bozq data/code/IP. All operational asset/identity decisions are recorded. Use D1 for relational/key-value persistence or R2 for files if future Cloudflare application data genuinely requires them; never runtime filesystem/memory persistence. Secrets only in Cloudflare secrets or ignored local configuration.

## Security and publication

Hono secureHeaders protects worker responses; public/_headers protects static assets. CSP allows self-only scripts/styles and blocks framing/object embedding; referrer/permissions/nosniff headers set. No inline script/unsafe HTML from request input. GET health is informational and exposes no credentials. Unknown methods/routes receive 404 through explicit catch-all.

Dependencies locked; production audit and all-dependency audit performed at release. Public code has no user-issued license yet; dependency license inventory lives in LEGAL-IP-REGISTER. Registrar, email and legal ownership controls remain external workstreams.

## Growth boundary

Add auth/storage/forms/payments only when a validated requirement and legal/data-purpose review exist. Shared core should expose small interfaces and preserve brand/data isolation. Entity spin-offs, licensing, cron/queue or persistent runtime services are not implied by this architecture. Platform limitations must be rechecked before introducing such capabilities.
