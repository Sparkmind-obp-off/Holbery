import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHmac, randomBytes } from 'node:crypto';
import { Miniflare, convertV4MiniflareOptions } from 'miniflare';

async function migrate(db) {
  let sql = '';
  for (const line of (await Promise.all(['0001_commerce_runtime.sql','0002_integrity_guards.sql','0003_digital_delivery_support.sql'].map(file=>readFile('migrations/'+file,'utf8')))).join('\n').split('\n')) {
    if (!line.trim() || line.trim().startsWith('--')) continue;
    sql += line + '\n';
    const trigger = /^CREATE TRIGGER/.test(sql.trim());
    if ((trigger && (line.trim() === 'END;' || /^CREATE TRIGGER.+BEGIN.+END;$/.test(line.trim()))) || (!trigger && /;\s*$/.test(sql))) { await db.prepare(sql).run(); sql=''; }
  }
  assert.equal(sql,'');
}
// All fixtures and keys are generated in an ephemeral LOCAL workerd/D1 runtime.
// All outbound requests are intercepted: these tests cannot create real invoices or sales.
test('Commerce runtime / actual Worker and D1, mocked provider, no production data', async t => {
  const adminToken = randomBytes(32).toString('hex'), apiKey = randomBytes(32).toString('hex');
  const merchant = 'LOCAL_ONLY', release = 'a'.repeat(40);
  const invoices = new Map();
  let providerFail = false, inquireFail = false, invoiceCalls = 0;
  const sign = value => createHmac('sha256', apiKey).update(value).digest('hex');
  const mf = new Miniflare(convertV4MiniflareOptions({
    modules: true, scriptPath: 'dist/_worker.js', compatibilityDate: '2026-10-01',
    d1Databases: ['DB'], r2Buckets:['PRODUCT_BUCKET'], bindings: {
      ENVIRONMENT: 'development', PUBLIC_ORIGIN: 'https://commerce.test', DUITKU_ENV: 'sandbox',
      DUITKU_MERCHANT_CODE: merchant, DUITKU_API_KEY: apiKey, COMMERCE_ADMIN_TOKEN: adminToken,
      SUPPORT_CHANNEL:'/support/commerce', TERMS_VERSION:'BRS-TERMS-2026-1',REFUND_POLICY_VERSION:'BRS-REFUND-2026-1',PRIVACY_POLICY_VERSION:'BRS-PRIVACY-2026-1',FULFILLMENT_MODE:'secure-download', ADMIN_STOREFRONT_ID: 'holbery-direct', RELEASE_COMMIT: release, COMMERCE_ENABLED: 'true', COMMERCIAL_POLICY_APPROVED: 'true'
    },
    outboundService: async request => {
      const url = new URL(request.url), body = await request.json();
      if (url.href === 'https://api-sandbox.duitku.com/api/merchant/createInvoice') {
        invoiceCalls++;
        assert.equal(request.headers.get('x-duitku-merchantcode'), merchant);
        assert.equal(request.headers.get('x-duitku-signature'), sign(merchant + request.headers.get('x-duitku-timestamp')));
        assert.equal(body.paymentAmount, body.itemDetails.reduce((s,i)=>s+i.price*i.quantity,0));
        assert.equal(body.callbackUrl, 'https://commerce.test/api/commerce/payments/duitku/callback');
        if (providerFail) return new Response('{}', {status:502});
        const reference = 'LOCAL_' + randomBytes(12).toString('hex');
        invoices.set(body.merchantOrderId, { merchantOrderId: body.merchantOrderId, reference, amount: String(body.paymentAmount), statusCode: '01' });
        return Response.json({ merchantCode:merchant, reference, statusCode:'00', paymentUrl:'https://app-sandbox.duitku.com/redirect_checkout?reference='+reference });
      }
      assert.equal(url.href, 'https://sandbox.duitku.com/webapi/api/merchant/transactionStatus', 'No unmocked network permitted');
      assert.equal(body.signature, sign(merchant + body.merchantOrderId));
      if (inquireFail) return new Response('{}', {status:503});
      return Response.json(invoices.get(body.merchantOrderId) || {});
    }
  }));
  try {
    const db = await mf.getD1Database('DB');
    await migrate(db);
    const prefix = '/api/commerce/stores/direct';
    async function req(path, { method='GET', body, token, key, status=200, form } = {}) {
      const headers={};
      if(token) headers.Authorization='Bearer '+token;
      if(key) headers['Idempotency-Key']=key;
      if(body!==undefined) headers['Content-Type']='application/json';
      if(form) headers['Content-Type']='application/x-www-form-urlencoded';
      const response=await mf.dispatchFetch('https://commerce.test'+path,{method,headers,body:form?new URLSearchParams(form).toString():body===undefined?undefined:JSON.stringify(body)});
      const raw=await response.text();
      assert.equal(response.status,status,path+' '+raw);
      assert(response.headers.get('x-request-id'));
      assert.equal(response.headers.get('cache-control'),'no-store');
      assert.equal(response.headers.get('referrer-policy'),'no-referrer');
      return response.headers.get('content-type')?.includes('application/json')?JSON.parse(raw):raw;
    }
    const productBody = {name:'SYNTHETIC local test item',slug:'local-only',description:'Not a commercial offer',type:'digital',sku:'LOCAL-ONLY',variantName:'Standard',stock:20,priceIdr:12500};
    let product, cart, order, reference;
    const makeCart = () => req(prefix+'/carts',{method:'POST',status:201});
    const item = (c, quantity=1, offerId=product.offerId, extra={}) => req(prefix+'/carts/'+c.cartId+'/items',{method:'PUT',token:c.accessToken,body:{offerId,quantity,...extra}});
    const checkout = (c,key=randomBytes(16).toString('hex'),extra={},status=201) => req(prefix+'/checkouts',{method:'POST',token:c.accessToken,key,body:{cartId:c.cartId,name:'Synthetic Customer',email:'synthetic@example.invalid',consent:true,...extra},status});
    const orderRoute = o => prefix+'/orders/'+o.orderId;
    const pay = (o,c,status=201) => req(orderRoute(o)+'/payments',{method:'POST',token:c.accessToken,status});
    const callback = (o,ref,amount=12500,resultCode='00',changes={}) => ({merchantCode:merchant,merchantOrderId:'HB-'+o.orderId,amount:String(amount),reference:ref,resultCode,signature:sign(merchant+String(amount)+'HB-'+o.orderId),...changes});
    const cb = (fields,status=200) => req('/api/commerce/payments/duitku/callback',{method:'POST',form:fields,status});
    const query = (sql,...args) => db.prepare(sql).bind(...args).first();
    await t.test('foundation readiness verifies migrated D1 but no approved catalog',async()=>{
      const result=await req('/api/commerce/readiness',{status:503});assert.equal(result.foundation,'VERIFIED');assert.deepEqual(result.missing,['APPROVED_PUBLISHED_PRODUCT']);
    });
    await t.test('approved legal pages identify operator and disclose inactive email routing',async()=>{
      for (const path of ['/legal','/terms/commerce','/refund/commerce','/privacy','/support/commerce','/delivery/commerce','/license/commerce','/contact']) {
        const response=await mf.dispatchFetch('https://commerce.test'+path);
        assert.equal(response.status,200);assert.equal(response.headers.get('referrer-policy'),'no-referrer');
        const html=await response.text();
        assert.match(html,/PT Waskita Cakrawarti Digital/);
        assert.match(html,/6285643383832/);
        assert.match(html,/routing belum/i);
        assert.doesNotMatch(html,/usulan untuk persetujuan|pemilik perlu menyetujui/i);
      }
    });
    await t.test('catalog write without admin capability rejected',()=>req(prefix+'/admin/products',{method:'POST',body:productBody,status:401}));
    await t.test('create product, variant and offer in one transaction, initially draft',async()=>{
      product=await req(prefix+'/admin/products',{method:'POST',token:adminToken,body:productBody,status:201});assert.equal(product.status,'draft');
    });
    await t.test('unpublished product absent from public catalog',async()=>{
      assert.deepEqual((await req(prefix+'/products')).products,[]);await req(prefix+'/products/local-only',{status:404});
    });
    await t.test('draft product cannot enter cart',async()=>{
      cart=await makeCart();await req(prefix+'/carts/'+cart.cartId+'/items',{method:'PUT',token:cart.accessToken,body:{offerId:product.offerId,quantity:1},status:409});
    });
    await t.test('publish product and canonical DB page resolves',async()=>{
      await req(prefix+'/admin/products/'+product.productId,{method:'PATCH',token:adminToken,body:{status:'published'}});
      const html=await req(product.url);assert.match(html,/SYNTHETIC local test item/);assert.match(html,/12500/);
      assert.equal((await req(prefix+'/products/local-only')).variants[0].price_idr,12500);
      assert.equal((await req('/api/commerce/readiness')).status,'READY');
    });
    await t.test('readiness fails closed for inactive production storefront',async()=>{
      await db.prepare("UPDATE storefronts SET status='inactive' WHERE id='holbery-direct'").run();
      const result=await req('/api/commerce/readiness',{status:503});assert(result.missing.includes('DB_MIGRATIONS'));
      await db.prepare("UPDATE storefronts SET status='active' WHERE id='holbery-direct'").run();
      assert.equal((await req('/api/commerce/readiness')).status,'READY');
    });
    await t.test('catalog validation rejects invalid price and slug',async()=>{
      await req(prefix+'/admin/products',{method:'POST',token:adminToken,body:{...productBody,priceIdr:0},status:400});
      await req(prefix+'/admin/products',{method:'POST',token:adminToken,body:{...productBody,slug:'../escape'},status:400});
    });
    await t.test('second organization/storefront fixtures cannot violate composite tenant FK',async()=>{
      await db.batch([
        db.prepare("INSERT INTO organizations VALUES ('other','LOCAL tenant B','active')"),db.prepare("INSERT INTO brands VALUES ('other','other','LOCAL B')"),
        db.prepare("INSERT INTO storefronts VALUES ('other','other','other','other','LOCAL B','active')")
      ]);
      await assert.rejects(db.prepare("INSERT INTO storefronts VALUES ('bad','other','holbery','bad','BAD','active')").run(),/FOREIGN KEY/);
      await assert.rejects(db.prepare("INSERT INTO offers VALUES ('bad','other','other','other',?,?,100,'active')").bind(product.productId,product.variantId).run(),/FOREIGN KEY/);
    });
    await t.test('organization B cannot discover organization A product',async()=>{
      assert.deepEqual((await req('/api/commerce/stores/other/products')).products,[]);
      await req('/api/commerce/stores/other/products/local-only',{status:404});
    });
    await t.test('storefront-scoped operator cannot write other storefront',async()=>{
      await req('/api/commerce/stores/other/admin/products',{method:'POST',token:adminToken,body:productBody,status:401});
      await req('/api/commerce/stores/other/admin/products/'+product.productId,{method:'PATCH',token:adminToken,body:{status:'draft'},status:401});
    });
    await t.test('valid cart item uses server price',async()=>{const result=await item(cart);assert.equal(result.unitPriceIdr,12500);});
    await t.test('cart capability stored only as hash and not revealed by GET',async()=>{
      const stored=await query('SELECT access_hash FROM carts WHERE id=?',cart.cartId);assert.notEqual(stored.access_hash,cart.accessToken);
      const returned=await req(prefix+'/carts/'+cart.cartId,{token:cart.accessToken});assert(!JSON.stringify(returned).includes(cart.accessToken));
    });
    await t.test('wrong storefront and wrong bearer cannot access cart',async()=>{
      await req('/api/commerce/stores/other/carts/'+cart.cartId,{token:cart.accessToken,status:404});
      await req(prefix+'/carts/'+cart.cartId,{token:adminToken,status:404});
      await req(prefix+'/carts/'+cart.cartId,{status:404});
    });
    for(const quantity of [0,-1,1.5,100,'1',true]) await t.test('invalid cart quantity '+quantity,()=>req(prefix+'/carts/'+cart.cartId+'/items',{method:'PUT',token:cart.accessToken,body:{offerId:product.offerId,quantity},status:400}));
    await t.test('invalid variant/offer rejected',()=>req(prefix+'/carts/'+cart.cartId+'/items',{method:'PUT',token:cart.accessToken,body:{offerId:'unknown',quantity:1},status:409}));
    await t.test('client-submitted cart price rejected',()=>req(prefix+'/carts/'+cart.cartId+'/items',{method:'PUT',token:cart.accessToken,body:{offerId:product.offerId,quantity:1,priceIdr:1},status:400}));
    await t.test('checkout rejects client total manipulation',()=>checkout(cart,randomBytes(16).toString('hex'),{totalIdr:1},400));
    await t.test('checkout rejects invalid customer and missing consent',async()=>{
      await checkout(cart,randomBytes(16).toString('hex'),{email:'invalid'},400);await checkout(cart,randomBytes(16).toString('hex'),{consent:false},400);
    });
    const idem=randomBytes(16).toString('hex');
    await t.test('checkout creates immutable order and payment, snapshots and reserves stock',async()=>{
      order=await checkout(cart,idem);assert.equal(order.totalIdr,12500);
      const p=await query('SELECT * FROM payments WHERE order_id=?',order.orderId);assert.equal(p.amount_idr,12500);assert.equal(p.merchant_order_id,'HB-'+order.orderId);assert.equal(p.status,'CREATED');
      assert.equal((await query('SELECT stock FROM product_variants WHERE id=?',product.variantId)).stock,19);
      assert.equal((await query('SELECT COUNT(*) AS n FROM commerce_events WHERE order_id=?',order.orderId)).n,1);
    });
    await t.test('duplicate checkout returns same order and does not reserve twice',async()=>{
      const duplicate=await checkout(cart,idem,{},200);assert.equal(duplicate.orderId,order.orderId);assert.equal(duplicate.replayed,true);
      assert.equal((await query('SELECT stock FROM product_variants WHERE id=?',product.variantId)).stock,19);
    });
    await t.test('same key for different cart rejected',async()=>{await checkout(await makeCart(),idem,{},409);});
    await t.test('closed cart cannot mutate or create a second order',async()=>{
      await checkout(cart,randomBytes(16).toString('hex'),{},409);
      await req(prefix+'/carts/'+cart.cartId+'/items',{method:'PUT',token:cart.accessToken,body:{offerId:product.offerId,quantity:2},status:409});
    });
    await t.test('order capability cannot cross storefront or order',async()=>{
      await req('/api/commerce/stores/other/orders/'+order.orderId,{token:cart.accessToken,status:404});
      await req(orderRoute(order),{token:adminToken,status:404});
    });
    await t.test('snapshot is immutable even when catalog later changes',async()=>{
      await assert.rejects(db.prepare('UPDATE orders SET total_idr=1 WHERE id=?').bind(order.orderId).run(),/IMMUTABLE_ORDER/);
      await assert.rejects(db.prepare('UPDATE order_items SET unit_price_idr=1 WHERE order_id=?').bind(order.orderId).run(),/IMMUTABLE_ITEM/);
      await db.prepare('UPDATE offers SET price_idr=13000 WHERE id=?').bind(product.offerId).run();
      assert.equal((await req(orderRoute(order),{token:cart.accessToken})).items[0].unit_price_idr,12500);
      await db.prepare('UPDATE offers SET price_idr=12500 WHERE id=?').bind(product.offerId).run();
    });
    await t.test('order state machine rejects arbitrary skip and unverified PAID',async()=>{
      await assert.rejects(db.prepare("UPDATE orders SET status='COMPLETED' WHERE id=?").bind(order.orderId).run(),/INVALID_TRANSITION/);
      await assert.rejects(db.prepare("UPDATE orders SET status='PAID' WHERE id=?").bind(order.orderId).run(),/PAYMENT_NOT_VERIFIED/);
    });
    await t.test('Duitku creates invoice with current official HMAC and immutable item total',async()=>{
      const invoice=await pay(order,cart);reference=invoice.reference;assert.match(reference,/^LOCAL_/);
      assert.equal((await query('SELECT status FROM payments WHERE order_id=?',order.orderId)).status,'PENDING');
    });
    await t.test('duplicate payment request returns same reference, no new provider call',async()=>{
      const count=invoiceCalls;assert.equal((await pay(order,cart,200)).reference,reference);assert.equal(invoiceCalls,count);
    });
    await t.test('browser return success has no state authority and checkout CSP allows only selected Pop host',async()=>{
      const response=await mf.dispatchFetch('https://commerce.test/checkout/'+order.orderId);
      assert.match(response.headers.get('content-security-policy'),/script-src 'self' https:\/\/app-sandbox.duitku.com/);
      await req('/orders/'+order.orderId+'?resultCode=00&reference='+reference);
      assert.equal((await req(orderRoute(order),{token:cart.accessToken})).status,'PENDING_PAYMENT');
    });
    await t.test('forged callback rejected before provider inquiry',()=>cb(callback(order,reference,12500,'00',{signature:'0'.repeat(64)}),401));
    await t.test('wrong merchant identity rejected',()=>cb(callback(order,reference,12500,'00',{merchantCode:'OTHER'}),401));
    await t.test('wrong amount rejected even with valid signature',()=>cb(callback(order,reference,1),409));
    await t.test('wrong reference rejected even with valid signature',()=>cb(callback(order,'WRONG'),409));
    await t.test('unknown payment and merchant order rejected',()=>cb(callback({orderId:'missing'},reference),404));
    await t.test('unsigned resultCode alteration cannot cause PAID: inquiry corroboration',()=>cb(callback(order,reference),409));
    await t.test('provider inquiry failure cannot mutate payment/order',async()=>{
      inquireFail=true;await cb(callback(order,reference),503);inquireFail=false;
      assert.equal((await req(orderRoute(order),{token:cart.accessToken})).status,'PENDING_PAYMENT');
    });
    await t.test('valid callback commits verified payment event and PAID order atomically',async()=>{
      invoices.get('HB-'+order.orderId).statusCode='00';await cb(callback(order,reference));
      const current=await req(orderRoute(order),{token:cart.accessToken});assert.equal(current.status,'PAID');assert.equal(current.payment.status,'PAID');
      assert.equal((await query('SELECT COUNT(*) AS n FROM payment_events WHERE payment_id=?',order.orderId)).n,1);
    });
    await t.test('duplicate and concurrent callback harmless, no duplicate events',async()=>{
      await Promise.all([cb(callback(order,reference)),cb(callback(order,reference))]);
      assert.equal((await query('SELECT COUNT(*) AS n FROM payment_events WHERE payment_id=?',order.orderId)).n,1);
    });
    await t.test('late failed callback cannot downgrade verified PAID',async()=>{
      invoices.get('HB-'+order.orderId).statusCode='02';await cb(callback(order,reference,12500,'01'));
      assert.equal((await req(orderRoute(order),{token:cart.accessToken})).payment.status,'PAID');
    });
    await t.test('fulfillment rejects missing credentials and invalid transition',async()=>{
      await req(prefix+'/admin/orders/'+order.orderId+'/fulfillment',{method:'POST',body:{status:'PROCESSING'},status:401});
      await req(prefix+'/admin/orders/'+order.orderId+'/fulfillment',{method:'POST',token:adminToken,body:{status:'COMPLETED'},status:409});
    });
    await t.test('paid order progresses through manual fulfillment and controlled evidence',async()=>{
      for(const status of ['PROCESSING','FULFILLED','COMPLETED']) await req(prefix+'/admin/orders/'+order.orderId+'/fulfillment',{method:'POST',token:adminToken,body:{status,deliveryReference:'LOCAL synthetic delivery'}});
      const evidence=await req(prefix+'/admin/orders/'+order.orderId+'/evidence',{token:adminToken});assert.equal(evidence.order.status,'COMPLETED');assert.equal(evidence.fulfillment.status,'COMPLETED');assert.equal(evidence.order.release_commit,release);assert(!JSON.stringify(evidence).includes('synthetic@example.invalid'));assert(!JSON.stringify(evidence).includes(apiKey));
      await req('/api/commerce/stores/other/admin/orders/'+order.orderId+'/evidence',{token:adminToken,status:401});
    });
    await t.test('stale price revalidation rolls back customer and order creation',async()=>{
      const c=await makeCart();await item(c);await db.prepare('UPDATE offers SET price_idr=14000 WHERE id=?').bind(product.offerId).run();
      const before=(await query('SELECT COUNT(*) AS n FROM customers')).n;await checkout(c,randomBytes(16).toString('hex'),{},409);assert.equal((await query('SELECT COUNT(*) AS n FROM customers')).n,before);
      await db.prepare('UPDATE offers SET price_idr=12500 WHERE id=?').bind(product.offerId).run();
    });
    await t.test('invalid stock at checkout rejected atomically',async()=>{
      const c=await makeCart();await item(c);await db.prepare('UPDATE product_variants SET stock=0 WHERE id=?').bind(product.variantId).run();await checkout(c,randomBytes(16).toString('hex'),{},409);
    });
    await t.test('concurrent checkout cannot oversell last available stock',async()=>{
      await db.prepare('UPDATE product_variants SET stock=1 WHERE id=?').bind(product.variantId).run();const a=await makeCart(),b=await makeCart();await item(a);await item(b);
      const result=await Promise.allSettled([checkout(a),checkout(b)]);assert.equal(result.filter(r=>r.status==='fulfilled').length,1);
      assert.equal((await query('SELECT stock FROM product_variants WHERE id=?',product.variantId)).stock,0);
    });
    await t.test('concurrent same-idempotency checkout creates exactly one order',async()=>{
      await db.prepare('UPDATE product_variants SET stock=4 WHERE id=?').bind(product.variantId).run();const c=await makeCart();await item(c);const k=randomBytes(16).toString('hex');
      const results=await Promise.all([checkout(c,k,{},201).catch(()=>checkout(c,k,{},200)),checkout(c,k,{},200).catch(()=>checkout(c,k,{},200))]);
      assert.equal(results[0].orderId,results[1].orderId);assert.equal((await query('SELECT COUNT(*) AS n FROM orders WHERE idempotency_key=?',k)).n,1);
    });
    await t.test('provider failure quarantines invoice attempt and prevents unsafe recreation',async()=>{
      const c=await makeCart();await item(c);const o=await checkout(c);providerFail=true;await pay(o,c,503);providerFail=false;
      assert.equal((await query('SELECT status FROM payments WHERE order_id=?',o.orderId)).status,'UNKNOWN');await pay(o,c,409);
    });
    await t.test('operator reads drafts and updates scoped offer and variant availability',async()=>{
      const list=await req(prefix+'/admin/products',{token:adminToken});assert.equal(list.products[0].id,product.productId);
      await req(prefix+'/admin/offers/'+product.offerId,{method:'PATCH',token:adminToken,body:{priceIdr:12500,status:'active'}});
      await req(prefix+'/admin/variants/'+product.variantId,{method:'PATCH',token:adminToken,body:{stock:8,status:'active'}});
      await req('/api/commerce/stores/other/admin/offers/'+product.offerId,{method:'PATCH',token:adminToken,body:{priceIdr:1},status:401});
      await req(prefix+'/admin/variants/unknown',{method:'PATCH',token:adminToken,body:{stock:1},status:404});
    });
    await t.test('cart in other storefront cannot reference direct storefront offer',async()=>{
      const other=await req('/api/commerce/stores/other/carts',{method:'POST',status:201});
      await req('/api/commerce/stores/other/carts/'+other.cartId+'/items',{method:'PUT',token:other.accessToken,body:{offerId:product.offerId,quantity:1},status:409});
    });
    await t.test('unpublish after cart creation prevents checkout',async()=>{
      const c=await makeCart();await item(c);
      await req(prefix+'/admin/products/'+product.productId,{method:'PATCH',token:adminToken,body:{status:'draft'}});
      await checkout(c,randomBytes(16).toString('hex'),{},409);
      await req(prefix+'/admin/products/'+product.productId,{method:'PATCH',token:adminToken,body:{status:'published'}});
    });
    await t.test('inactive variant after cart creation prevents checkout',async()=>{
      const c=await makeCart();await item(c);
      await req(prefix+'/admin/variants/'+product.variantId,{method:'PATCH',token:adminToken,body:{status:'inactive'}});
      await checkout(c,randomBytes(16).toString('hex'),{},409);
      await req(prefix+'/admin/variants/'+product.variantId,{method:'PATCH',token:adminToken,body:{status:'active'}});
    });
    await t.test('unpaid failed callback recorded without marking order PAID, cancellation releases stock exactly once',async()=>{
      const c=await makeCart();await item(c);const o=await checkout(c),invoice=await pay(o,c);
      invoices.get('HB-'+o.orderId).statusCode='02';await cb(callback(o,invoice.reference,12500,'01'));
      const current=await req(orderRoute(o),{token:c.accessToken});assert.equal(current.status,'PENDING_PAYMENT');assert.equal(current.payment.status,'FAILED');
      const before=(await query('SELECT stock FROM product_variants WHERE id=?',product.variantId)).stock;
      await req(prefix+'/admin/orders/'+o.orderId+'/cancel',{method:'POST',token:adminToken});
      assert.equal((await query('SELECT stock FROM product_variants WHERE id=?',product.variantId)).stock,before+1);
      await req(prefix+'/admin/orders/'+o.orderId+'/cancel',{method:'POST',token:adminToken,status:409});
      assert.equal((await query('SELECT stock FROM product_variants WHERE id=?',product.variantId)).stock,before+1);
    });
    await t.test('database rejects direct forged paid payment update',async()=>{
      const c=await makeCart();await item(c);const o=await checkout(c);
      await assert.rejects(db.prepare("UPDATE payments SET status='PAID' WHERE order_id=?").bind(o.orderId).run(),/PAYMENT_NOT_VERIFIED/);
      await assert.rejects(db.prepare('UPDATE payments SET amount_idr=1 WHERE order_id=?').bind(o.orderId).run(),/IMMUTABLE_PAYMENT/);
      await req(prefix+'/admin/orders/'+o.orderId+'/cancel',{method:'POST',token:adminToken});
    });
    await t.test('duplicate callback fields are rejected',async()=>{
      const fields=callback(order,reference),form=new URLSearchParams(fields);form.append('amount','1');
      const response=await mf.dispatchFetch('https://commerce.test/api/commerce/payments/duitku/callback',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:form.toString()});assert.equal(response.status,400);
    });
    await t.test('private digital asset registration rejects incorrect hashes',async()=>{
      const bucket=await mf.getR2Bucket('PRODUCT_BUCKET'),bytes=Buffer.from('504b05060000000000000000000000000000000000000000','hex');
      await bucket.put('brs/LOCAL-COMPLETE.zip',bytes);
      await req(prefix+'/admin/variants/'+product.variantId+'/digital-delivery',{method:'PUT',token:adminToken,body:{version:'LOCAL-V1',objectKey:'brs/LOCAL-COMPLETE.zip',sha256:'0'.repeat(64),bytes:bytes.length,filename:'LOCAL-COMPLETE.zip'},status:409});
    });
    let digitalOrder,digitalCart,digitalBytes,digitalSha;
    await t.test('digital package is verified and pinned to canonical variant before checkout',async()=>{
      digitalBytes=Buffer.from('504b05060000000000000000000000000000000000000000','hex');digitalSha=(await import('node:crypto')).createHash('sha256').update(digitalBytes).digest('hex');
      await req(prefix+'/admin/variants/'+product.variantId+'/digital-delivery',{method:'PUT',token:adminToken,body:{version:'LOCAL-V1',objectKey:'brs/LOCAL-COMPLETE.zip',sha256:digitalSha,bytes:digitalBytes.length,filename:'LOCAL-COMPLETE.zip'}});
      digitalCart=await makeCart();await item(digitalCart);digitalOrder=await checkout(digitalCart);
      const current=await req(orderRoute(digitalOrder),{token:digitalCart.accessToken});assert.equal(current.downloads[0].version,'LOCAL-V1');assert.equal(current.downloads[0].sha256,digitalSha);
      await req(prefix+'/admin/variants/'+product.variantId+'/digital-delivery',{method:'PUT',token:adminToken,body:{},status:409});
    });
    await t.test('unpaid or cross-store buyer cannot download product',async()=>{
      await req(orderRoute(digitalOrder)+'/download/'+product.variantId,{token:digitalCart.accessToken,status:409});
      await req('/api/commerce/stores/other/orders/'+digitalOrder.orderId+'/download/'+product.variantId,{token:digitalCart.accessToken,status:404});
      await req(orderRoute(digitalOrder)+'/download/'+product.variantId,{token:adminToken,status:404});
    });
    await t.test('verified callback grants entitlement but corrupt R2 bytes cannot be delivered',async()=>{
      const invoice=await pay(digitalOrder,digitalCart);invoices.get('HB-'+digitalOrder.orderId).statusCode='00';await cb(callback(digitalOrder,invoice.reference));
      const bucket=await mf.getR2Bucket('PRODUCT_BUCKET');await bucket.put('brs/LOCAL-COMPLETE.zip','CORRUPT');
      await req(orderRoute(digitalOrder)+'/download/'+product.variantId,{token:digitalCart.accessToken,status:503});
      assert.equal((await req(orderRoute(digitalOrder),{token:digitalCart.accessToken})).status,'PAID');
      await bucket.put('brs/LOCAL-COMPLETE.zip',digitalBytes,{customMetadata:{sha256:digitalSha}});
    });
    await t.test('authorized download returns only matching package and fulfills without premature completion',async()=>{
      const response=await mf.dispatchFetch('https://commerce.test'+orderRoute(digitalOrder)+'/download/'+product.variantId,{headers:{Authorization:'Bearer '+digitalCart.accessToken}});
      assert.equal(response.status,200);assert.equal(response.headers.get('content-type'),'application/zip');assert.equal(response.headers.get('x-product-sha256'),digitalSha);assert.deepEqual(Buffer.from(await response.arrayBuffer()),digitalBytes);
      assert.equal((await req(orderRoute(digitalOrder),{token:digitalCart.accessToken})).status,'FULFILLED');
      await req(orderRoute(digitalOrder)+'/delivery-confirmation',{method:'POST',token:digitalCart.accessToken,body:{variantId:product.variantId,sha256:'0'.repeat(64)},status:409});
    });
    await t.test('customer receipt completes the paid order with matching asset hash, duplicates harmless',async()=>{
      for(let i=0;i<2;i++)await req(orderRoute(digitalOrder)+'/delivery-confirmation',{method:'POST',token:digitalCart.accessToken,body:{variantId:product.variantId,sha256:digitalSha}});
      const current=await req(orderRoute(digitalOrder),{token:digitalCart.accessToken});assert.equal(current.status,'COMPLETED');
      assert.equal((await query('SELECT status FROM fulfillments WHERE order_id=?',digitalOrder.orderId)).status,'COMPLETED');
    });
    await t.test('private support tickets and scoped operator replies do not bypass order authorization',async()=>{
      const ticket=await req(orderRoute(digitalOrder)+'/support',{method:'POST',token:digitalCart.accessToken,body:{category:'download',message:'LOCAL_ONLY help request'},status:201});
      await req(orderRoute(digitalOrder)+'/support',{token:adminToken,status:404});
      await req(prefix+'/admin/support/'+ticket.requestId,{method:'PATCH',body:{reply:'LOCAL_ONLY reply'},status:401});
      await req(prefix+'/admin/support/'+ticket.requestId,{method:'PATCH',token:adminToken,body:{reply:'LOCAL_ONLY reply'}});
      assert.equal((await req(orderRoute(digitalOrder)+'/support',{token:digitalCart.accessToken})).requests[0].operator_reply,'LOCAL_ONLY reply');
    });
    await t.test('request body limit and API not-found are structured',async()=>{
      await req(prefix+'/admin/products',{method:'POST',token:adminToken,body:{...productBody,description:'x'.repeat(18000)},status:413});
      await req(prefix+'/unknown',{status:404});
    });
    await t.test('migration foreign-key integrity holds after all scenarios',async()=>assert.deepEqual((await db.prepare('PRAGMA foreign_key_check').all()).results,[]));
  } finally { await mf.dispose(); }
});

