import assert from 'node:assert/strict';
import { writeFileSync } from 'node:fs';
const base = process.env.BASE_URL || 'http://localhost:3000';
const paths = ['/','/about','/systems','/products','/ventures','/commerce','/contact','/docs','/privacy','/systems/barber'];
const results=[]; const internal=new Set();
for (const path of paths) {
  const response=await fetch(base+path); const html=await response.text();
  assert.equal(response.status,200,path);
  assert.match(response.headers.get('content-type')||'',/text\/html/);
  assert(response.headers.get('content-security-policy'),`CSP ${path}`);
  assert.equal(response.headers.get('x-content-type-options'),'nosniff');
  assert.match(html,/<html lang="en">/); assert.match(html,/<h1>/); assert.match(html,/rel="canonical"/);
  assert(!/Bozq|Bosku Cukur|Tolvey|Kestora|CLOUDFLARE_API_TOKEN/.test(html),`private data in public page ${path}`);
  for(const [,link] of html.matchAll(/(?:href|src)="(\/[^"#]*)/g)) internal.add(link);
  results.push({path,status:response.status,securityHeaders:true});
}
for (const path of ['/legal','/terms/commerce','/refund/commerce','/support/commerce','/delivery/commerce','/license/commerce']) {
  const response=await fetch(base+path),html=await response.text();
  assert.equal(response.status,200,path);assert.match(html,/<html lang="id">/);
  assert.match(html,/PT Waskita Cakrawarti Digital/);assert.match(html,/6285643383832/);
  assert.match(html,/routing belum/i);assert(response.headers.get('content-security-policy'));
  for(const [,link] of html.matchAll(/(?:href|src)="(\/[^"#]*)/g)) internal.add(link);
  results.push({path,status:response.status,securityHeaders:true});
}
for(const path of internal) assert.equal((await fetch(base+path)).status,200,`Broken internal route/asset ${path}`);
assert.equal((await fetch(base+'/does-not-exist')).status,404);
assert.deepEqual(await (await fetch(base+'/api/health')).json(),{status:'ok',brand:'HOLBERY',version:'1.1.0'});
assert.match(await (await fetch(base+'/robots.txt')).text(),/Sitemap:/);
assert.match(await (await fetch(base+'/sitemap.xml')).text(),/<urlset/);
const evidence={date:new Date().toISOString().slice(0,10),base,routes:results,internalLinksChecked:internal.size,notFound:404,health:'ok'};
const filename=base.includes('localhost')?'http-local.json':'http-production.json';
writeFileSync('evidence/'+filename,JSON.stringify(evidence,null,2)+'\n');
console.log(`PASS HTTP: ${results.length} pages, ${internal.size} internal targets, metadata, boundaries, security headers, health, sitemap, robots, 404 (${base})`);
