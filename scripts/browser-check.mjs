import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
import { writeFileSync } from 'node:fs';
const base=process.env.BASE_URL||'http://localhost:3000';
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const errors=[]; const checks=[];
try {
 for(const width of [1440,768,390,320]) {
  const page=await browser.newPage({viewport:{width,height:1000}});
  page.on('pageerror', e=>errors.push(e.message));
  await page.goto(base,{waitUntil:'networkidle'});
  assert.equal(await page.locator('h1').count(),1);
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`overflow at ${width}`);
  if(width===1440) await page.screenshot({path:'evidence/home-desktop.png',fullPage:true});
  if(width===390) {
   await page.screenshot({path:'evidence/home-mobile.png',fullPage:true});
   const menu=page.getByRole('button',{name:/Menu/}); await menu.click();
   assert.equal(await menu.getAttribute('aria-expanded'),'true');
   await page.keyboard.press('Escape'); assert.equal(await menu.getAttribute('aria-expanded'),'false');
  }
  checks.push({viewport:width,horizontalOverflow:false,mainHeading:true});
  await page.close();
 }
 const page=await browser.newPage();
 page.on('pageerror',e=>errors.push(e.message));
 for(const path of ['/about','/systems','/products','/ventures','/commerce','/contact','/docs','/privacy','/systems/barber','/legal','/terms/commerce','/refund/commerce','/support/commerce','/delivery/commerce','/license/commerce']) {
  await page.goto(base+path); assert.equal(await page.locator('main h1').count(),1); assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 }
 await page.goto(base+'/systems/barber');
 if(await page.locator('#daily-close-form').count()) {
  await page.locator('#services').fill('10'); await page.locator('#price').fill('30000');
  await page.locator('#cash-receipts').fill('200000'); await page.locator('#digital-receipts').fill('100000');
  await page.locator('#opening-cash').fill('100000'); await page.locator('#cash-expenses').fill('50000'); await page.locator('#actual-cash').fill('250000');
  await page.getByRole('button',{name:'Hitung penutupan harian'}).click();
  assert.match(await page.locator('#calculation-result').innerText(),/300\.000/);
  assert.match(await page.locator('#calculation-result').innerText(),/Cocok/);
  await page.locator('#services').fill(''); await page.getByRole('button',{name:'Hitung penutupan harian'}).click();
  assert.match(await page.locator('#calculator-error').innerText(),/wajib/i);
  checks.push({calculator:'valid outcome, cash reconciliation, empty input rejected'});
 }
 if (process.env.VERIFY_LIVE_COMMERCE === 'true') {
  assert.equal(new URL(base).hostname,'webapp-4.pages.dev','Live commerce checks use existing production only');
  const ready=await (await fetch(base+'/api/commerce/readiness')).json();assert.equal(ready.status,'READY');
  await page.setViewportSize({width:390,height:1000});
  await page.goto(base+'/store/direct/products/barber-revenue-starter-system');
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  assert.equal(await page.locator('#purchase-form button').isEnabled(),true);
  await page.locator('#purchase-form button').click();
  await page.waitForSelector('#customer-checkout');
  await page.waitForFunction(()=>document.querySelector('#cart-summary')?.textContent.includes('99000'));
  assert.match(await page.locator('#cart-summary').innerText(),/Total cart: Rp 99000/);
  assert.equal(await page.locator('#customer-checkout input[name="name"]').inputValue(),'');
  assert.equal(await page.locator('#customer-checkout input[name="email"]').inputValue(),'');
  assert.equal(await page.locator('#customer-checkout input[name="consent"]').isChecked(),false);
  // Never fill customer data, submit checkout, create invoice, or process an invented Pop reference.
  const session=await page.evaluate(()=>JSON.parse(sessionStorage.getItem('holbery-private-checkout')));
  assert(!session.orderId);
  const removed=await page.request.delete(base+'/api/commerce/stores/direct/carts/'+session.cartId+'/items/87241d54b36b4cbe880e0184ab493b10',{headers:{Authorization:'Bearer '+session.token}});
  assert.equal(removed.status(),200);
  await page.evaluate(()=>sessionStorage.removeItem('holbery-private-checkout'));
  await page.goto(base+'/checkout/unavailable');
  await page.waitForFunction(()=>typeof window.checkout?.process==='function',{timeout:20000});
  assert.match(await page.locator('main').innerText(),/akses privat/);
  checks.push({productionCommerce:'READY; enabled product; authoritative Rp99000 cart and empty customer form; item removed; no order/invoice/customer created',duitkuPop:'Real production module loaded; process function available; no payment reference passed',ownerSpendIdr:0});
 }
 assert.equal(errors.length,0,JSON.stringify(errors));
 writeFileSync('evidence/browser.json',JSON.stringify({date:new Date().toISOString().slice(0,10),base,checks,javascriptErrors:errors},null,2)+'\n');
 console.log('PASS browser: responsive widths, mobile navigation, page headings, no JavaScript errors'+(checks.some(x=>x.calculator)?', calculator workflow':''));
} finally { await browser.close(); }