test('Production fail-closed foundation: disabled commerce, missing secrets, no fake products',async t=>{
  const mf=new Miniflare(convertV4MiniflareOptions({modules:true,scriptPath:'dist/_worker.js',compatibilityDate:'2026-10-01',d1Databases:['DB'],bindings:{ENVIRONMENT:'production',PUBLIC_ORIGIN:'https://webapp-4.pages.dev',DUITKU_ENV:'production',COMMERCE_ENABLED:'false',COMMERCIAL_POLICY_APPROVED:'false',ADMIN_STOREFRONT_ID:'holbery-direct'},outboundService:()=>{throw new Error('Blocked production must never contact provider');}}));
  try {
    const db=await mf.getD1Database('DB');await migrate(db);
    await t.test('readiness reports real configuration gaps but usable foundation',async()=>{
      const response=await mf.dispatchFetch('https://webapp-4.pages.dev/api/commerce/readiness');assert.equal(response.status,503);
      const report=await response.json();assert.equal(report.foundation,'VERIFIED');assert(report.missing.includes('DUITKU_API_KEY'));assert(report.missing.includes('COMMERCE_ENABLED'));assert.equal(report.payment,'NOT STARTED');assert.match(report.release,/^[a-f0-9]{40}$/);
    });
    await t.test('cart and checkout creation fail closed without writing runtime data',async()=>{
      for(const path of ['carts','checkouts']) {const r=await mf.dispatchFetch('https://webapp-4.pages.dev/api/commerce/stores/direct/'+path,{method:'POST',headers:{'Content-Type':'application/json'},body:'{}'});assert.equal(r.status,503);}
      assert.equal((await db.prepare('SELECT COUNT(*) AS n FROM orders').first()).n,0);assert.equal((await db.prepare('SELECT COUNT(*) AS n FROM customers').first()).n,0);
    });
    await t.test('admin mutation disabled when its secret is absent',async()=>{
      const r=await mf.dispatchFetch('https://webapp-4.pages.dev/api/commerce/stores/direct/admin/products',{method:'POST',headers:{'Content-Type':'application/json'},body:'{}'});assert.equal(r.status,503);
    });
    await t.test('empty real storefront makes no commercial claims',async()=>{
      const response=await mf.dispatchFetch('https://webapp-4.pages.dev/store/direct');assert.equal(response.status,200);assert.match(await response.text(),/Belum ada produk/);
      assert.equal((await db.prepare('SELECT COUNT(*) AS n FROM products').first()).n,0);
    });
    await t.test('callback cannot mutate without merchant credentials',async()=>{
      const r=await mf.dispatchFetch('https://webapp-4.pages.dev/api/commerce/payments/duitku/callback',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:'merchantCode=LOCAL&merchantOrderId=LOCAL&amount=1&reference=LOCAL&resultCode=00&signature='+('0'.repeat(64))});assert.equal(r.status,503);
      assert.equal((await db.prepare('SELECT COUNT(*) AS n FROM payment_events').first()).n,0);
    });
  }finally{await mf.dispose();}
});
