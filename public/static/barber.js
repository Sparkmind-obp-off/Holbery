import { calculateDailyClose } from './calculations.js';
const form = document.querySelector('#daily-close-form');
const output = document.querySelector('#calculation-result');
const error = document.querySelector('#calculator-error');
const keys = {services:'services',price:'price',openingCash:'opening-cash',cashReceipts:'cash-receipts',digitalReceipts:'digital-receipts',cashExpenses:'cash-expenses',actualCash:'actual-cash'};
const labels = {expectedRevenue:'Expected service revenue',recordedReceipts:'Recorded receipts',receiptGap:'Receipt gap',expectedCash:'Expected cash',cashDiscrepancy:'Cash discrepancy',receiptsLessCashExpenses:'Receipts less cash expenses — NOT profit'};
const currency = new Intl.NumberFormat('id-ID',{style:'currency',currency:'IDR',maximumFractionDigits:0});
form?.addEventListener('submit', event => {
  event.preventDefault(); error.textContent=''; output.replaceChildren(); output.hidden=true;
  try {
    const fields=Object.fromEntries(Object.entries(keys).map(([key,id])=>[key,document.getElementById(id).value]));
    const result=calculateDailyClose(fields); const list=document.createElement('dl');
    for(const [key,label] of Object.entries(labels)) {
      const term=document.createElement('dt');term.textContent=label;const value=document.createElement('dd');value.textContent=currency.format(result[key]);list.append(term,value);
    }
    const status=document.createElement('p');status.textContent=result.balanced?'Balanced — service receipts and cash match these inputs.':'Investigate — one or more differences need an explanation. Do not assume the cause.';
    output.append(list,status);output.hidden=false;output.focus();
  } catch (problem) { error.textContent=problem.message||'Check the inputs.'; }
});
form?.addEventListener('reset',()=>{output.replaceChildren();output.hidden=true;error.textContent='';});
