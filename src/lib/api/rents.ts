/**
 * Server-side rents logic.
 * Calls MCP client, normalizes items, computes summary stats.
 */
import { fetchRents } from '@/lib/mcp/client'
import { normalizeRentItem } from '@/lib/mcp/normalizer'
import { calculateMedian, calculateQuantile } from '@/lib/utils/calc'
import type { PropertyType } from '@/types/filter'
import type { RentItem, RentSummary, RentMeta, RentReport } from '@/types/rent'
import type { QuantileRange } from '@/types/trade'

export interface RentsResponse {
  items: RentItem[]
  summary: RentReport
  meta: RentMeta
}

/**
 * Fetch, normalize and summarize rent data for a given region + month.
 */
export async function getRentsWithSummary(
  type: PropertyType,
  lawd: string,
  ym: string,
): Promise<RentsResponse> {
  const raw = await fetchRents(type, lawd, ym)
  const items = raw.map(normalizeRentItem)

  const jeonseItems = items.filter((i) => i.rentType === 'jeonse')
  const monthlyItems = items.filter((i) => i.rentType === 'monthly')

  const deposits = jeonseItems.map((i) => i.deposit)
  const monthlies = monthlyItems.map((i) => i.monthlyRent)

  const depositRange: QuantileRange = {
    min: deposits.length > 0 ? Math.min(...deposits) : 0,
    max: deposits.length > 0 ? Math.max(...deposits) : 0,
    q1: calculateQuantile(deposits, 0.25),
    q3: calculateQuantile(deposits, 0.75),
  }

  const summary: RentReport = {
    medianDeposit: calculateMedian(deposits),
    medianMonthly: calculateMedian(monthlies),
    totalCount: items.length,
    jeonseCount: jeonseItems.length,
    monthlyCount: monthlyItems.length,
    depositRange,
    sampleCount: items.length,
    // trend and trendPercent are calculated at the report level (multi-month)
    trend: 'flat',
    trendPercent: 0,
  }

  const meta: RentMeta = {
    lawd,
    ym,
    propertyType: type,
    totalCount: items.length,
    fetchedAt: new Date().toISOString(),
  }

  return { items, summary, meta }
}

/**
 * Build a RentSummary (items + meta) — used by the report aggregator.
 */
export async function getRentSummary(
  type: PropertyType,
  lawd: string,
  ym: string,
): Promise<RentSummary> {
  const { items, meta } = await getRentsWithSummary(type, lawd, ym)
  return { items, meta }
}
