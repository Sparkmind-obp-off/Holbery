import{chromium}from'@playwright/test';import assert from'node:assert/strict';import{writeFileSync}from'node:fs';import{validateFieldEvent}from'../public/static/event-contract.js';
const base=process.env.BASE_URL||'http://localhost:3000';const browser=await chromium.launch({headless:true,args:['--no-sandbox']});const events=[];const responses=[];const errors=[];
try{
 const page=await browser.newPage({viewport:{width:390,height:1000}});
 page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(r.url().endsWith('/api/field-events')&&r.method()==='POST')events.push(r.postDataJSON())});page.on('response',r=>{if(r.url().endsWith('/api/field-events'))responses.push(r.status())});
 await page.goto(base+'/tools/barber/daily-close?measurement_test=1');
 for(const[id,value]of Object.entries({services:'10',price:'30000','opening-cash':'100000','cash-receipts':'200000','digital-receipts':'100000','cash-expenses':'50000','actual-cash':'250000'}))await page.locator('#'+id).fill(value);
 await page.getByRole('button',{name:'Hitung penutupan harian'}).click();assert.match(await page.locator('#calculation-result').innerText(),/Cocok/);assert.equal(events.length,0,'Default must not track');
 await page.locator('[data-measurement="enable"]').click();await page.getByRole('button',{name:'Hitung penutupan harian'}).click();
 await page.waitForTimeout(300);assert(events.some(e=>e.event_name==='tool_completed'));assert(events.some(e=>e.event_name==='result_viewed'));
 await page.locator('[data-next-tool="target_revenue"]').click();
 await page.locator('#target').fill('10000000');await page.locator('#price').fill('25000');await page.locator('#days').fill('25');await page.getByRole('button',{name:'Hitung target omzet'}).click();assert.match(await page.locator('#calculation-result').innerText(),/400/);assert.match(await page.locator('#calculation-result').innerText(),/16/);
 await page.locator('[data-next-tool="break_even"]').click();
 for(const[id,value]of Object.entries({fixed:'3000000',price:'30000',variable:'10000',days:'25'}))await page.locator('#'+id).fill(value);
 await page.getByRole('button',{name:'Hitung break-even'}).click();assert.match(await page.locator('#calculation-result').innerText(),/150/);
 await page.locator('#variable').fill('30000');await page.getByRole('button',{name:'Hitung break-even'}).click();assert.match(await page.locator('#calculation-result').innerText(),/harus melebihi/);
 await page.locator('[data-next-tool="daily_close"]').click();await page.waitForTimeout(250);assert(events.some(e=>e.event_name==='repeat_use_observed'));
 for(const event of events){validateFieldEvent(event);assert.equal(event.traffic_class,'test');for(const key of ['input_values','result_value','email','ip','customer_id','token'])assert(!(key in event))}
 await page.waitForTimeout(500);assert(responses.length>0);assert(responses.every(s=>s===202),JSON.stringify(responses));
 await page.locator('[data-measurement="disable"]').click();const before=events.length;await page.locator('#services').fill('11');await page.waitForTimeout(100);assert.equal(events.length,before);assert.equal(await page.evaluate(()=>sessionStorage.getItem('holbery.utility.session.v1')),null);
 assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 await page.screenshot({path:'evidence/utility-mobile.png',fullPage:true});
 const protectedPage=await browser.newPage();await protectedPage.addInitScript(()=>Object.defineProperty(navigator,'globalPrivacyControl',{value:true}));let gpcRequests=0;protectedPage.on('request',r=>{if(r.url().endsWith('/api/field-events'))gpcRequests++});await protectedPage.goto(base+'/tools');await protectedPage.locator('[data-measurement="enable"]').click();assert.equal(gpcRequests,0);assert.match(await protectedPage.locator('[data-measurement-status]').innerText(),/DNT\/GPC/);
 assert.equal(errors.length,0);const evidence={date:new Date().toISOString().slice(0,10),base,threeCalculators:'PASS',defaultOff:true,consentedEnvelopeOnly:true,testTrafficIsolated:true,eventNames:[...new Set(events.map(e=>e.event_name))],acceptedEvents:responses.length,disableAndGpc:'PASS',javascriptErrors:errors,scope:'SYNTHETIC engineering traffic, not market usage'};writeFileSync('evidence/utility-browser.json',JSON.stringify(evidence,null,2)+'\n');console.log('PASS utility browser: three tools, required/math errors, defaults off, opt-in ledger, no values/PII, movement, repeat, disable/GPC');
}finally{await browser.close()}
