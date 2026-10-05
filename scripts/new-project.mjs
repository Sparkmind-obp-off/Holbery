import { readFileSync, writeFileSync } from 'node:fs';
import { draftProject, validateRegistry } from './registry.mjs';
const args=process.argv.slice(2);const fields={};
for(let i=0;i<args.length;i++) if(args[i].startsWith('--')&&args[i]!=='--dry-run') fields[args[i].slice(2).replaceAll('-','_')]=args[++i];
for(const field of ['id','project_name','category','owner','repository','domain','customer_type','revenue_model']) if(!fields[field]) throw new Error(`Required --${field.replaceAll('_','-')}`);
const record=draftProject(fields);const records=JSON.parse(readFileSync('registries/projects.json','utf8'));validateRegistry([...records,record]);
if(args.includes('--dry-run')) console.log(JSON.stringify({dryRun:true,record},null,2));
else {writeFileSync('registries/projects.json',JSON.stringify([...records,record],null,2)+'\n');console.log('Added IDEA structural record; not validated or launched. Review and commit separately.');}
