// Pure browser/Node-compatible engineering functions. No network or storage.
export const MAX_IDR = 1_000_000_000_000;
export function calculateDailyClose(fields) {
  const parsed = {};
  for (const key of ['services','price','openingCash','cashReceipts','digitalReceipts','cashExpenses','actualCash']) {
    const raw = fields?.[key];
    if (raw === undefined || raw === null || (typeof raw === 'string' && raw.trim() === '')) throw new Error('All fields are required; enter 0 when appropriate.');
    if (!['number','string'].includes(typeof raw)) throw new Error('Use whole, non-negative numbers.');
    const value = Number(raw);
    if (!Number.isSafeInteger(value) || value < 0 || value > (key === 'services' ? 10_000 : MAX_IDR)) throw new Error('Use whole, non-negative values within the supported range.');
    parsed[key] = value;
  }
  const {services,price,openingCash,cashReceipts,digitalReceipts,cashExpenses,actualCash} = parsed;
  const expectedRevenue = services * price;
  const recordedReceipts = cashReceipts + digitalReceipts;
  const expectedCash = openingCash + cashReceipts - cashExpenses;
  if (expectedCash < 0) throw new Error('Cash expenses cannot exceed opening cash plus cash receipts in this simplified workflow.');
  const result = {expectedRevenue,recordedReceipts,receiptGap:recordedReceipts-expectedRevenue,expectedCash,cashDiscrepancy:actualCash-expectedCash,receiptsLessCashExpenses:recordedReceipts-cashExpenses};
  for (const value of Object.values(result)) if (!Number.isSafeInteger(value) || Math.abs(value) > MAX_IDR) throw new Error('Calculated amount exceeds the supported range.');
  return {...result,balanced:result.receiptGap===0 && result.cashDiscrepancy===0};
}
