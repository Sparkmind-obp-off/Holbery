import { readFileSync, existsSync, writeFileSync } from 'node:fs';
const lock=JSON.parse(readFileSync('package-lock.json','utf8'));
const entries=[];
for(const [path,item] of Object.entries(lock.packages)) {
 if(!path) continue;
 const file=path+'/package.json'; const data=existsSync(file)?JSON.parse(readFileSync(file,'utf8')):item;
 entries.push({name:data.name||path.replace(/^.*node_modules\//,''),version:data.version||item.version,license:data.license||item.license||'UNVERIFIED',installed:existsSync(file),dev:Boolean(item.dev)});
}
entries.sort((a,b)=>a.name.localeCompare(b.name));
writeFileSync('evidence/dependency-licenses.json',JSON.stringify({date:'2026-10-05',source:'package-lock and installed package metadata',entries},null,2)+'\n');
const license=readFileSync('node_modules/hono/LICENSE','utf8');
writeFileSync('public/downloads/third-party-notices.txt','HOLBERY runtime third-party notice\nHono — '+lock.packages['node_modules/hono'].version+'\n\n'+license);
console.log(`VERIFIED license inventory: ${entries.length} lockfile packages; ${entries.filter(e=>e.license==='UNVERIFIED').length} need license review. Runtime Hono notice preserved.`);
