export function classifyProject({ kind, visibility = 'public' }) {
  if (visibility === 'private') return 'EXCLUDED';
  return { system: 'SYSTEMS', packaged_product: 'PRODUCTS', operating_business: 'VENTURES', distribution: 'COMMERCE' }[kind] ?? 'HOLD';
}
export function namingDecision({ distinctAudience = false, independentScale = false, separationValue = false, rightsReady = false, parentTrust = true } = {}) {
  if (distinctAudience || independentScale || separationValue) return rightsReady ? 'CHILD_BRAND_REVIEW' : 'HOLD_FOR_RIGHTS';
  return parentTrust ? 'HOLBERY_DIRECT' : 'DESCRIPTIVE_PRODUCT';
}
export function canValidate({ realOperators = 0, baseline = false, outcomePassed = false, consent = false } = {}) {
  return realOperators >= 2 && baseline && outcomePassed && consent;
}
