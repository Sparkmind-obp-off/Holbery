import { readFileSync, existsSync } from 'node:fs';
import assert from 'node:assert/strict';
const files = {
  1: ['BRAND-FOUNDATION.md'],
  2: ['MASTER-ARCHITECTURE.md', 'PROJECT-LIFECYCLE.md'],
  3: ['BRAND-GOVERNANCE.md', 'NAMING-SYSTEM.md'],
  4: ['DEPLOYMENT.md'],
  5: ['LEGAL-IP-REGISTER.md', 'ASSET-REGISTER.md', 'CLEARANCE-TRACKER.md'],
  6: ['OPERATING-SYSTEM.md', 'OPPORTUNITY-TEMPLATE.md', 'PROJECT-TEMPLATE.md', 'VALIDATION-TEMPLATE.md', 'LAUNCH-TEMPLATE.md', 'KPI-FRAMEWORK.md'],
  7: ['BARBER-BUSINESS-SYSTEM.md', 'MVP-SPEC.md', 'CUSTOMER-PROBLEM.md', 'PRICING-HYPOTHESIS.md', 'VALIDATION-PLAN.md'],
  8: ['PRODUCTIZATION.md', 'PRODUCT-CATALOG.md', 'OFFER-FRAMEWORK.md', 'REVENUE-MODEL.md'],
  9: ['VERTICAL-EXPANSION.md', 'VERTICAL-SCORECARD.md', 'VERTICAL-TEMPLATE.md'],
  10: ['ECOSYSTEM-STRATEGY.md', 'VENTURE-GRADUATION.md', 'SCALE-FRAMEWORK.md'],
};
const phase = Number(process.argv[2]);
// Legacy deliverable groups are document readiness, NOT roadmap-v2 maturity stages.
// --implemented verifies every existing complete group; a partial group fails loudly.
const groups = Object.keys(files).map(Number);
const implemented = groups.filter(n => files[n].some(path => existsSync(path)));
const phases = process.argv.includes('--implemented') ? implemented : phase ? [phase] : groups;
assert(phases.length > 0, 'No document groups selected: refusing zero-check success');
console.log('Document readiness only; legacy groups9/10 map to active roadmap10/11–12, not Commercial Proof completion.');
let count = 0;
for (const n of phases) {
  assert(files[n], 'Unknown phase');
  for (const path of files[n]) {
    assert(existsSync(path), `Missing ${path}`);
    const text = readFileSync(path, 'utf8');
    assert(text.length >= 500, `${path}: insufficient specification`);
    assert(text.startsWith('# '), `${path}: missing title`);
    assert(text.includes('HOLBERY'), `${path}: missing parent reference`);
    for (const [, link] of text.matchAll(/\[[^\]]*\]\(([^)]+)\)/g)) {
      if (!/^(https?:|mailto:|#)/.test(link)) assert(existsSync(link.split('#')[0]), `${path}: broken link ${link}`);
    }
    assert(!/(?:gh[pousr]_[A-Za-z0-9]{20,}|sk-[A-Za-z0-9]{20,}|-----BEGIN PRIVATE KEY-----)/.test(text), `${path}: secret pattern`);
    count++;
  }
  if (n === 1) for (const section of ['Vision','Mission','Purpose','Positioning','Brand promise','Personality','Strategic audience','Strategic territory','Value proposition','Differentiation','IS / IS NOT','Long-term direction','Brand principles']) assert(readFileSync(files[1][0], 'utf8').includes(`## ${section}`), section);
  console.log(`PASS phase ${n}: required documents, scope, links, basic secret-pattern checks`);
}
console.log(`PASS ${count} phase documents (not proof of legal clearance or customer validation)`);
