export const metadataFields=['project_name','category','owner','status','parent','repository','domain','customer_type','revenue_model'];
const categories=['SYSTEMS','PRODUCTS','VENTURES','COMMERCE'];
const lifecycles=['IDEA','EXPERIMENT','VALIDATED','PRODUCT','VENTURE','SCALE','RETIRE','EXIT'];
export function validateRegistry(records) {
 if(!Array.isArray(records)) throw new Error('Registry must be an array');
 const ids=new Set();
 for(const record of records) {
  if(!record.id||ids.has(record.id)) throw new Error('Missing or duplicate project ID'); ids.add(record.id);
  for(const field of metadataFields) {
   if(record.id==='HOLBERY' && field==='parent' && record.parent===null) continue;
   if(typeof record[field]!=='string' || !record[field].trim()) throw new Error(`Missing metadata ${field}`);
  }
  if(record.id==='HOLBERY') {
   if(record.category!=='MASTER_PARENT'||record.parent!==null) throw new Error('Invalid master parent');
  } else {
   if(!categories.includes(record.category)) throw new Error('Invalid category');
   if(record.parent!=='HOLBERY') throw new Error('Invalid parent');
   if(!lifecycles.includes(record.lifecycle)) throw new Error('Invalid lifecycle');
   if(record.visibility!=='public') throw new Error('Private project must stay outside public registry');
   if(['VALIDATED','PRODUCT','VENTURE','SCALE'].includes(record.lifecycle) && (!record.validation_evidence?.length || /UNASSIGNED|UNVERIFIED/.test(record.owner))) throw new Error('Graduation needs assigned owner and real validation evidence');
  }
 }
 return true;
}
export function draftProject(fields) {
 const record={...fields,parent:'HOLBERY',status:'IDEA',lifecycle:'IDEA',visibility:'public',legal_owner:'UNVERIFIED',evidence:[]};
 validateRegistry([record]);return record;
}
