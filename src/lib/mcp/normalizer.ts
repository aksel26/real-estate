import type { TradeItem } from '@/types/trade'
import type { RentItem } from '@/types/rent'
import type { RegionCandidate } from '@/types/region'
import type { MCPTradeRaw, MCPRentRaw, MCPRegionCodeRaw } from './types'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Parse a Korean price string to a number (만원).
 * Handles comma-separated values like "85,000" → 85000.
 */
function parsePrice(raw: string): number {
  const cleaned = raw.replace(/[,\s]/g, '')
  const n = parseInt(cleaned, 10)
  return isNaN(n) ? 0 : n
}

function parseFloat2(raw: string): number {
  const n = parseFloat(raw)
  return isNaN(n) ? 0 : n
}

function parseInt2(raw: string): number {
  const n = parseInt(raw, 10)
  return isNaN(n) ? 0 : n
}

/**
 * Build an ISO date string from Korean year/month/day fields.
 * e.g. 년="2026" 월="01" 일="15" → "2026-01-15"
 */
function buildDealDate(년: string, 월: string, 일: string): string {
  const month = 월.padStart(2, '0')
  const day = 일.padStart(2, '0')
  return `${년}-${month}-${day}`
}

// ---------------------------------------------------------------------------
// Normalizers
// ---------------------------------------------------------------------------

/**
 * Normalize a raw MCP trade item to the app's TradeItem domain type.
 */
export function normalizeTradeItem(raw: MCPTradeRaw): TradeItem {
  return {
    aptName: raw.아파트.trim(),
    area: parseFloat2(raw.전용면적),
    price: parsePrice(raw.거래금액),
    floor: parseInt2(raw.층),
    dealDate: buildDealDate(raw.년, raw.월, raw.일),
    jibun: raw.지번 ?? '',
    builtYear: raw.건축년도 ? parseInt2(raw.건축년도) : 0,
  }
}

/**
 * Normalize a raw MCP rent item to the app's RentItem domain type.
 * rentType is 'jeonse' when 월세금액 is 0, otherwise 'monthly'.
 */
export function normalizeRentItem(raw: MCPRentRaw): RentItem {
  const monthlyRent = parsePrice(raw.월세금액)
  return {
    aptName: raw.아파트.trim(),
    area: parseFloat2(raw.전용면적),
    rentType: monthlyRent === 0 ? 'jeonse' : 'monthly',
    deposit: parsePrice(raw.보증금액),
    monthlyRent,
    floor: parseInt2(raw.층),
    dealDate: buildDealDate(raw.년, raw.월, raw.일),
    jibun: raw.지번 ?? '',
    builtYear: raw.건축년도 ? parseInt2(raw.건축년도) : 0,
  }
}

/**
 * Normalize a raw region code record to a RegionCandidate.
 * Uses the first 5 digits of 법정동코드 as the lawd code.
 */
export function normalizeRegionCode(raw: MCPRegionCodeRaw): RegionCandidate {
  return {
    lawd: raw.법정동코드.slice(0, 5),
    name: raw.법정동명.trim(),
  }
}
