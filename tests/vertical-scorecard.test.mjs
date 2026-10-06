import {test} from 'node:test';
import assert from 'node:assert/strict';
import {evaluateVertical,dimensions} from '../scripts/vertical-scorecard.mjs';
// Synthetic engineering fixtures only, no real candidate/market scoring.
const fixture=()=>({scores:Object.fromEntries(dimensions.map(n=>[n,4])),evidence:Object.fromEntries(dimensions.map(n=>[n,{source:'SYNTHETIC test fixture',date:'2026-10-06',sample:3,limitations:'Not real field evidence'}])),rights_passed:true,evidence_passed:true,legal_review_passed:true,privacy_review_passed:true});
test('complete supplied evidence only proposes experiment',()=>assert.equal(evaluateVertical(fixture()).recommendation,'GO_TO_EXPERIMENT'));
test('unknown candidate holds',()=>assert.equal(evaluateVertical({}).recommendation,'HOLD'));
test('null score holds',()=>{const c=fixture();c.scores.demand=null;assert.equal(evaluateVertical(c).recommendation,'HOLD')});
test('below minimum dimension holds despite high total',()=>{const c=fixture();c.scores=Object.fromEntries(dimensions.map(n=>[n,5]));c.scores.demand=2;assert.equal(evaluateVertical(c).recommendation,'HOLD')});
test('total below24 holds',()=>{const c=fixture();c.scores.demand=3;assert.equal(evaluateVertical(c).recommendation,'HOLD')});
test('rights unknown holds',()=>{const c=fixture();delete c.rights_passed;assert.equal(evaluateVertical(c).recommendation,'HOLD')});
test('missing evidence holds',()=>{const c=fixture();delete c.evidence.problem;assert.equal(evaluateVertical(c).recommendation,'HOLD')});
test('legal blocker stops',()=>assert.equal(evaluateVertical({legal_blocker:true}).recommendation,'NO_GO'));
test('privacy blocker stops',()=>assert.equal(evaluateVertical({privacy_blocker:true}).recommendation,'NO_GO'));
for(const value of [-1,6,2.5,'4'])test('invalid score rejected '+value,()=>{const c=fixture();c.scores.demand=value;assert.throws(()=>evaluateVertical(c))});
