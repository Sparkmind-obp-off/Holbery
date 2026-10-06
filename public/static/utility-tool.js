import { calculateDailyClose, calculateTargetRevenue, calculateBreakEven } from './utility-math.js';
import { emitFieldEvent } from './utility-events.js';
const panel=document.querySelector('[data-tool]');
const tool=panel?.dataset.tool;const form=panel?.querySelector('form');
const output=document.getElementById('calculation-result');const error=document.getElementById('calculator-error');
const rupiah=new Intl.NumberFormat('id-ID',{style:'currency',currency:'IDR',maximumFractionDigits:0});
const labels={expectedRevenue:'Omzet layanan seharusnya',recordedReceipts:'Penerimaan tercatat',receiptGap:'Selisih penerimaan',expectedCash:'Kas seharusnya',cashDiscrepancy:'Selisih kas',receiptsLessCashExpenses:'Penerimaan − pengeluaran tunai (BUKAN laba)',dailyTarget:'Target omzet per hari',requiredServices:'Layanan per bulan (dibulatkan ke atas)',servicesPerDay:'Layanan per hari (dibulatkan ke atas)',projectedRevenue:'Proyeksi omzet pada target layanan harian',contribution:'Kontribusi per layanan',requiredRevenue:'Omzet dari layanan minimum untuk impas'};
const money=new Set(['expectedRevenue','recordedReceipts','receiptGap','expectedCash','cashDiscrepancy','receiptsLessCashExpenses','dailyTarget','projectedRevenue','contribution','requiredRevenue']);
const calculate={daily_close:calculateDailyClose,target_revenue:calculateTargetRevenue,break_even:calculateBreakEven};
let started=false;
document.addEventListener('holbery:measurement-enabled',()=>{started=false});
form?.addEventListener('input',event=>{
 if(!started){started=true;emitFieldEvent('tool_started',tool)}
 const field=event.target.name;
 if(field)emitFieldEvent('field_interacted',tool,{field_id:field});
});
form?.addEventListener('submit',event=>{
 event.preventDefault();output.replaceChildren();output.hidden=true;error.textContent='';
 try{
  const values=Object.fromEntries(new FormData(form).entries());const result=calculate[tool](values);
  if(!started){started=true;emitFieldEvent('tool_started',tool)}
  const dl=document.createElement('dl');
  for(const [key,label]of Object.entries(labels))if(typeof result[key]==='number'){
   const dt=document.createElement('dt');dt.textContent=label;const dd=document.createElement('dd');dd.textContent=money.has(key)?rupiah.format(result[key]):new Intl.NumberFormat('id-ID').format(result[key]);dl.append(dt,dd);
  }
  const message=document.createElement('p');
  message.textContent=result.feasible===false?result.reason:tool==='daily_close'?(result.balanced?'Cocok — penerimaan layanan dan kas sesuai input.':'Periksa — ada selisih yang perlu dijelaskan, bukan otomatis laba atau kerugian.'):'Hasil berdasarkan asumsi input. Omzet bukan laba; target bukan jaminan permintaan.';
  output.append(dl,message);output.hidden=false;output.focus();
  const resultClass=result.feasible===false?'nonviable':'calculated';
  emitFieldEvent('tool_completed',tool,{result_class:resultClass});
  emitFieldEvent('result_viewed',tool,{result_class:resultClass});
 }catch(problem){error.textContent=/required/.test(problem.message)?'Semua kolom wajib diisi. Masukkan 0 jika sesuai.':problem.message;emitFieldEvent('tool_error',tool)}
});
form?.addEventListener('reset',()=>{output.replaceChildren();output.hidden=true;error.textContent='';started=false});
document.querySelector('[data-share-tool]')?.addEventListener('click',async()=>{
 const status=document.getElementById('share-status');
 try{await navigator.clipboard.writeText(location.origin+location.pathname);status.textContent='Tautan tool disalin; input dan hasil tidak disertakan.';emitFieldEvent('tool_shared',tool)}catch{status.textContent='Salin alamat halaman dari browser Anda; jangan sertakan data bisnis.'}
});
