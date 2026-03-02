import type { TradeItem } from '@/types/trade'
import type { RentItem } from '@/types/rent'
import type { RegionCandidate } from '@/types/region'
import type { MCPTradeRaw, MCPRentRaw, MCPRegionCodeRaw } from './types'

// ---------------------------------------------------------------------------
// Normalizers
// ---------------------------------------------------------------------------

/**
 * Normalize a raw MCP trade item to the app's TradeItem domain type.
 */
export function normalizeTradeItem(raw: MCPTradeRaw): TradeItem {
  return {
    aptName: (raw.apt_name ?? raw.unit_name ?? '').trim(),
    area: raw.area_sqm,
    price: raw.price_10k,
    floor: raw.floor,
    dealDate: raw.trade_date,
    dong: raw.dong,
    jibun: '',
    builtYear: raw.build_year,
  }
}

/**
 * Normalize a raw MCP rent item to the app's RentItem domain type.
 * rentType is 'jeonse' when monthly_rent_10k is 0, otherwise 'monthly'.
 */
export function normalizeRentItem(raw: MCPRentRaw): RentItem {
  return {
    aptName: raw.unit_name.trim(),
    area: raw.area_sqm,
    rentType: raw.monthly_rent_10k === 0 ? 'jeonse' : 'monthly',
    deposit: raw.deposit_10k,
    monthlyRent: raw.monthly_rent_10k,
    floor: raw.floor,
    dealDate: raw.trade_date,
    dong: raw.dong,
    jibun: '',
    builtYear: raw.build_year,
  }
}

/**
 * Normalize a raw region code record to a RegionCandidate.
 * Uses the first 5 digits of code as the lawd code.
 */
export function normalizeRegionCode(raw: MCPRegionCodeRaw): RegionCandidate {
  return {
    lawd: raw.code.slice(0, 5),
    name: raw.name.trim(),
  }
}
