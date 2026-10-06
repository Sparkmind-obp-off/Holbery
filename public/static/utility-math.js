import { calculateDailyClose } from './calculations.js';
export { calculateDailyClose };
const MAX=1_000_000_000_000;
function whole(value,label,min=0,max=MAX) {
 if(value===null||value===undefined||typeof value==='boolean'||String(value).trim()==='') throw new Error(`${label} wajib diisi.`);
 if(!['number','string'].includes(typeof value)) throw new Error(`${label} harus berupa angka.`);
 const n=Number(value);
 if(!Number.isSafeInteger(n)||n<min||n>max) throw new Error(`${label} harus bilangan bulat ${min}–${max}.`);
 return n;
}
function safe(result) {
 for(const n of Object.values(result)) if(typeof n==='number'&&(!Number.isFinite(n)||Math.abs(n)>Number.MAX_SAFE_INTEGER)) throw new Error('Hasil terlalu besar untuk rentang kalkulator ini.');
 return result;
}
export function calculateTargetRevenue(fields) {
 const target=whole(fields?.target,'Target omzet'); const price=whole(fields?.price,'Harga rata-rata',1);
 const days=whole(fields?.days,'Hari buka',1,31);
 const requiredServices=Math.ceil(target/price); const servicesPerDay=Math.ceil(target/price/days);
 return safe({dailyTarget:target/days,requiredServices,servicesPerDay,projectedRevenue:servicesPerDay*days*price,days,balanced:target===0});
}
export function calculateBreakEven(fields) {
 const fixed=whole(fields?.fixed,'Biaya tetap'); const price=whole(fields?.price,'Harga jasa',1);
 const variable=whole(fields?.variable,'Biaya variabel'); const days=whole(fields?.days,'Hari buka',1,31);
 const contribution=price-variable;
 if(contribution<=0) return {feasible:false,contribution,reason:'Harga jasa harus melebihi biaya variabel agar setiap layanan membantu menutup biaya tetap.'};
 const requiredServices=Math.ceil(fixed/contribution); const servicesPerDay=Math.ceil(requiredServices/days);
 return safe({feasible:true,contribution,requiredServices,servicesPerDay,requiredRevenue:requiredServices*price,days});
}
