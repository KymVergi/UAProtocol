import { CONTRACTS } from './contracts'

export const UAP_POOL_KEY = {
  currency0: CONTRACTS.WETH,
  currency1: CONTRACTS.UAP_TOKEN,
  fee: 3000,
  tickSpacing: 60,
  hooks: CONTRACTS.UAP_HOOK,
}

// Helper para verificar si las direcciones están en orden correcto
export function isValidPoolKey() {
  if (!CONTRACTS.UAP_TOKEN || !CONTRACTS.UAP_HOOK) return false
  
  // currency0 debe ser < currency1 (orden de direcciones)
  return CONTRACTS.WETH.toLowerCase() < CONTRACTS.UAP_TOKEN.toLowerCase()
}