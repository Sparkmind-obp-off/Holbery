import { Hono, type Context } from 'hono'
import { bodyLimit } from 'hono/body-limit'
import { DuitkuAdapter, ProviderError, digest, equal } from './payments'
import { digitalReadiness, verifiedAsset, type DeliveryAsset } from './digital'

export type Bindings = {
  DB: D1Database; ENVIRONMENT?: string; PUBLIC_ORIGIN?: string; COMMERCE_ENABLED?: string;
  DUITKU_ENV?: string; DUITKU_MERCHANT_CODE?: string; DUITKU_API_KEY?: string;
  COMMERCE_ADMIN_TOKEN?: string; ADMIN_STOREFRONT_ID?: string; RELEASE_COMMIT?: string;
  COMMERCIAL_POLICY_APPROVED?: string; PRODUCT_BUCKET?: R2Bucket;
  SUPPORT_CHANNEL?: string; TERMS_VERSION?: string; REFUND_POLICY_VERSION?: string; PRIVACY_POLICY_VERSION?: string; FULFILLMENT_MODE?: string;
}
declare const __RELEASE_COMMIT__: string
const releaseCommit = (e: Bindings) => e.RELEASE_COMMIT || __RELEASE_COMMIT__
type Store = { id: string; slug: string; organization_id: string; brand_id: string; name: string }
type Env = { Bindings: Bindings; Variables: { requestId: string; store: Store } }
type C = Context<Env>
type Row = Record<string, string | number | null>
export const commerce = new Hono<Env>()
class CommerceError extends Error { constructor(public code: string, public status: 400 | 401 | 404 | 409 | 413 | 429 | 503 = 400) { super(code) } }
const fail = (code: string, status: CommerceError['status'] = 400): never => { throw new CommerceError(code, status) }
const now = () => new Date().toISOString()
const id = () => crypto.randomUUID().replaceAll('-', '')
const esc = (v: unknown) => String(v).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!))
const statement = (c: C, sql: string, ...values: (string | number | null)[]) => c.env.DB.prepare(sql).bind(...values)
async function first(c: C, sql: string, ...values: (string | number | null)[]) { return statement(c,sql,...values).first<Row>() }
const store = (c: C) => c.get('store')
const bearer = (c: C) => c.req.header('Authorization')?.match(/^Bearer ([A-Za-z0-9_-]{16,128})$/)?.[1] || ''
function text(value: unknown, field: string, max = 160) { if (typeof value !== 'string' || !value.trim() || value.length > max || /[\x00-\x1f]/.test(value)) fail('INVALID_' + field); return (value as string).trim() }
function integer(value: unknown, field: string, min: number, max: number) { if (typeof value !== 'number' || !Number.isSafeInteger(value) || value < min || value > max) fail('INVALID_' + field); return value as number }
async function body(c: C, allowed: string[]) {
  if (!c.req.header('Content-Type')?.includes('application/json')) fail('JSON_REQUIRED')
  let b: unknown; try { b = await c.req.json() } catch { fail('INVALID_JSON') }
  if (!b || typeof b !== 'object' || Array.isArray(b)) fail('INVALID_BODY')
  const value = b as Record<string,unknown>
  if (Object.keys(value).some(k=>!allowed.includes(k))) fail('UNEXPECTED_FIELD')
  return value
}
function configBlockers(e: Bindings) {
  const missing: string[] = []
  if (!['production','development'].includes(e.ENVIRONMENT || '')) missing.push('ENVIRONMENT')
  if (!e.PUBLIC_ORIGIN || !/^https:\/\/[^/]+$/.test(e.PUBLIC_ORIGIN)) missing.push('PUBLIC_ORIGIN')
  if (!['production','sandbox'].includes(e.DUITKU_ENV || '') || (e.ENVIRONMENT === 'production' && e.DUITKU_ENV !== 'production')) missing.push('DUITKU_ENV')
  if (!e.DUITKU_MERCHANT_CODE) missing.push('DUITKU_MERCHANT_CODE')
  if (!e.DUITKU_API_KEY) missing.push('DUITKU_API_KEY')
  if (!e.COMMERCE_ADMIN_TOKEN || e.COMMERCE_ADMIN_TOKEN.length < 32) missing.push('COMMERCE_ADMIN_TOKEN')
  if (!e.ADMIN_STOREFRONT_ID) missing.push('ADMIN_STOREFRONT_ID')
  if (!/^[a-f0-9]{40}$/.test(releaseCommit(e))) missing.push('RELEASE_COMMIT')
  if (e.COMMERCIAL_POLICY_APPROVED !== 'true') missing.push('COMMERCIAL_POLICY_APPROVED')
  if (e.COMMERCE_ENABLED !== 'true') missing.push('COMMERCE_ENABLED')
  if (e.ENVIRONMENT === 'production') {
    if (!e.PRODUCT_BUCKET) missing.push('PRODUCT_BUCKET')
    if (e.SUPPORT_CHANNEL !== '/support/commerce') missing.push('SUPPORT_CHANNEL')
    if (!e.TERMS_VERSION || !e.REFUND_POLICY_VERSION || !e.PRIVACY_POLICY_VERSION) missing.push('COMMERCIAL_POLICY_VERSIONS')
    if (e.FULFILLMENT_MODE !== 'secure-download') missing.push('FULFILLMENT_MODE')
  }
  return missing
}
async function transactions(c: C) {
  if (configBlockers(c.env).length || (await digitalReadiness(c.env,store(c).id)).length) fail('COMMERCE_NOT_READY',503)
}
async function rate(c: C, action: string) {
  const window=Math.floor(Date.now()/60000), keyHash=await digest(action+':'+store(c).id+':'+(c.req.header('CF-Connecting-IP') || 'local'))
  const result=await c.env.DB.batch([
    statement(c,'DELETE FROM commerce_rate_limits WHERE window<?',window-2),
    statement(c,'INSERT INTO commerce_rate_limits VALUES (?,?,1) ON CONFLICT(key_hash) DO UPDATE SET window=excluded.window,count=CASE WHEN commerce_rate_limits.window=excluded.window THEN commerce_rate_limits.count+1 ELSE 1 END RETURNING count',keyHash,window)
  ])
  if(Number((result[1].results[0] as Row).count)>30) { c.header('Retry-After','60');fail('RATE_LIMITED',429) }
}
function provider(c: C) {
  if (!c.env.DUITKU_API_KEY || !c.env.DUITKU_MERCHANT_CODE || !['production','sandbox'].includes(c.env.DUITKU_ENV || '') || (c.env.ENVIRONMENT === 'production' && c.env.DUITKU_ENV !== 'production') || !c.env.PUBLIC_ORIGIN) fail('PAYMENT_NOT_CONFIGURED',503)
  return new DuitkuAdapter({ environment: c.env.DUITKU_ENV as 'production' | 'sandbox', merchantCode: c.env.DUITKU_MERCHANT_CODE!, apiKey: c.env.DUITKU_API_KEY!, origin: c.env.PUBLIC_ORIGIN! })
}
async function admin(c: C) {
  const token = c.env.COMMERCE_ADMIN_TOKEN
  if (!token || token.length < 32) fail('ADMIN_NOT_CONFIGURED',503)
  if (c.env.ADMIN_STOREFRONT_ID !== store(c).id || !equal(await digest(bearer(c)),await digest(token!))) fail('UNAUTHORIZED',401)
}
async function owned(c: C, kind: 'carts' | 'orders', objectId: string) {
  const row = await first(c,`SELECT * FROM ${kind} WHERE id=? AND storefront_id=? AND access_hash=?`,objectId,store(c).id,await digest(bearer(c)))
  if (!bearer(c) || !row) fail('NOT_FOUND',404)
  return row!
}
commerce.use('*',async (c,next)=>{
  c.set('requestId',crypto.randomUUID()); c.header('X-Request-ID',c.get('requestId')); c.header('Cache-Control','no-store'); c.header('Referrer-Policy','no-referrer')
  await next()
})
commerce.use('*',bodyLimit({ maxSize: 16384, onError: c=>c.json({error:{code:'BODY_TOO_LARGE',requestId:c.get('requestId')}},413) }))
commerce.onError((error,c)=>{
  if (error instanceof CommerceError) return c.json({error:{code:error.code,requestId:c.get('requestId')}},error.status)
  if (error instanceof ProviderError) return c.json({error:{code:'PROVIDER_UNAVAILABLE',requestId:c.get('requestId')}},503)
  if (/CART_|EMPTY_CART|STALE_|AMOUNT_MISMATCH|INVALID_TRANSITION|IMMUTABLE_|PAYMENT_|UNIQUE constraint|CHECK constraint|FOREIGN KEY constraint/.test(error.message)) return c.json({error:{code:'INTEGRITY_CONFLICT',requestId:c.get('requestId')}},409)
  // Do not log SQL, payload, provider responses, tokens, or customer information.
  console.error(JSON.stringify({event:'commerce_error',requestId:c.get('requestId')}))
  return c.json({error:{code:'INTERNAL_ERROR',requestId:c.get('requestId')}},500)
})
commerce.get('/api/commerce/readiness',async c=>{
  let database = false
  if (c.env.DB) try { database = !!await first(c,"SELECT s.id FROM storefronts s JOIN organizations o ON o.id=s.organization_id WHERE s.id='holbery-direct' AND s.status='active' AND o.status='active'") } catch { /* fail closed */ }
  const missing = configBlockers(c.env)
  const catalog = database ? await first(c,"SELECT count(*) AS count FROM offers o JOIN products p ON p.id=o.product_id JOIN product_variants v ON v.id=o.variant_id WHERE o.storefront_id='holbery-direct' AND o.status='active' AND p.status='published' AND v.status='active' AND v.stock>0") : null
  if (!catalog || !Number(catalog.count)) missing.push('APPROVED_PUBLISHED_PRODUCT')
  if (!database) missing.push('DB_MIGRATIONS')
  if (database) try { missing.push(...await digitalReadiness(c.env)) } catch { missing.push('DELIVERY_MIGRATIONS_OR_STORAGE') }
  return c.json({status:missing.length?'BLOCKED — HUMAN CONFIGURATION REQUIRED':'READY',foundation:database?'VERIFIED':'BLOCKED — HUMAN CONFIGURATION REQUIRED',payment:'NOT STARTED',missing,release:releaseCommit(c.env)},missing.length?503:200)
})
commerce.use('/api/commerce/stores/:slug/*',async(c,next)=>{
  if (!c.env.DB) fail('DATABASE_NOT_CONFIGURED',503)
  const result = await statement(c,"SELECT s.* FROM storefronts s JOIN organizations o ON o.id=s.organization_id WHERE s.slug=? AND s.status='active' AND o.status='active'",c.req.param('slug')!).first<Store>()
  if (!result) fail('STOREFRONT_NOT_FOUND',404)
  c.set('store',result!); await next()
})
const catalogSQL = `SELECT p.id,p.slug,p.name,p.description,p.type,v.id AS variant_id,v.name AS variant_name,v.sku,v.stock,o.id AS offer_id,o.price_idr FROM offers o JOIN products p ON p.id=o.product_id JOIN product_variants v ON v.id=o.variant_id WHERE o.storefront_id=? AND o.status='active' AND p.status='published' AND v.status='active'`
commerce.get('/api/commerce/stores/:slug/products',async c=>c.json({products:(await statement(c,catalogSQL + ' ORDER BY p.name LIMIT 100',store(c).id).all()).results}))
commerce.get('/api/commerce/stores/:slug/products/:product',async c=>{
  const products = (await statement(c,catalogSQL+' AND p.slug=?',store(c).id,c.req.param('product')).all()).results
  if (!products.length) fail('PRODUCT_NOT_FOUND',404)
  return c.json({variants:products})
})
commerce.post('/api/commerce/stores/:slug/admin/products',async c=>{
  await admin(c)
  const b = await body(c,['name','slug','description','type','sku','variantName','stock','priceIdr'])
  const name=text(b.name,'NAME'), slug=text(b.slug,'SLUG',100), description=text(b.description,'DESCRIPTION',4000), sku=text(b.sku,'SKU',100), variantName=text(b.variantName,'VARIANT_NAME')
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || !['digital','service','physical'].includes(String(b.type))) fail('INVALID_PRODUCT')
  const stock=integer(b.stock,'STOCK',0,1000000), price=integer(b.priceIdr,'PRICE',1,100000000), p=id(),v=id(),o=id(),s=store(c),date=now()
  await c.env.DB.batch([
    statement(c,'INSERT INTO products VALUES (?,?,?,?,?,?,?,\'draft\',?,?)',p,s.organization_id,s.brand_id,slug,name,description,String(b.type),date,date),
    statement(c,"INSERT INTO product_variants VALUES (?,?,?,?,?,'active')",v,p,sku,variantName,stock),
    statement(c,"INSERT INTO offers VALUES (?,?,?,?,?,?,?,'active')",o,s.organization_id,s.brand_id,s.id,p,v,price),
    statement(c,"INSERT INTO commerce_events VALUES (?,?,?,?,?,?,?)",id(),s.organization_id,s.id,null,'CATALOG_CREATED',p,date)
  ])
  return c.json({productId:p,variantId:v,offerId:o,status:'draft',url:`/store/${s.slug}/products/${slug}`},201)
})
commerce.patch('/api/commerce/stores/:slug/admin/products/:productId',async c=>{
  await admin(c); const s=store(c),p=c.req.param('productId')
  if (!await first(c,'SELECT p.id FROM products p JOIN offers o ON o.product_id=p.id WHERE p.id=? AND p.organization_id=? AND p.brand_id=? AND o.storefront_id=?',p,s.organization_id,s.brand_id,s.id)) fail('NOT_FOUND',404)
  const b=await body(c,['name','description','status'])
  if (!Object.keys(b).length) fail('EMPTY_UPDATE')
  const clauses:string[]=[],args:(string|number|null)[]=[]
  for (const field of ['name','description'] as const) if (b[field]!==undefined) { clauses.push(field+'=?'); args.push(text(b[field],field.toUpperCase(),field==='description'?4000:160)) }
  if (b.status!==undefined) {
    if (!['draft','published'].includes(String(b.status))) fail('INVALID_STATUS')
    if (b.status==='published') {
      const available=await first(c,"SELECT p.type FROM products p JOIN offers o ON o.product_id=p.id JOIN product_variants v ON v.id=o.variant_id WHERE p.id=? AND o.storefront_id=? AND o.status='active' AND v.status='active' AND v.stock>0",p,s.id)
      if (!available || available.type==='physical') fail('CATALOG_NOT_DELIVERABLE') // Shipping/address policy is not implemented yet.
    }
    clauses.push('status=?');args.push(String(b.status))
  }
  const date=now()
  await c.env.DB.batch([statement(c,`UPDATE products SET ${clauses.join(',')},updated_at=? WHERE id=? AND organization_id=? AND brand_id=?`,...args,date,p,s.organization_id,s.brand_id),statement(c,'INSERT INTO commerce_events VALUES (?,?,?,?,?,?,?)',id(),s.organization_id,s.id,null,'CATALOG_UPDATED',p,date)])
  return c.json({status:'IMPLEMENTED'})
})
commerce.get('/api/commerce/stores/:slug/admin/products',async c=>{
  await admin(c)
  return c.json({products:(await statement(c,'SELECT p.*,v.id AS variant_id,v.name AS variant_name,v.sku,v.stock,v.status AS variant_status,o.id AS offer_id,o.price_idr,o.status AS offer_status FROM products p JOIN offers o ON o.product_id=p.id JOIN product_variants v ON v.id=o.variant_id WHERE o.storefront_id=? AND p.organization_id=? AND p.brand_id=? ORDER BY p.created_at DESC LIMIT 100',store(c).id,store(c).organization_id,store(c).brand_id).all()).results})
})
commerce.patch('/api/commerce/stores/:slug/admin/offers/:offerId',async c=>{
  await admin(c);const s=store(c),offerId=c.req.param('offerId')
  if(!await first(c,'SELECT id FROM offers WHERE id=? AND storefront_id=? AND organization_id=? AND brand_id=?',offerId,s.id,s.organization_id,s.brand_id)) fail('NOT_FOUND',404)
  const b=await body(c,['priceIdr','status']),clauses:string[]=[],args:(string|number|null)[]=[]
  if(b.priceIdr!==undefined) { clauses.push('price_idr=?');args.push(integer(b.priceIdr,'PRICE',1,100000000)) }
  if(b.status!==undefined) { if(!['active','inactive'].includes(String(b.status))) fail('INVALID_STATUS');clauses.push('status=?');args.push(String(b.status)) }
  if(!clauses.length) fail('EMPTY_UPDATE')
  await c.env.DB.batch([statement(c,`UPDATE offers SET ${clauses.join(',')} WHERE id=? AND storefront_id=?`,...args,offerId,s.id),statement(c,'INSERT INTO commerce_events VALUES (?,?,?,?,?,?,?)',id(),s.organization_id,s.id,null,'OFFER_UPDATED',offerId,now())])
  return c.json({status:'IMPLEMENTED'})
})
commerce.patch('/api/commerce/stores/:slug/admin/variants/:variantId',async c=>{
  await admin(c);const s=store(c),variantId=c.req.param('variantId')
  if(!await first(c,'SELECT v.id FROM product_variants v JOIN products p ON p.id=v.product_id JOIN offers o ON o.variant_id=v.id WHERE v.id=? AND o.storefront_id=? AND p.organization_id=? AND p.brand_id=?',variantId,s.id,s.organization_id,s.brand_id)) fail('NOT_FOUND',404)
  const b=await body(c,['name','stock','status']),clauses:string[]=[],args:(string|number|null)[]=[]
  if(b.name!==undefined) { clauses.push('name=?');args.push(text(b.name,'NAME')) }
  if(b.stock!==undefined) { clauses.push('stock=?');args.push(integer(b.stock,'STOCK',0,1000000)) }
  if(b.status!==undefined) { if(!['active','inactive'].includes(String(b.status))) fail('INVALID_STATUS');clauses.push('status=?');args.push(String(b.status)) }
  if(!clauses.length) fail('EMPTY_UPDATE')
  await c.env.DB.batch([statement(c,`UPDATE product_variants SET ${clauses.join(',')} WHERE id=?`,...args,variantId),statement(c,'INSERT INTO commerce_events VALUES (?,?,?,?,?,?,?)',id(),s.organization_id,s.id,null,'VARIANT_UPDATED',variantId,now())])
  return c.json({status:'IMPLEMENTED',stockSemantics:'Available units, excluding already reserved units'})
})
commerce.get('/api/commerce/stores/:slug/admin/orders',async c=>{
  await admin(c)
  return c.json({orders:(await statement(c,'SELECT o.id,o.status,o.total_idr,o.created_at,p.status AS payment_status,p.provider_reference FROM orders o JOIN payments p ON p.order_id=o.id WHERE o.storefront_id=? AND o.organization_id=? ORDER BY o.created_at DESC LIMIT 100',store(c).id,store(c).organization_id).all()).results})
})
commerce.post('/api/commerce/stores/:slug/carts',async c=>{
  await transactions(c); await rate(c,'cart'); const token=id()+id(),cart=id()
  await statement(c,"INSERT INTO carts VALUES (?,?,?,'OPEN',?)",cart,store(c).id,await digest(token),now()).run()
  return c.json({cartId:cart,accessToken:token},201)
})
commerce.get('/api/commerce/stores/:slug/carts/:cartId',async c=>{
  const cart=await owned(c,'carts',c.req.param('cartId'))
  const items=(await statement(c,'SELECT ci.offer_id,ci.quantity,ci.price_idr,p.name AS product_name FROM cart_items ci JOIN offers o ON o.id=ci.offer_id JOIN products p ON p.id=o.product_id WHERE ci.cart_id=? AND ci.storefront_id=?',String(cart.id),store(c).id).all()).results
  return c.json({cartId:cart.id,status:cart.status,items})
})
commerce.put('/api/commerce/stores/:slug/carts/:cartId/items',async c=>{
  await transactions(c); const cart=await owned(c,'carts',c.req.param('cartId')); if(cart.status!=='OPEN') fail('CART_CLOSED',409)
  const b=await body(c,['offerId','quantity']),offerId=text(b.offerId,'OFFER',100),quantity=integer(b.quantity,'QUANTITY',1,99)
  const offer=await first(c,'SELECT o.id,o.price_idr FROM offers o JOIN products p ON p.id=o.product_id JOIN product_variants v ON v.id=o.variant_id WHERE o.id=? AND o.storefront_id=? AND o.status=\'active\' AND p.status=\'published\' AND v.status=\'active\' AND v.stock>=?',offerId,store(c).id,quantity)
  if (!offer) fail('OFFER_UNAVAILABLE',409)
  const count=await first(c,'SELECT count(*) AS n FROM cart_items WHERE cart_id=?',String(cart.id)); if (Number(count?.n)>=20 && !await first(c,'SELECT offer_id FROM cart_items WHERE cart_id=? AND offer_id=?',String(cart.id),offerId)) fail('CART_LIMIT',409)
  await statement(c,'INSERT INTO cart_items VALUES (?,?,?,?,?) ON CONFLICT(cart_id,offer_id) DO UPDATE SET quantity=excluded.quantity,price_idr=excluded.price_idr',String(cart.id),store(c).id,offerId,quantity,Number(offer!.price_idr)).run()
  return c.json({offerId,quantity,unitPriceIdr:offer!.price_idr})
})
commerce.delete('/api/commerce/stores/:slug/carts/:cartId/items/:offerId',async c=>{
  const cart=await owned(c,'carts',c.req.param('cartId')); if(cart.status!=='OPEN') fail('CART_CLOSED',409)
  await statement(c,'DELETE FROM cart_items WHERE cart_id=? AND storefront_id=? AND offer_id=?',String(cart.id),store(c).id,c.req.param('offerId')).run()
  return c.json({removed:true})
})
commerce.post('/api/commerce/stores/:slug/checkouts',async c=>{
  await transactions(c); await rate(c,'checkout')
  const b=await body(c,['cartId','name','email','consent']),cartId=text(b.cartId,'CART',100),cart=await owned(c,'carts',cartId),key=text(c.req.header('Idempotency-Key'),'IDEMPOTENCY_KEY',100)
  if(!/^[A-Za-z0-9_-]{16,100}$/.test(key)) fail('INVALID_IDEMPOTENCY_KEY')
  const existing=await first(c,'SELECT id,cart_id FROM orders WHERE storefront_id=? AND idempotency_key=?',store(c).id,key)
  if(existing) { if(existing.cart_id!==cartId) fail('IDEMPOTENCY_CONFLICT',409); return c.json({orderId:existing.id,replayed:true}) }
  if(cart.status!=='OPEN') fail('CART_CLOSED',409)
  const name=text(b.name,'NAME',100),email=text(b.email,'EMAIL',255)
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || b.consent!==true) fail('INVALID_CUSTOMER_OR_CONSENT')
  const total=await first(c,'SELECT SUM(quantity*price_idr) AS total FROM cart_items WHERE cart_id=? AND storefront_id=?',cartId,store(c).id)
  const amount=integer(total?.total,'TOTAL',1,100000000),customer=id(),order=id(),s=store(c),date=now()
  try {
    await c.env.DB.batch([
      statement(c,'INSERT INTO customers VALUES (?,?,?,?,?)',customer,s.organization_id,name,email,date),
      statement(c,"INSERT INTO orders VALUES (?,?,?,?,?,?,?,?,'PENDING_PAYMENT',?,'IDR',?,?,?,?)",order,s.organization_id,s.brand_id,s.id,cartId,customer,String(cart.access_hash),key,amount,releaseCommit(c.env),c.env.ENVIRONMENT!,date,date)
    ])
  } catch(error) {
    const duplicate=await first(c,'SELECT id,cart_id FROM orders WHERE storefront_id=? AND idempotency_key=?',s.id,key)
    if(duplicate && duplicate.cart_id===cartId) return c.json({orderId:duplicate.id,replayed:true})
    throw error
  }
  return c.json({orderId:order,totalIdr:amount,currency:'IDR',status:'PENDING_PAYMENT'},201)
})
commerce.get('/api/commerce/stores/:slug/orders/:orderId',async c=>{
  const order=await owned(c,'orders',c.req.param('orderId'))
  const items=(await statement(c,'SELECT product_name,variant_name,quantity,unit_price_idr,line_total_idr FROM order_items WHERE order_id=?',String(order.id)).all()).results
  const payment=await first(c,'SELECT status,provider_reference FROM payments WHERE order_id=?',String(order.id))
  const downloads=(await statement(c,'SELECT variant_id,version,sha256,filename FROM order_delivery_assets WHERE order_id=?',String(order.id)).all()).results
  return c.json({orderId:order.id,status:order.status,totalIdr:order.total_idr,currency:'IDR',items,payment,downloads,supportPath:'/support/commerce',termsPath:'/terms/commerce',refundPath:'/refund/commerce'})
})
commerce.post('/api/commerce/stores/:slug/orders/:orderId/payments',async c=>{
  await transactions(c); const order=await owned(c,'orders',c.req.param('orderId')),s=store(c)
  if(order.status!=='PENDING_PAYMENT') fail('ORDER_NOT_PAYABLE',409)
  const payment=await first(c,'SELECT * FROM payments WHERE order_id=?',String(order.id))
  if(payment?.provider_reference) return c.json({reference:payment.provider_reference,paymentUrl:payment.payment_url})
  const date=now()
  const claimed=await statement(c,"UPDATE payments SET status='CREATING',updated_at=? WHERE order_id=? AND status='CREATED'",date,String(order.id)).run()
  if(!claimed.meta.changes) fail('PAYMENT_IN_PROGRESS_OR_RECONCILIATION_REQUIRED',409)
  const customer=await first(c,'SELECT name,email FROM customers WHERE id=? AND organization_id=?',String(order.customer_id),s.organization_id)
  const items=(await statement(c,'SELECT product_name AS name,unit_price_idr AS price,quantity FROM order_items WHERE order_id=?',String(order.id)).all<{name:string;price:number;quantity:number}>()).results
  try {
    const invoice=await provider(c).createInvoice({merchantOrderId:String(payment!.merchant_order_id),amount:Number(order.total_idr),orderId:String(order.id),name:String(customer!.name),email:String(customer!.email),items})
    await c.env.DB.batch([
      statement(c,"UPDATE payments SET provider_reference=?,payment_url=?,status='PENDING',updated_at=? WHERE order_id=? AND status='CREATING'",invoice.reference,invoice.paymentUrl,now(),String(order.id)),
      statement(c,'INSERT INTO commerce_events VALUES (?,?,?,?,?,?,?)',id(),s.organization_id,s.id,String(order.id),'INVOICE_CREATED',invoice.reference,now())
    ])
    return c.json(invoice,201)
  } catch(error) {
    // Provider may have created an invoice even if the response was lost. NEVER blindly recreate it.
    await c.env.DB.batch([
      statement(c,"UPDATE payments SET status='UNKNOWN',updated_at=? WHERE order_id=? AND status='CREATING'",now(),String(order.id)),
      statement(c,'INSERT INTO commerce_events VALUES (?,?,?,?,?,?,?)',id(),s.organization_id,s.id,String(order.id),'INVOICE_OUTCOME_UNKNOWN','Reconciliation required; automatic recreation forbidden',now())
    ])
    throw error
  }
})
commerce.post('/api/commerce/payments/duitku/callback',async c=>{
  if(!c.env.DB) fail('DATABASE_NOT_CONFIGURED',503)
  if(!c.req.header('Content-Type')?.startsWith('application/x-www-form-urlencoded')) fail('INVALID_CALLBACK_TYPE')
  const params=new URLSearchParams(await c.req.text()),fields:Record<string,string>={}
  for(const field of ['merchantCode','merchantOrderId','amount','reference','signature','resultCode']) {
    const values=params.getAll(field); if(values.length!==1 || !values[0] || values[0].length>128) fail('INVALID_CALLBACK')
    fields[field]=values[0]
  }
  if(!/^[1-9][0-9]{0,8}$/.test(fields.amount) || !['00','01'].includes(fields.resultCode) || !/^[A-Za-z0-9_-]{1,100}$/.test(fields.reference)) fail('INVALID_CALLBACK')
  const adapter=provider(c)
  if(!await adapter.verifyCallback(fields)) fail('INVALID_SIGNATURE',401)
  const p=await first(c,'SELECT p.*,o.total_idr,o.status AS order_status FROM payments p JOIN orders o ON o.id=p.order_id WHERE p.provider=\'duitku\' AND p.merchant_order_id=?',fields.merchantOrderId)
  if(!p) throw new CommerceError('UNKNOWN_PAYMENT',404)
  if(Number(p.amount_idr)!==Number(fields.amount) || Number(p.total_idr)!==Number(fields.amount) || p.provider_reference!==fields.reference) fail('PAYMENT_MISMATCH',409)
  const eventKey=await digest(['duitku',fields.merchantOrderId,fields.reference,fields.amount,fields.resultCode].join(':'))
  if(await first(c,'SELECT id FROM payment_events WHERE event_key=?',eventKey)) return c.text('OK')
  const status=await adapter.inquiry(fields.merchantOrderId)
  if(status.reference!==fields.reference || status.amount!==Number(fields.amount) || status.status!==(fields.resultCode==='00'?'PAID':'FAILED')) fail('PROVIDER_STATUS_MISMATCH',409)
  await statement(c,"INSERT INTO payment_events VALUES (?,?,?,'CALLBACK',?,?,?,1,?) ON CONFLICT(event_key) DO NOTHING",id(),String(p.id),eventKey,fields.resultCode,fields.reference,Number(fields.amount),now()).run()
  return c.text('OK')
})
commerce.get('/api/commerce/stores/:slug/admin/orders/:orderId/evidence',async c=>{
  await admin(c); const s=store(c)
  const order=await first(c,'SELECT id,status,release_commit,environment,storefront_id,total_idr FROM orders WHERE id=? AND storefront_id=? AND organization_id=?',c.req.param('orderId'),s.id,s.organization_id)
  if(!order) fail('NOT_FOUND',404)
  const payment=await first(c,'SELECT merchant_order_id,provider,provider_reference,status FROM payments WHERE order_id=?',String(order!.id))
  const events=(await statement(c,'SELECT event_type,result_code,received_at FROM payment_events WHERE payment_id=? ORDER BY received_at',String(order!.id)).all()).results
  const fulfillment=await first(c,'SELECT status,updated_at FROM fulfillments WHERE order_id=?',String(order!.id))
  const timeline=(await statement(c,'SELECT event_type,detail,created_at FROM commerce_events WHERE order_id=? AND storefront_id=? AND organization_id=? ORDER BY created_at',String(order!.id),s.id,s.organization_id).all()).results
  return c.json({order,payment,events,fulfillment,timeline})
})
commerce.post('/api/commerce/stores/:slug/admin/orders/:orderId/reconcile',async c=>{
  await admin(c); const order=await first(c,'SELECT id FROM orders WHERE id=? AND storefront_id=?',c.req.param('orderId'),store(c).id)
  if(!order) fail('NOT_FOUND',404)
  const p=await first(c,'SELECT * FROM payments WHERE order_id=?',String(order!.id)),status=await provider(c).inquiry(String(p!.merchant_order_id))
  if(status.amount!==Number(p!.amount_idr) || (p!.provider_reference && p!.provider_reference!==status.reference)) fail('PAYMENT_MISMATCH',409)
  // Recover a lost invoice response, but never mark PAID without a verified HTTP notification.
  await c.env.DB.batch([
    statement(c,"UPDATE payments SET provider_reference=?,status='PENDING',updated_at=? WHERE id=? AND status IN ('UNKNOWN','CREATING')",status.reference,now(),String(p!.id)),
    statement(c,'INSERT INTO commerce_events VALUES (?,?,?,?,?,?,?)',id(),store(c).organization_id,store(c).id,String(order!.id),'RECONCILIATION',status.status,now())
  ])
  return c.json({providerStatus:status.status,authoritativeMutation:'No PAID mutation; verified callback required'})
})
commerce.post('/api/commerce/stores/:slug/admin/orders/:orderId/cancel',async c=>{
  await admin(c); const order=await first(c,'SELECT o.id,o.status,p.status AS payment_status,p.merchant_order_id,p.provider_reference,p.amount_idr FROM orders o JOIN payments p ON p.order_id=o.id WHERE o.id=? AND o.storefront_id=?',c.req.param('orderId'),store(c).id)
  if(!order) fail('NOT_FOUND',404)
  if(order!.status!=='PENDING_PAYMENT' || !['CREATED','FAILED'].includes(String(order!.payment_status))) fail('RECONCILIATION_REQUIRED',409)
  if(order!.payment_status==='FAILED') {
    const status=await provider(c).inquiry(String(order!.merchant_order_id))
    if(status.status!=='FAILED' || status.reference!==order!.provider_reference || status.amount!==Number(order!.amount_idr)) fail('RECONCILIATION_REQUIRED',409)
  }
  const result=await statement(c,"UPDATE orders SET status='CANCELLED',updated_at=? WHERE id=? AND storefront_id=? AND status='PENDING_PAYMENT' AND EXISTS(SELECT 1 FROM payments WHERE order_id=orders.id AND status=?)",now(),String(order!.id),store(c).id,String(order!.payment_status)).run()
  if(!result.meta.changes) fail('TRANSITION_CONFLICT',409)
  return c.json({status:'CANCELLED',stockReleased:true})
})
commerce.post('/api/commerce/stores/:slug/admin/orders/:orderId/fulfillment',async c=>{
  await admin(c); const order=await first(c,'SELECT id,status FROM orders WHERE id=? AND storefront_id=?',c.req.param('orderId'),store(c).id)
  if(!order) fail('NOT_FOUND',404)
  if(await first(c,'SELECT variant_id FROM order_delivery_assets WHERE order_id=? LIMIT 1',String(order!.id))) fail('USE_SECURE_DOWNLOAD_FLOW',409)
  const b=await body(c,['status','deliveryReference']),target=text(b.status,'STATUS',20)
  const next:Record<string,string>={PAID:'PROCESSING',PROCESSING:'FULFILLED',FULFILLED:'COMPLETED'}
  if(next[String(order!.status)]!==target) fail('INVALID_TRANSITION',409)
  const reference=b.deliveryReference===undefined?null:text(b.deliveryReference,'DELIVERY_REFERENCE',200)
  if(target==='FULFILLED' && !reference) fail('DELIVERY_REFERENCE_REQUIRED')
  const date=now()
  const result=await c.env.DB.batch([
    statement(c,"UPDATE orders SET status=?,updated_at=? WHERE id=? AND storefront_id=? AND status=?",target,date,String(order!.id),store(c).id,String(order!.status)),
    statement(c,"INSERT INTO fulfillments SELECT id,?, ?,? FROM orders WHERE id=? AND status=? ON CONFLICT(order_id) DO UPDATE SET status=excluded.status,delivery_reference=COALESCE(excluded.delivery_reference,fulfillments.delivery_reference),updated_at=excluded.updated_at",target,reference,date,String(order!.id),target)
  ])
  if(!result[0].meta.changes) fail('TRANSITION_CONFLICT',409)
  return c.json({status:target})
})

