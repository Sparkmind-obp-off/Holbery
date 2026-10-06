# HOLBERY — Deployment and Digital Foundation

Phase 4 | IMPLEMENTED + VERIFIED on Cloudflare BYOK, 2026-10-05.
Primary strategic domain: holberry.biz. Live host: **https://webapp-4.pages.dev**.

## Evidence and actual scope

Hono + TypeScript + Vite Cloudflare Pages adapter; npm lockfile; PM2 preview port 3000. Ten HTML routes, health API, sitemap/robots, favicon, responsive CSS, SEO/Open Graph metadata, CSP/security headers, public approach hub and contact. Public pages do not expose private project names or registry records. GitHub repository is public, main branch and Issues enabled, verified through GitHub API. Contact uses that real channel; no invented email or nonfunctional form.

Initial deployment: https://b4e7bd9f.webapp-4.pages.dev. Stable host verified by HTTP suite and Chromium. First propagation checks reported TLS/522; stable host subsequently passed all tested pages/assets. Deploy-specific URL is not the preferred canonical. Latest rollout evidence is updated during final integration.

Project name selection: default webapp and webapp-2 collided; webapp-3 was already an unrelated existing project and was not touched. New webapp-4 created. Name saved in cloudflare_project_name metadata. Repository name and brand remain HOLBERY, not webapp-4.

## Custom domain — REQUIRES USER ACTION

Token successfully lists account zones but exact query for holberry.biz returns none. This proves absence from accessible zones, not global ownership/availability. No DNS mutation, transfer, redirect or domain purchase performed. Canonical/sitemap use verified Pages host until domain control and TLS are verified; changing SEO to an unverified host would misrepresent readiness.

Owner must confirm exact spelling, registrant/control, and registrar; add the domain to their Cloudflare account and configure correct nameservers if appropriate. Then Pages → webapp-4 → Custom domains → Set up domain → holberry.biz. Review existing DNS/services before changes. Verify HTTPS, A/AAAA/CNAME as applicable, and intended www redirects. Only then update origin in src/index.ts, rebuild and redeploy. Do not repurpose historical domain without explicit approval.

## Email, social, analytics, GitHub architecture

Email targets hello@, support@, legal@holberry.biz are design references only: NOT ACTIVE and not on contact page. Configure provider, SPF/DKIM/DMARC, recovery/2FA after domain verified. Social preferred @holbery remains UNVERIFIED; reserve only after checks. Existing owner/repo reused; no organization or duplicate repo created. Public documentation hub at /docs is curated, not a raw internal-doc mount.

Cloudflare hosting metrics are the initial operational observability channel. No visitor analytics/marketing scripts configured. Web Analytics/RUM can be enabled later with explicit data-purpose/consent review; no invented token or fake metric. /api/health supports uptime checks. Privacy page states actual application behavior.

## Reproducible commands

```sh
cd /home/user/webapp
npm ci
npm run typecheck
npm test
npm run build
pm2 start ecosystem.config.cjs
node scripts/check-http.mjs
node scripts/browser-check.mjs
# Only after BYOK setup and metadata/account verification:
npx wrangler whoami
npx wrangler pages deploy dist --project-name webapp-4 --branch main
BASE_URL=https://webapp-4.pages.dev node scripts/check-http.mjs
BASE_URL=https://webapp-4.pages.dev node scripts/browser-check.mjs
```

Never run wrangler login. Credentials live in sandbox environment/Cloudflare secrets, not frontend or git. Commerce now requires the dedicated DB binding holbery-commerce-production and applied migrations. Disabled foundation deployment requires no merchant secrets and MUST keep COMMERCE_ENABLED=false. Enabling checkout requires DUITKU_MERCHANT_CODE, DUITKU_API_KEY and COMMERCE_ADMIN_TOKEN in Pages production secrets, correct environment/origin, and approved commercial policy/product. /api/commerce/readiness returns503 with explicit blockers until the gate is satisfied. npm run deploy uses wrangler.jsonc name; check it against saved metadata before execution. Worker build emits _worker.js/_routes.json; static files are public/static. _headers secures static responses; Hono secureHeaders secures dynamic pages. Explicit catch-all produces real 404s and avoids adapter reliance on private notFoundHandler.

## Rollback / release

Tag or record source commit and deployment URL; rerun tests before release. Roll back to a known successful Pages deployment via dashboard or rebuild a known commit; do not reset/delete current source history. Apply forward migrations with `npx wrangler d1 migrations apply holbery-commerce-production --remote` only after local validation. Never drop production tables; rolling back a Worker does not undo data migrations. Monitor health, render errors, 404s, asset delivery, and certificate status. Browser/HTTP tests do not certify legal readiness, performance SLA or full accessibility conformance.

## Verified final research-toolkit rollout

Source commit 02202ca6617ea139ef2db6bd810676e58188efac, deployed to https://e0e8c8b2.webapp-4.pages.dev; stable https://webapp-4.pages.dev. Production HTTP10 pages/18 targets and Chromium responsive/calculator workflow checks passed. Exact sanitized evidence: [release.json](evidence/release.json). Source commit was pushed and matched GitHub remote main; following documentation-only evidence commit does not change deployed application code.
