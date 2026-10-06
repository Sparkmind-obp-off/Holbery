import {TOOL_PATHS,PRODUCT_ID,validateFieldEvent} from './event-contract.js';
const KEY='holbery.utility.session.v1';const TTL=30*60*1000;let state=null;let observer;
const fieldsSeen=new Set();const uniqueSeen=new Set();
const privacySignal=()=>navigator.doNotTrack==='1'||navigator.globalPrivacyControl===true;
function load(){try{const data=JSON.parse(sessionStorage.getItem(KEY)||'null');if(data?.consent===true&&Date.now()-data.started<TTL&&typeof data.id==='string')return data;sessionStorage.removeItem(KEY)}catch{}return null}
state=privacySignal()?null:load();
const tool=Object.keys(TOOL_PATHS).find(key=>TOOL_PATHS[key]===location.pathname);
function validSession(){if(!state||privacySignal()||Date.now()-state.started>=TTL){state=null;try{sessionStorage.removeItem(KEY)}catch{}return false}return true}
function persist(){try{sessionStorage.setItem(KEY,JSON.stringify(state))}catch{}}
function source(){const s=new URLSearchParams(location.search).get('utm_source');return ['instagram','tiktok','threads','organic','internal'].includes(s)?s:'direct'}
function referrerClass(){try{if(!document.referrer)return'direct';const h=new URL(document.referrer).hostname;if(h===location.hostname)return'internal';if(/(^|\.)(google\.[a-z.]+|bing\.com|duckduckgo\.com)$/.test(h))return'search';if(/(^|\.)(instagram\.com|tiktok\.com|threads\.net)$/.test(h))return'social'}catch{}return'other'}
export function emitFieldEvent(name,toolId=tool,extra={}){
 if(!validSession())return false;
 if(name==='field_interacted'){const k=toolId+':'+extra.field_id;if(fieldsSeen.has(k))return false;fieldsSeen.add(k)}
 const once=['surface_viewed','tool_opened','tool_started','product_cta_viewed','repeat_use_observed'];
 if(once.includes(name)){const k=name+':'+(toolId||'');if(uniqueSeen.has(k))return false;uniqueSeen.add(k)}
 const event={event_id:crypto.randomUUID(),event_name:name,occurred_at:new Date().toISOString(),surface:location.pathname,session_id:state.id,source:source(),schema_version:1,consent:true,traffic_class:state.trafficClass==='test'?'test':'production',referrer_class:referrerClass(),...extra};
 if(toolId)event.tool_id=toolId;
 if(name.startsWith('product_cta_'))event.product_id=PRODUCT_ID;
 const campaign=new URLSearchParams(location.search).get('utm_campaign');if(['organic_daily_close_01','organic_target_01','organic_break_even_01'].includes(campaign))event.campaign_id=campaign;
 try{validateFieldEvent(event)}catch{return false}
 // Envelope only: no input values, calculation results, private commerce capabilities, raw URLs or PII.
 fetch('/api/field-events',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(event),credentials:'omit',keepalive:true}).catch(()=>{});
 return true;
}
function updatePreference(){const el=document.querySelector('[data-measurement-status]');if(el)el.textContent=privacySignal()?'Sinyal DNT/GPC aktif; pengukuran dimatikan.':validSession()?'Pengukuran aktif di sesi tab ini; Anda dapat mematikannya kapan saja.':'Pengukuran mati. Semua tool tetap berfungsi.'}
function openSurface(){emitFieldEvent('surface_viewed');if(tool){emitFieldEvent('tool_opened',tool);if(validSession()){if(state.tools?.includes(tool))emitFieldEvent('repeat_use_observed',tool);state.tools=[...new Set([...(state.tools||[]),tool])];persist()}}}
function observeCta(){observer?.disconnect();const cta=document.querySelector('[data-product-cta]');if(cta&&tool){observer=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)&&emitFieldEvent('product_cta_viewed',tool))observer.disconnect()},{threshold:0.5});observer.observe(cta)}}
for(const button of document.querySelectorAll('[data-measurement]'))button.addEventListener('click',()=>{
 if(button.dataset.measurement==='enable'&&!privacySignal()){
  state={id:crypto.randomUUID(),started:Date.now(),consent:true,tools:[],trafficClass:new URLSearchParams(location.search).get('measurement_test')==='1'?'test':'production'};fieldsSeen.clear();uniqueSeen.clear();persist();openSurface();observeCta();document.dispatchEvent(new Event('holbery:measurement-enabled'));
 }else{state=null;observer?.disconnect();try{sessionStorage.removeItem(KEY)}catch{}}
 updatePreference();
});
document.addEventListener('click',event=>{
 const next=event.target.closest('[data-next-tool]');if(next&&tool)emitFieldEvent('tool_to_tool',tool,{next_tool_id:next.dataset.nextTool});
 const template=event.target.closest('[data-template]');if(template)emitFieldEvent('template_download',tool,{template_id:template.dataset.template});
 if(event.target.closest('[data-product-cta]')&&tool)emitFieldEvent('product_cta_clicked',tool);
});
updatePreference();openSurface();observeCta();
