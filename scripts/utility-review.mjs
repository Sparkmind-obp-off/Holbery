import{execFileSync}from'node:child_process';import{writeFileSync,mkdirSync}from'node:fs';
const days=Number(process.argv[2]||7);if(!Number.isInteger(days)||days<1||days>30)throw new Error('days must be 1–30');
const start=new Date(Date.now()-(days-1)*86400000).toISOString().slice(0,10);
const sql=`SELECT tool_id,event_name,COUNT(DISTINCT session_hash) sessions FROM holbery_field_events WHERE traffic_class='production' AND event_day>='${start}' GROUP BY tool_id,event_name ORDER BY tool_id,event_name`;
// Read-only exact utility table; never query names/email/orders or expose credentials.
const output=execFileSync('npx',['wrangler','d1','execute','holbery-commerce-production','--remote','--json','--command',sql],{encoding:'utf8',stdio:['ignore','pipe','pipe']});
const rows=JSON.parse(output).flatMap(x=>x.results||[]);
const tools=['daily_close','target_revenue','break_even'];
const summary=tools.map(tool=>{
 const count=name=>rows.find(x=>x.tool_id===tool&&x.event_name===name)?.sessions||0;
 const rate=(a,b)=>count(b)>0?count(a)/count(b):null;
 return{tool_id:tool,opened_sessions:count('tool_opened'),started_sessions:count('tool_started'),completed_sessions:count('tool_completed'),result_sessions:count('result_viewed'),same_tab_repeat_sessions:count('repeat_use_observed'),product_cta_clicked_sessions:count('product_cta_clicked'),activation_rate:rate('tool_completed','tool_opened'),result_rate:rate('result_viewed','tool_started'),product_intent_rate:rate('product_cta_clicked','tool_completed')};
});
const report={date:new Date().toISOString().slice(0,10),window_start:start,days,summary,limits:'Opt-in only; short-lived sessions not unique humans; test traffic excluded; no cross-day visitor retention, payment/revenue attribution, market proof or outcome inferred.',decision:'Use UTILITY-REVIEW-TEMPLATE.md; do not add tools or paid offers solely from event counts.'};
mkdirSync('private',{recursive:true});const path='private/utility-review-'+report.date+'.json';writeFileSync(path,JSON.stringify(report,null,2)+'\n');console.log('Read-only review saved to ignored '+path+'; no private commerce data queried.');
