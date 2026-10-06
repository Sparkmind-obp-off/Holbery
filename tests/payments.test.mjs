import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHmac, randomBytes } from 'node:crypto';
import ts from 'typescript';
const source = await readFile('src/payments.ts','utf8');
const compiled = ts.transpileModule(source,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext}}).outputText;
const {hmac,digest,equal,DuitkuAdapter,ProviderError} = await import('data:text/javascript;base64,'+Buffer.from(compiled).toString('base64'));
const secret = randomBytes(32).toString('hex');
const merchant = 'LOCAL_ONLY';
const adapter = new DuitkuAdapter({environment:'sandbox',merchantCode:merchant,apiKey:secret,origin:'https://unit.test'});
const input = {merchantOrderId:'LOCAL-order',amount:10000,orderId:'LOCAL',name:'Synthetic',email:'synthetic@example.invalid',items:[{name:'LOCAL item',price:5000,quantity:2}]};
test('HMAC-SHA256 matches independent Node crypto',async()=>assert.equal(await hmac(secret,'merchant123'),createHmac('sha256',secret).update('merchant123').digest('hex')));
test('SHA256 digest is deterministic and 64 hex characters',async()=>{assert.match(await digest('local'),/^[a-f0-9]{64}$/);assert.equal(await digest('local'),await digest('local'));});
test('constant-time equality rejects same-length and different-length differences',()=>{assert.equal(equal('abcd','abcd'),true);assert.equal(equal('abcd','abce'),false);assert.equal(equal('abcd','abc'),false);});
test('adapter validates current official callback HMAC',async()=>{
  const fields={merchantCode:merchant,amount:'10000',merchantOrderId:'LOCAL',signature:createHmac('sha256',secret).update(merchant+'10000LOCAL').digest('hex')};assert.equal(await adapter.verifyCallback(fields),true);
  for(const changes of [{merchantCode:'WRONG'},{amount:'1'},{merchantOrderId:'OTHER'},{signature:'0'.repeat(64)},{signature:'INVALID'}]) assert.equal(await adapter.verifyCallback({...fields,...changes}),false);
});
test('adapter rejects snapshot amount mismatch without making any network request',async()=>{await assert.rejects(adapter.createInvoice({...input,amount:1}),/AMOUNT_MISMATCH/);});
for(const scenario of ['http-error','redirect','invalid-json','merchant-mismatch','missing-reference','foreign-payment-host','wrong-environment-host']) test('invoice rejects '+scenario,async()=>{
  const original=globalThis.fetch;
  globalThis.fetch=async(url,options)=>{
    assert.equal(url,'https://api-sandbox.duitku.com/api/merchant/createInvoice');assert.equal(options.redirect,'manual');
    if(scenario==='http-error') return new Response('{}',{status:503});
    if(scenario==='redirect') return new Response('',{status:302,headers:{Location:'https://example.invalid'}});
    if(scenario==='invalid-json') return new Response('not-json');
    const response={merchantCode:merchant,reference:'LOCAL_REF',statusCode:'00',paymentUrl:'https://app-sandbox.duitku.com/pay'};
    if(scenario==='merchant-mismatch') response.merchantCode='OTHER';
    if(scenario==='missing-reference') delete response.reference;
    if(scenario==='foreign-payment-host') response.paymentUrl='https://example.invalid/pay';
    if(scenario==='wrong-environment-host') response.paymentUrl='https://app-prod.duitku.com/pay';
    return Response.json(response);
  };
  try { await assert.rejects(adapter.createInvoice(input),ProviderError); } finally { globalThis.fetch=original; }
});
test('explicit production environment selects only production invoice host',async()=>{
  const original=globalThis.fetch;
  globalThis.fetch=async(url,options)=>{assert.equal(url,'https://api-prod.duitku.com/api/merchant/createInvoice');assert.equal(options.headers['x-duitku-signature'],createHmac('sha256',secret).update(merchant+options.headers['x-duitku-timestamp']).digest('hex'));return Response.json({merchantCode:merchant,statusCode:'00',reference:'LOCAL',paymentUrl:'https://app-prod.duitku.com/pay'});};
  try { const prod=new DuitkuAdapter({environment:'production',merchantCode:merchant,apiKey:secret,origin:'https://unit.test'});assert.equal((await prod.createInvoice(input)).reference,'LOCAL'); } finally {globalThis.fetch=original;}
});
for(const [code,status] of [['00','PAID'],['01','PENDING'],['02','FAILED']]) test('status inquiry maps '+code+' to '+status,async()=>{
  const original=globalThis.fetch;
  globalThis.fetch=async(url,options)=>{assert.equal(url,'https://sandbox.duitku.com/webapi/api/merchant/transactionStatus');const body=JSON.parse(options.body);assert.equal(body.signature,createHmac('sha256',secret).update(merchant+'LOCAL').digest('hex'));return Response.json({merchantOrderId:'LOCAL',reference:'LOCAL_REF',amount:'10000',statusCode:code});};
  try {assert.equal((await adapter.inquiry('LOCAL')).status,status);} finally {globalThis.fetch=original;}
});
test('unknown provider status cannot become success',async()=>{
  const original=globalThis.fetch;globalThis.fetch=async()=>Response.json({merchantOrderId:'LOCAL',reference:'LOCAL',amount:'10000',statusCode:'99'});
  try{await assert.rejects(adapter.inquiry('LOCAL'),ProviderError);}finally{globalThis.fetch=original;}
});
