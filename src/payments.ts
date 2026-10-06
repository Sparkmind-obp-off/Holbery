// Sources checked 2026-10-06: docs.duitku.com/pop/id/ and docs.duitku.com/api/id/.
// Callback HMAC does not cover resultCode; status inquiry corroborates it before mutation.
export type PaymentConfig = { environment: 'production' | 'sandbox'; merchantCode: string; apiKey: string; origin: string }
export type InvoiceInput = { merchantOrderId: string; amount: number; orderId: string; name: string; email: string; items: { name: string; price: number; quantity: number }[] }
export type Invoice = { reference: string; paymentUrl: string }
export type ProviderStatus = { merchantOrderId: string; reference: string; amount: number; status: 'PAID' | 'PENDING' | 'FAILED' }
export interface PaymentProvider {
  createInvoice(input: InvoiceInput): Promise<Invoice>
  verifyCallback(fields: Record<string, string>): Promise<boolean>
  inquiry(merchantOrderId: string): Promise<ProviderStatus>
}
export const hex = (buffer: ArrayBuffer) => Array.from(new Uint8Array(buffer), b => b.toString(16).padStart(2, '0')).join('')
export async function digest(value: string) { return hex(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value))) }
export async function hmac(key: string, value: string) {
  const imported = await crypto.subtle.importKey('raw', new TextEncoder().encode(key), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  return hex(await crypto.subtle.sign('HMAC', imported, new TextEncoder().encode(value)))
}
export function equal(a: string, b: string) {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return diff === 0
}
export class ProviderError extends Error { constructor() { super('PROVIDER_UNAVAILABLE') } }
export class DuitkuAdapter implements PaymentProvider {
  private config: PaymentConfig
  constructor(config: PaymentConfig) { this.config = config }
  private async request(url: string, body: unknown, headers: Record<string,string> = {}): Promise<Record<string,unknown>> {
    try {
      const response = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json', ...headers }, body: JSON.stringify(body), signal: AbortSignal.timeout(12000), redirect: 'manual' })
      if (!response.ok) throw new ProviderError()
      const data: unknown = await response.json()
      if (!data || typeof data !== 'object' || Array.isArray(data)) throw new ProviderError()
      return data as Record<string,unknown>
    } catch { throw new ProviderError() }
  }
  async createInvoice(input: InvoiceInput): Promise<Invoice> {
    if (input.items.reduce((sum, item) => sum + item.price * item.quantity, 0) !== input.amount) throw new Error('AMOUNT_MISMATCH')
    const { environment, merchantCode, apiKey, origin } = this.config
    const timestamp = Date.now().toString()
    const host = environment === 'production' ? 'api-prod.duitku.com' : 'api-sandbox.duitku.com'
    const result = await this.request(`https://${host}/api/merchant/createInvoice`, {
      paymentAmount: input.amount, merchantOrderId: input.merchantOrderId, productDetails: 'HOLBERY order ' + input.orderId,
      email: input.email, customerVaName: input.name.slice(0,20), itemDetails: input.items.map(i=>({...i,name:i.name.slice(0,50)})),
      callbackUrl: origin + '/api/commerce/payments/duitku/callback', returnUrl: origin + '/orders/' + input.orderId, expiryPeriod: 60
    }, { 'x-duitku-merchantcode': merchantCode, 'x-duitku-timestamp': timestamp, 'x-duitku-signature': await hmac(apiKey, merchantCode + timestamp) })
    if (result.statusCode !== '00' || result.merchantCode !== merchantCode || typeof result.reference !== 'string' || !/^[A-Za-z0-9_-]{1,100}$/.test(result.reference) || typeof result.paymentUrl !== 'string') throw new ProviderError()
    const url = new URL(result.paymentUrl)
    if (url.origin !== (environment === 'production' ? 'https://app-prod.duitku.com' : 'https://app-sandbox.duitku.com')) throw new ProviderError()
    return { reference: result.reference, paymentUrl: url.href }
  }
  async verifyCallback(fields: Record<string, string>) {
    return fields.merchantCode === this.config.merchantCode && /^[a-fA-F0-9]{64}$/.test(fields.signature || '') && equal(fields.signature.toLowerCase(), await hmac(this.config.apiKey, fields.merchantCode + fields.amount + fields.merchantOrderId))
  }
  async inquiry(merchantOrderId: string): Promise<ProviderStatus> {
    const { merchantCode, apiKey, environment } = this.config
    const host = environment === 'production' ? 'passport.duitku.com' : 'sandbox.duitku.com'
    const result = await this.request(`https://${host}/webapi/api/merchant/transactionStatus`, { merchantCode, merchantOrderId, signature: await hmac(apiKey, merchantCode + merchantOrderId) })
    const amount = Number(result.amount)
    if (result.merchantOrderId !== merchantOrderId || typeof result.reference !== 'string' || !/^[A-Za-z0-9_-]{1,100}$/.test(result.reference) || !Number.isSafeInteger(amount) || amount <= 0 || !['00','01','02'].includes(String(result.statusCode))) throw new ProviderError()
    return { merchantOrderId, reference: result.reference, amount, status: result.statusCode === '00' ? 'PAID' : result.statusCode === '01' ? 'PENDING' : 'FAILED' }
  }
}
