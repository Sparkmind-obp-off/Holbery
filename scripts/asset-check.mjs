import { writeFileSync } from 'node:fs';
const domain=process.argv[2];
if(!['holbery.id','holbery.biz.id'].includes(domain))throw new Error('Explicit supported domain required; do not overwrite historical wrong-domain evidence');
const evidence={date:new Date().toISOString().slice(0,10),domain,scope:'Read-only public technical checks; not registrant or trademark proof'};
for(const [key,url] of [['rdap','https://rdap.org/domain/'+domain],['dns','https://cloudflare-dns.com/dns-query?name='+domain+'&type=A']]) {
 try {
  const res=await fetch(url,{headers:{Accept:key==='dns'?'application/dns-json':'application/rdap+json'},signal:AbortSignal.timeout(15000)});
  const data=await res.json();
  evidence[key]=key==='dns'?{http:res.status,status:data.Status,answers:(data.Answer||[]).map(x=>({type:x.type,data:x.data}))}:{http:res.status,registeredObjectReturned:res.ok&&data.objectClassName==='domain',statuses:data.status||[],scope:'No registrant PII retained'};
 } catch { evidence[key]={status:'BLOCKED',reason:'Network/format error; no conclusion'}; }
}
writeFileSync('evidence/domain-check-'+domain.replaceAll('.','-')+'.json',JSON.stringify(evidence,null,2)+'\n'); console.log(JSON.stringify(evidence,null,2));
