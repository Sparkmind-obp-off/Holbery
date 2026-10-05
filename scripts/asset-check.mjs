import { writeFileSync } from 'node:fs';
const evidence={date:'2026-10-05',domain:'holberry.biz',scope:'Read-only public technical checks; not registrant or trademark proof'};
for(const [key,url] of [['rdap','https://rdap.nic.biz/domain/holberry.biz'],['dns','https://cloudflare-dns.com/dns-query?name=holberry.biz&type=A']]) {
 try {
  const res=await fetch(url,{headers:{Accept:key==='dns'?'application/dns-json':'application/rdap+json'},signal:AbortSignal.timeout(15000)});
  const data=await res.json();
  evidence[key]=key==='dns'?{http:res.status,status:data.Status,answers:(data.Answer||[]).map(x=>({type:x.type,data:x.data}))}:{http:res.status,registeredObjectReturned:res.ok&&data.objectClassName==='domain',statuses:data.status||[],scope:'No registrant PII retained'};
 } catch { evidence[key]={status:'BLOCKED',reason:'Network/format error; no conclusion'}; }
}
writeFileSync('evidence/domain-check.json',JSON.stringify(evidence,null,2)+'\n'); console.log(JSON.stringify(evidence,null,2));
