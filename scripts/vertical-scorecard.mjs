import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

export const dimensions = ['demand','problem','repeatability','unit_economics','operational_fit','product_fit'];
export function evaluateVertical(candidate) {
  if (!candidate || typeof candidate !== 'object' || Array.isArray(candidate)) throw new Error('Candidate object required');
  if (candidate.legal_blocker === true || candidate.privacy_blocker === true) return { recommendation:'NO_GO', reasons:['Legal/privacy blocker'], authority:'Decision aid, not launch approval' };
  const reasons=[]; let total=0;
  for (const name of dimensions) {
    const value=candidate.scores?.[name];
    if(value===null || value===undefined) { reasons.push(name+': unknown evidence'); continue; }
    if(!Number.isInteger(value)||value<0||value>5) throw new Error(name+': integer score0–5 or null required');
    total+=value;
    if(value<3)reasons.push(name+': below3');
    const evidence=candidate.evidence?.[name];
    if(!evidence || typeof evidence.source!=='string' || !evidence.source.trim() || !/^\d{4}-\d{2}-\d{2}$/.test(evidence.date||'') || !Number.isInteger(evidence.sample) || evidence.sample<1 || typeof evidence.limitations!=='string' || !evidence.limitations.trim())reasons.push(name+': source/date/sample/limitations required');
  }
  for(const gate of ['rights_passed','evidence_passed','legal_review_passed','privacy_review_passed'])if(candidate[gate]!==true)reasons.push(gate+': not passed');
  if(total<24)reasons.push('Total below24/30');
  return {recommendation:reasons.length?'HOLD':'GO_TO_EXPERIMENT',total,maximum:30,reasons,authority:'Proposal only; accountable owner must approve budget/timebox. Scores are supplied evidence, not independently verified facts.'};
}
if(process.argv[1] && import.meta.url===pathToFileURL(process.argv[1]).href) {
  if(!process.argv[2])throw new Error('Usage: node scripts/vertical-scorecard.mjs <candidate.json>; do not put private evidence in public Git');
  console.log(JSON.stringify(evaluateVertical(JSON.parse(readFileSync(process.argv[2],'utf8'))),null,2));
}