commerce.put('/api/commerce/stores/:slug/admin/variants/:variantId/digital-delivery',async c=>{
  await admin(c)
  const variantId=c.req.param('variantId'),s=store(c)
  if(!await first(c,'SELECT v.id FROM product_variants v JOIN offers o ON o.variant_id=v.id WHERE v.id=? AND o.storefront_id=? AND o.organization_id=?',variantId,s.id,s.organization_id)) fail('NOT_FOUND',404)
  if(await first(c,'SELECT order_id FROM order_delivery_assets WHERE variant_id=? LIMIT 1',variantId)) fail('DELIVERY_VERSION_IN_USE',409)
  const b=await body(c,['version','objectKey','sha256','bytes','filename'])
  const version=text(b.version,'VERSION',50),key=text(b.objectKey,'OBJECT_KEY',200),sha=text(b.sha256,'SHA256',64),bytes=integer(b.bytes,'BYTES',1,5000000),filename=text(b.filename,'FILENAME',120)
  if(!/^[A-Z0-9-]+$/.test(version) || !/^brs\/[A-Za-z0-9._-]+\.zip$/.test(key) || !/^[a-f0-9]{64}$/.test(sha) || !/^[A-Za-z0-9._-]+\.zip$/.test(filename)) fail('INVALID_ASSET')
  const buffer=await verifiedAsset(c.env,key,sha,bytes);if(!buffer) fail('ASSET_CHECK_FAILED',409)
  if(!c.env.TERMS_VERSION || !c.env.REFUND_POLICY_VERSION || !c.env.PRIVACY_POLICY_VERSION || c.env.SUPPORT_CHANNEL!=='/support/commerce') fail('POLICIES_NOT_CONFIGURED',503)
  await c.env.PRODUCT_BUCKET!.put(key,buffer,{customMetadata:{sha256:sha},httpMetadata:{contentType:'application/zip'}})
  await c.env.DB.batch([
    statement(c,'INSERT INTO product_delivery_assets VALUES (?,?,?,?,?,?,?,?,?,?,?) ON CONFLICT(variant_id) DO UPDATE SET version=excluded.version,object_key=excluded.object_key,sha256=excluded.sha256,bytes=excluded.bytes,filename=excluded.filename,support_path=excluded.support_path,terms_version=excluded.terms_version,refund_version=excluded.refund_version,privacy_version=excluded.privacy_version',variantId,version,key,sha,bytes,filename,c.env.SUPPORT_CHANNEL!,c.env.TERMS_VERSION!,c.env.REFUND_POLICY_VERSION!,c.env.PRIVACY_POLICY_VERSION!,now()),
    statement(c,'INSERT INTO commerce_events VALUES (?,?,?,?,?,?,?)',id(),s.organization_id,s.id,null,'DIGITAL_ASSET_REGISTERED',version,now())
  ])
  return c.json({version,verifiedBytes:bytes,sha256:sha,status:'VERIFIED'})
})
commerce.get('/api/commerce/stores/:slug/orders/:orderId/download/:variantId',async c=>{
  const order=await owned(c,'orders',c.req.param('orderId')),orderId=String(order.id),s=store(c)
  const payment=await first(c,'SELECT status FROM payments WHERE order_id=?',orderId)
  if(!['PAID','PROCESSING','FULFILLED','COMPLETED'].includes(String(order.status)) || payment?.status!=='PAID') fail('VERIFIED_PAYMENT_REQUIRED',409)
  const a=await statement(c,'SELECT * FROM order_delivery_assets WHERE order_id=? AND variant_id=?',orderId,c.req.param('variantId')).first<DeliveryAsset>();if(!a) fail('NOT_FOUND',404)
  const buffer=await verifiedAsset(c.env,a!.object_key,a!.sha256,a!.bytes);if(!buffer) fail('DELIVERY_UNAVAILABLE',503)
  const date=now()
  await c.env.DB.batch([
    statement(c,"UPDATE orders SET status='PROCESSING',updated_at=? WHERE id=? AND status='PAID'",date,orderId),
    statement(c,"UPDATE orders SET status='FULFILLED',updated_at=? WHERE id=? AND status='PROCESSING'",date,orderId),
    statement(c,"INSERT INTO fulfillments VALUES (?,'FULFILLED',?,?) ON CONFLICT(order_id) DO NOTHING",orderId,a!.version,date),
    statement(c,'INSERT INTO download_receipts VALUES (?,?,?,NULL) ON CONFLICT(order_id,variant_id) DO NOTHING',orderId,a!.variant_id,date),
    statement(c,'INSERT INTO commerce_events VALUES (?,?,?,?,?,?,?)',id(),s.organization_id,s.id,orderId,'SECURE_DOWNLOAD_PREPARED',a!.version,date)
  ])
  c.header('Content-Type','application/zip');c.header('Content-Disposition',`attachment; filename="${a!.filename}"`);c.header('X-Product-SHA256',a!.sha256)
  return c.body(buffer!)
})
commerce.post('/api/commerce/stores/:slug/orders/:orderId/delivery-confirmation',async c=>{
  const order=await owned(c,'orders',c.req.param('orderId')),orderId=String(order.id)
  const b=await body(c,['variantId','sha256']),variant=text(b.variantId,'VARIANT',100),sha=text(b.sha256,'SHA256',64)
  if(!['FULFILLED','COMPLETED'].includes(String(order.status))) fail('INVALID_TRANSITION',409)
  const payment=await first(c,'SELECT status FROM payments WHERE order_id=?',orderId);if(payment?.status!=='PAID') fail('VERIFIED_PAYMENT_REQUIRED',409)
  const asset=await first(c,'SELECT a.version FROM order_delivery_assets a JOIN download_receipts r ON r.order_id=a.order_id AND r.variant_id=a.variant_id WHERE a.order_id=? AND a.variant_id=? AND a.sha256=?',orderId,variant,sha)
  if(!asset) fail('DELIVERY_NOT_OFFERED_OR_HASH_MISMATCH',409)
  const date=now()
  await c.env.DB.batch([
    statement(c,'UPDATE download_receipts SET confirmed_at=COALESCE(confirmed_at,?) WHERE order_id=? AND variant_id=?',date,orderId,variant),
    statement(c,"UPDATE orders SET status='COMPLETED',updated_at=? WHERE id=? AND status='FULFILLED' AND NOT EXISTS(SELECT 1 FROM order_delivery_assets a LEFT JOIN download_receipts r ON r.order_id=a.order_id AND r.variant_id=a.variant_id WHERE a.order_id=orders.id AND r.confirmed_at IS NULL)",date,orderId),
    statement(c,"UPDATE fulfillments SET status='COMPLETED',updated_at=? WHERE order_id=? AND EXISTS(SELECT 1 FROM orders WHERE id=? AND status='COMPLETED')",date,orderId,orderId)
  ])
  return c.json({status:'VERIFIED',receipt:'Customer acknowledged downloaded bytes and package hash'})
})
commerce.get('/api/commerce/stores/:slug/orders/:orderId/support',async c=>{
  await owned(c,'orders',c.req.param('orderId'))
  return c.json({requests:(await statement(c,'SELECT id,category,message,operator_reply,status,created_at FROM support_requests WHERE order_id=? AND storefront_id=? ORDER BY created_at DESC',c.req.param('orderId'),store(c).id).all()).results})
})
commerce.post('/api/commerce/stores/:slug/orders/:orderId/support',async c=>{
  const order=await owned(c,'orders',c.req.param('orderId'));await rate(c,'support')
  const b=await body(c,['category','message']),category=text(b.category,'CATEGORY',20),message=text(b.message,'MESSAGE',2000)
  if(!['download','billing','refund','other'].includes(category)) fail('INVALID_CATEGORY')
  const requestId=id(),date=now()
  await statement(c,"INSERT INTO support_requests VALUES (?,?,?,?,?,NULL,'OPEN',?,?)",requestId,String(order.id),store(c).id,category,message,date,date).run()
  return c.json({requestId,status:'IMPLEMENTED'},201)
})
commerce.get('/api/commerce/stores/:slug/admin/support',async c=>{
  await admin(c)
  return c.json({requests:(await statement(c,'SELECT id,order_id,category,message,status,created_at FROM support_requests WHERE storefront_id=? ORDER BY created_at DESC LIMIT 100',store(c).id).all()).results})
})
commerce.patch('/api/commerce/stores/:slug/admin/support/:requestId',async c=>{
  await admin(c);const b=await body(c,['reply']),reply=text(b.reply,'REPLY',2000)
  const result=await statement(c,"UPDATE support_requests SET operator_reply=?,status='REPLIED',updated_at=? WHERE id=? AND storefront_id=?",reply,now(),c.req.param('requestId'),store(c).id).run()
  if(!result.meta.changes) fail('NOT_FOUND',404)
  return c.json({status:'IMPLEMENTED'})
})
const operator = '<p>HOLBERY Direct dioperasikan oleh <strong>PT Waskita Cakrawarti Digital — Perseroan Perorangan</strong>.</p>'
const supportContact = '<p>Hubungi <a href="https://wa.me/6285643383832" rel="noopener noreferrer">WhatsApp 0856 4338 3832</a> untuk bantuan dan pemulihan akses. Email yang disiapkan: hello@helloberry.biz.id dan support@helloberry.biz.id. <strong>Email routing belum diaktifkan; jangan mengandalkan email tersebut sampai status ini diperbarui.</strong></p>'
const legalLinks = '<nav aria-label="Kebijakan commerce"><a href="/terms/commerce">Ketentuan</a> · <a href="/refund/commerce">Refund</a> · <a href="/privacy">Privasi</a> · <a href="/delivery/commerce">Pengiriman digital</a> · <a href="/license/commerce">Lisensi</a> · <a href="/support/commerce">Bantuan</a></nav>'
commerce.get('/legal',c=>c.html(page('Legal dan kontak HOLBERY',operator+'<p>Kebijakan berikut berlaku untuk produk digital HOLBERY Direct. Berlaku 6 Oktober 2026. Informasi ini menjelaskan praktik layanan, bukan nasihat hukum atau klaim sertifikasi/regulasi.</p>'+legalLinks+supportContact)))
commerce.get('/support/commerce',c=>c.html(page('Bantuan pesanan HOLBERY',operator+supportContact+'<h2>Kebijakan dukungan</h2><p>Dukungan mencakup akses paket, file rusak, pembayaran dan permintaan refund; bukan konsultasi bisnis atau implementasi personal. Tiket order di bawah tersimpan privat dan ditinjau operator. Tidak ada layanan 24 jam atau waktu respons yang dijamin. Jangan mengirim password, token akses, data kartu, OTP, atau data pelanggan barbershop.</p><p>Gunakan browser checkout untuk tiket privat. Jika sesi hilang, hubungi WhatsApp dengan nomor order dan email pemesanan seperlunya. Operator harus mencocokkan bukti pesanan/pembayaran sebelum memulihkan akses; nomor order saja bukan otorisasi. Tidak ada email otomatis atau portal akun pemulihan mandiri.</p><form id="support-form"><label>Kategori<select name="category"><option value="download">Download</option><option value="billing">Pembayaran</option><option value="refund">Permintaan review/refund</option><option value="other">Lainnya</option></select></label><label>Pesan<input name="message" maxlength="2000" required></label><button class="button">Kirim tiket privat</button></form><section id="support-history"></section>'+legalLinks)))
commerce.get('/terms/commerce',c=>c.html(page('Ketentuan Commerce',operator+'<p>Versi BRS-TERMS-2026-1 · berlaku 6 Oktober 2026.</p><h2>Produk dan harga</h2><p>Barber Revenue Starter System COMPLETE, BRS-2026-V1, adalah paket unduhan dengan workbook Excel terintegrasi, PDF panduan/SOP, template pesan yang dapat diedit, dashboard dan rencana 30 hari. Harga satu lisensi Rp99.000; harga, jumlah dan total final ditampilkan server sebelum order. Bukan langganan, SaaS, POS, booking, payroll atau konsultasi personal. Tidak ada jaminan peningkatan pendapatan atau hasil bisnis.</p><h2>Pemesanan dan pembayaran</h2><p>Masukkan nama/email yang benar dan setujui kebijakan sebelum membuat order. Server memvalidasi harga, stok dan total serta menyimpan snapshot pesanan. Pembayaran diproses oleh Duitku PRODUCTION melalui Duitku Pop JS; metode dan biaya provider, bila ada, ditampilkan sebelum Anda membayar. Pesan sukses di browser bukan bukti pembayaran. Hanya notifikasi server yang terautentikasi dan hasil inquiry provider yang cocok dapat mengonfirmasi PAID. Hindari pembayaran ulang ketika status belum jelas; hubungi dukungan.</p><h2>Pengiriman dan lisensi</h2><p>Setelah pembayaran terverifikasi, paket tersedia lewat download privat di halaman order dalam sesi checkout yang sama. Simpan file dan nomor order. Tidak ada email delivery otomatis. Satu lisensi untuk satu barbershop; boleh diedit dan dicetak untuk penggunaan internal, tidak boleh dijual ulang atau dibagikan sebagai kit. Hak wajib konsumen menurut hukum yang berlaku tetap berlaku.</p><h2>Bantuan dan perubahan</h2><p>Refund, data dan pengiriman diatur pada halaman terkait. Versi produk/kebijakan dipin pada order; perubahan berikutnya tidak mengubah snapshot order terdahulu. Layanan dapat menolak input tidak valid atau transaksi yang belum dapat diverifikasi.</p>'+legalLinks+supportContact)))
commerce.get('/refund/commerce',c=>c.html(page('Kebijakan Refund',operator+'<p>Versi BRS-REFUND-2026-1 · berlaku 6 Oktober 2026.</p><h2>Permintaan yang ditinjau</h2><p>Ajukan peninjauan untuk tagihan ganda, pembayaran terkonfirmasi tetapi paket tidak tersedia, file rusak, atau produk yang secara material berbeda dari deskripsi. Hubungi tiket privat order atau WhatsApp dengan nomor order, tanggal dan penjelasan masalah. Kirim bukti pembayaran hanya bila diminta melalui kanal privat; jangan kirim data kartu, OTP atau password.</p><h2>Penyelesaian</h2><p>Operator mencocokkan catatan server/provider, menawarkan pemulihan akses atau file yang benar, dan mempertimbangkan pengembalian bila produk tidak dapat dikirim atau masalah tidak terselesaikan. Produk digital yang sesuai dan dapat diakses tidak otomatis dapat dikembalikan karena berubah pikiran. Ketentuan ini tidak menghapus hak yang diwajibkan hukum.</p><p>Refund tidak otomatis. Keputusan, jumlah dan proses pengembalian diberitahukan secara privat dan dicatat operator dengan bukti. Waktu dana masuk bergantung pada provider/metode pembayaran; tidak ada janji refund instan atau tenggat provider yang belum terkonfirmasi. Jangan membayar ulang untuk menyelesaikan masalah akses.</p>'+supportContact+legalLinks)))
commerce.get('/delivery/commerce',c=>c.html(page('Pengiriman Produk Digital',operator+'<p>Produk BRS-2026-V1 dikirim sebagai ZIP berisi workbook .xlsx, PDF dan teks editable. Gunakan Excel atau aplikasi kompatibel; ekstrak ZIP terlebih dahulu. Paket tidak memerlukan integrasi bank atau data pelanggan contoh.</p><ol><li>Buat order dengan data Anda yang benar dan lakukan pembayaran melalui Duitku Pop JS.</li><li>Tunggu verifikasi notifikasi server dan inquiry provider. Redirect/screenshot bukan otorisasi.</li><li>Kembali ke halaman order di browser/sesi checkout yang sama. Download hanya tersedia untuk order berbayar yang terotorisasi.</li><li>Server dan browser memeriksa SHA256 paket terhadap snapshot order. Bila tidak cocok, pengiriman gagal aman.</li><li>Simpan dan buka file, lalu konfirmasi penerimaan bila paket dapat digunakan. Konfirmasi penerimaan tidak mengubah status pembayaran.</li></ol><p>Aset R2 tidak publik. Tidak ada pengiriman email otomatis. Koneksi lambat, sesi hilang atau gangguan provider dapat memerlukan bantuan operator. Simpan salinan lokal; jangan membagikan akses privat atau paket kepada pihak lain.</p>'+supportContact+legalLinks)))
commerce.get('/license/commerce',c=>c.html(page('Lisensi Produk Digital',operator+'<p>Lisensi BRS-2026-V1 COMPLETE berlaku untuk penggunaan internal satu barbershop. Pemegang lisensi boleh mengedit workbook dan template, mencetak SOP, serta membagikannya kepada tim internal untuk operasional barbershop tersebut.</p><p>Tidak diperbolehkan menjual ulang, memublikasikan paket, memberikan akses unduhan kepada pihak luar, atau menjadikannya kit distribusi ulang. Hak cipta komponen tetap pada pemegang haknya; lisensi tidak memindahkan kepemilikan kekayaan intelektual. Tidak ada klaim pendaftaran merek atau sertifikasi. Untuk penggunaan di lokasi tambahan atau izin lain, hubungi operator sebelum penggunaan.</p>'+legalLinks+supportContact)))

