import { writeFileSync } from 'node:fs';
const token = process.env.CLOUDFLARE_API_TOKEN;
if (!token) throw new Error('Cloudflare token unavailable: use Deploy panel, never commit it');
async function api(path) {
  const res = await fetch(`https://api.cloudflare.com/client/v4/${path}`, {headers:{Authorization:`Bearer ${token}`}});
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(`Cloudflare read failed ${res.status}: ${path.split('?')[0]}`);
  return data.result;
}
const accounts = await api('accounts');
if (accounts.length !== 1) throw new Error('Account selection requires user input');
const projects = await api(`accounts/${accounts[0].id}/pages/projects`);
const zones = await api('zones?name=holberry.biz');
const domains = zones.map(z => ({name:z.name,status:z.status}));
const evidence = {date:'2026-10-05',accountCount:accounts.length,pagesProjectCount:projects.length,candidateProjectAvailable:!projects.some(p=>p.name==='webapp'),primaryDomainZones:domains,scope:'Read-only; no DNS modifications. Zone access proves account access, not legal registrant ownership.'};
writeFileSync('evidence/cloudflare-discovery.json',JSON.stringify(evidence,null,2)+'\n');
console.log(JSON.stringify(evidence,null,2));
