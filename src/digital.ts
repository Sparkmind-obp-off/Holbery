import type { Bindings } from './commerce'

export type DeliveryAsset = {
  variant_id: string; version: string; object_key: string; sha256: string; bytes: number; filename: string;
  support_path: string; terms_version: string; refund_version: string; privacy_version: string
}
export async function digitalReadiness(env: Bindings, storefrontId = 'holbery-direct'): Promise<string[]> {
  if (env.ENVIRONMENT !== 'production') return []
  if (!env.DB || !env.PRODUCT_BUCKET) return ['PRIVATE_PRODUCT_STORAGE']
  const assets = await env.DB.prepare("SELECT v.id AS variant_id,a.* FROM offers o JOIN products p ON p.id=o.product_id JOIN product_variants v ON v.id=o.variant_id LEFT JOIN product_delivery_assets a ON a.variant_id=v.id WHERE o.storefront_id=? AND p.status='published' AND o.status='active' AND v.status='active' AND v.stock>0").bind(storefrontId).all<DeliveryAsset>()
  if (!assets.results.length) return ['APPROVED_PUBLISHED_PRODUCT']
  for (const a of assets.results) {
    if (!a.object_key || !a.version || !a.sha256 || a.support_path !== '/support/commerce' || a.terms_version !== env.TERMS_VERSION || a.refund_version !== env.REFUND_POLICY_VERSION || a.privacy_version !== env.PRIVACY_POLICY_VERSION) return ['PRODUCT_DELIVERY_OR_POLICY']
    const object = await env.PRODUCT_BUCKET.head(a.object_key)
    if (!object || object.size !== a.bytes || object.customMetadata?.sha256 !== a.sha256) return ['PRODUCT_DELIVERY_ASSET']
  }
  return []
}
export async function verifiedAsset(env: Bindings, key: string, sha256: string, bytes: number) {
  if (!env.PRODUCT_BUCKET) return null
  const object = await env.PRODUCT_BUCKET.get(key)
  if (!object || object.size !== bytes || bytes > 5000000) return null
  const buffer = await object.arrayBuffer()
  const digest = [...new Uint8Array(await crypto.subtle.digest('SHA-256',buffer))].map(v=>v.toString(16).padStart(2,'0')).join('')
  return digest === sha256 ? buffer : null
}