function page(title:string,content:string) { return `<!doctype html><html lang="id"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)} — HOLBERY</title><link rel="stylesheet" href="/static/style.css"><script src="/static/commerce.js" defer></script></head><body><header class="site-header"><a class="brand" href="/">HOLBERY</a><a href="/store/direct">Direct store</a></header><main class="prose"><h1>${esc(title)}</h1>${content}<p id="commerce-message" role="status" aria-live="polite"></p></main></body></html>` }
commerce.get('/store/:slug',async c=>{
  if(!c.env.DB) fail('DATABASE_NOT_CONFIGURED',503)
  const s=await statement(c,"SELECT * FROM storefronts WHERE slug=? AND status='active'",c.req.param('slug')).first<Store>();if(!s) fail('NOT_FOUND',404)
  const products=(await statement(c,catalogSQL, s!.id).all()).results
  return c.html(page(s!.name,products.length?products.map(p=>`<article><h2><a href="/store/${esc(s!.slug)}/products/${esc(p.slug)}">${esc(p.name)}</a></h2><p>Rp ${esc(p.price_idr)} / Stock ${esc(p.stock)}</p></article>`).join(''):'<p>Belum ada produk yang disetujui untuk dijual. Tidak ada transaksi produksi yang diklaim.</p>'))
})
commerce.get('/store/:slug/products/:product',async c=>{
  if(!c.env.DB) fail('DATABASE_NOT_CONFIGURED',503)
  const s=await statement(c,"SELECT * FROM storefronts WHERE slug=? AND status='active'",c.req.param('slug')).first<Store>();if(!s) fail('NOT_FOUND',404)
  const products=(await statement(c,catalogSQL+' AND p.slug=?',s!.id,c.req.param('product')).all()).results;if(!products.length) fail('NOT_FOUND',404)
  const p=products[0],blocked=configBlockers(c.env).length || (await digitalReadiness(c.env,s!.id)).length
  return c.html(page(String(p.name),`<p>${esc(p.description)}</p><p>Produk digital; satu lisensi untuk satu barbershop. Harga peluncuran adalah hipotesis, bukan bukti hasil bisnis. Setelah pembayaran server terverifikasi, paket tersedia lewat download privat di halaman order.</p><p><a href="/support/commerce">Bantuan pesanan</a> · <a href="/terms/commerce">Ketentuan produk</a> · <a href="/refund/commerce">Review / refund</a> · <a href="/privacy">Privasi</a> · <a href="/delivery/commerce">Pengiriman digital</a> · <a href="/license/commerce">Lisensi</a></p>${blocked?'<p role="status">BLOCKED — HUMAN CONFIGURATION REQUIRED. Konfigurasi atau aset pengiriman belum siap. Pembayaran ditutup sampai pemeriksaan server terpenuhi.</p>':''}<form id="purchase-form" data-store="${esc(s!.slug)}"><label>Variant<select name="offerId">${products.map(p=>`<option value="${esc(p.offer_id)}" data-price="${esc(p.price_idr)}">${esc(p.variant_name)} — Rp ${esc(p.price_idr)}</option>`).join('')}</select></label><label>Jumlah lisensi<input name="quantity" type="number" min="1" max="99" value="1" required></label><button class="button" ${blocked?'disabled':''}>Tambah ke cart / checkout</button></form>`))
})
commerce.get('/checkout/:orderId',c=>{
  const host=c.env.DUITKU_ENV==='production'?'https://app-prod.duitku.com':'https://app-sandbox.duitku.com'
  c.header('Content-Security-Policy',`default-src 'self'; script-src 'self' ${host}; style-src 'self' 'unsafe-inline'; img-src 'self' data: ${host}; connect-src 'self' ${host}; frame-src ${host}; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'self'`)
  return c.html(page('Checkout','<p>Detail order memerlukan akses privat dari sesi checkout Anda. Callback browser tidak mengonfirmasi pembayaran. Tinjau total dari server sebelum membayar. <a href="/legal">Kebijakan dan kontak operator</a>.</p><section id="order-view" data-order="'+esc(c.req.param('orderId'))+'" data-pop-host="'+host+'"></section><script src="'+host+'/lib/js/duitku.js" defer></script><button id="pay-order" class="button">Bayar dengan Duitku Pop</button>'))
})
commerce.get('/orders/:orderId',c=>c.html(page('Order status','<p>Status below comes from the server, not the payment redirect.</p><section id="order-view" data-order="'+esc(c.req.param('orderId'))+'"></section>')))
commerce.notFound(c=>c.json({error:{code:'NOT_FOUND',requestId:c.get('requestId')}},404))
