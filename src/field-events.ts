import { Hono } from 'hono'
import { bodyLimit } from 'hono/body-limit'
import { validateFieldEvent } from '../public/static/event-contract.js'
import { digest, equal } from './payments'
import type { Bindings } from './commerce'

export const fieldEvents = new Hono<{Bindings: Bindings}>()
fieldEvents.use('/api/field-events',bodyLimit({maxSize:4096,onError:c=>c.json({error:'BODY_TOO_LARGE'},413)}))
fieldEvents.post('/api/field-events',async c=>{
 c.header('Cache-Control','no-store')
 if(c.req.header('DNT')==='1'||c.req.header('Sec-GPC')==='1')return c.body(null,204)
 const requestOrigin=new URL(c.req.url).origin
 const sender=c.req.header('Origin')
 if(!sender||![requestOrigin,c.env.PUBLIC_ORIGIN].includes(sender))return c.json({error:'SAME_ORIGIN_REQUIRED'},403)
 if(c.req.header('Sec-Fetch-Site')==='cross-site')return c.json({error:'CROSS_SITE_REJECTED'},403)
 if(!c.req.header('Content-Type')?.startsWith('application/json'))return c.json({error:'JSON_REQUIRED'},415)
 let input:unknown;try{input=await c.req.json()}catch{return c.json({error:'INVALID_JSON'},400)}
 let b:ReturnType<typeof validateFieldEvent>;try{b=validateFieldEvent(input)}catch(error){return c.json({error:error instanceof Error?error.message:'INVALID_EVENT'},400)}
 if(!c.env.DB)return c.json({error:'MEASUREMENT_UNAVAILABLE'},503)
 try{
  const received=new Date().toISOString();const day=received.slice(0,10);const window=Math.floor(Date.now()/60000)
  // A short-lived random session hash is not joined to commerce, IP address or customer identity.
  const hash=await digest('holbery-field-v1:'+b.session_id+':'+b.traffic_class)
  const rates=await c.env.DB.batch([
   c.env.DB.prepare('DELETE FROM holbery_field_rate WHERE window<?').bind(window-2),
   c.env.DB.prepare('INSERT INTO holbery_field_rate VALUES (?,?,1) ON CONFLICT(session_hash,window) DO UPDATE SET count=count+1 RETURNING count').bind(hash,window)
  ])
  if(Number((rates[1].results[0] as {count:number} | undefined)?.count)>80){c.header('Retry-After','60');return c.json({error:'RATE_LIMITED'},429)}
  const retention=new Date(Date.now()-30*86400000).toISOString();const aggregateRetention=new Date(Date.now()-90*86400000).toISOString().slice(0,10)
  const result=await c.env.DB.batch([
   c.env.DB.prepare('INSERT OR IGNORE INTO holbery_field_events VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)').bind(b.event_id,b.event_name,b.occurred_at,received,day,b.surface,b.tool_id||'',b.product_id||'',hash,b.source,b.referrer_class||'',b.campaign_id||'',b.field_id||'',b.result_class||'',b.next_tool_id||'',b.template_id||'',1,b.traffic_class),
   c.env.DB.prepare('DELETE FROM holbery_field_events WHERE event_id IN (SELECT event_id FROM holbery_field_events WHERE received_at<? LIMIT 100)').bind(retention),
   c.env.DB.prepare('DELETE FROM holbery_field_daily WHERE event_day<?').bind(aggregateRetention)
  ])
  return c.json({accepted:true,duplicate:result[0].meta.changes===0},202)
 }catch{return c.json({error:'MEASUREMENT_UNAVAILABLE'},503)}
})
fieldEvents.get('/api/field-events/review',async c=>{
 c.header('Cache-Control','no-store')
 const token=c.req.header('Authorization')?.replace(/^Bearer /,'')||''
 if(!c.env.COMMERCE_ADMIN_TOKEN||!equal(token,c.env.COMMERCE_ADMIN_TOKEN))return c.json({error:'UNAUTHORIZED'},401)
 if(!c.env.DB)return c.json({error:'MEASUREMENT_UNAVAILABLE'},503)
 const days=Number(c.req.query('days')||7)
 if(!Number.isInteger(days)||days<1||days>30)return c.json({error:'DAYS_1_TO_30'},400)
 const start=new Date(Date.now()-(days-1)*86400000).toISOString().slice(0,10)
 try{
  const counts=await c.env.DB.prepare("SELECT event_day,event_name,tool_id,surface,source,field_id,result_class,SUM(count) count FROM holbery_field_daily WHERE traffic_class='production' AND event_day>=? GROUP BY event_day,event_name,tool_id,surface,source,field_id,result_class ORDER BY event_day,tool_id,event_name").bind(start).all()
  const sessions=await c.env.DB.prepare("SELECT tool_id,event_name,COUNT(DISTINCT session_hash) sessions FROM holbery_field_events WHERE traffic_class='production' AND event_day>=? GROUP BY tool_id,event_name").bind(start).all()
  return c.json({window_start:start,days,counts:counts.results,session_counts:sessions.results,scope:'Opt-in client-reported utility events only. Sessions are not unique people; repeat is same short-lived tab session. Not payment, revenue, customer outcomes or market proof.',commerce_truth:'Use existing scoped commerce server evidence; client field endpoint rejects transaction/payment events.'})
 }catch{return c.json({error:'MEASUREMENT_UNAVAILABLE'},503)}
})
