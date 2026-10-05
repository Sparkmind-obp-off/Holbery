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
 for(const path of ['/about','/systems','/products','/ventures','/commerce','/contact','/docs','/privacy','/systems/barber']) {
  await page.goto(base+path); assert.equal(await page.locator('main h1').count(),1); assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 }
 await page.goto(base+'/systems/barber');
 if(await page.locator('#daily-close-form').count()) {
  await page.locator('#services').fill('10'); await page.locator('#price').fill('30000');
  await page.locator('#cash-receipts').fill('200000'); await page.locator('#digital-receipts').fill('100000');
  await page.locator('#opening-cash').fill('100000'); await page.locator('#cash-expenses').fill('50000'); await page.locator('#actual-cash').fill('250000');
  await page.getByRole('button',{name:'Calculate daily close'}).click();
  assert.match(await page.locator('#calculation-result').innerText(),/300\.000/);
  assert.match(await page.locator('#calculation-result').innerText(),/Balanced/);
  await page.locator('#services').fill(''); await page.getByRole('button',{name:'Calculate daily close'}).click();
  assert.match(await page.locator('#calculator-error').innerText(),/required/i);
  checks.push({calculator:'valid outcome, cash reconciliation, empty input rejected'});
 }
 assert.equal(errors.length,0,JSON.stringify(errors));
 writeFileSync('evidence/browser.json',JSON.stringify({date:'2026-10-05',base,checks,javascriptErrors:errors},null,2)+'\n');
 console.log('PASS browser: responsive widths, mobile navigation, page headings, no JavaScript errors'+(checks.some(x=>x.calculator)?', calculator workflow':''));
} finally { await browser.close(); }
