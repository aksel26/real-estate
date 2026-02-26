/**
 * Server-side trades logic.
 * Calls MCP client, normalizes items, computes summary stats.
 */
import { fetchTrades } from '@/lib/mcp/client'
import { normalizeTradeItem } from '@/lib/mcp/normalizer'
import { calculateMedian, calculateQuantile } from '@/lib/utils/calc'
import type { PropertyType } from '@/types/filter'
import type { TradeItem, TradeSummary, TradeMeta, TradeReport, QuantileRange } from '@/types/trade'

export interface TradesResponse {
  items: TradeItem[]
  summary: TradeReport
  meta: TradeMeta
}

/**
 * Fetch, normalize and summarize trade data for a given region + month.
 */
export async function getTradesWithSummary(
  type: PropertyType,
  lawd: string,
  ym: string,
): Promise<TradesResponse> {
  const raw = await fetchTrades(type, lawd, ym)
  const items = raw.map(normalizeTradeItem)

  const prices = items.map((i) => i.price)

  const priceRange: QuantileRange = {
    min: prices.length > 0 ? Math.min(...prices) : 0,
    max: prices.length > 0 ? Math.max(...prices) : 0,
    q1: calculateQuantile(prices, 0.25),
    q3: calculateQuantile(prices, 0.75),
  }

  const medianPrice = calculateMedian(prices)

  const summary: TradeReport = {
    medianPrice,
    totalCount: items.length,
    priceRange,
    // trend and trendPercent are calculated at the report level (multi-month)
    trend: 'flat',
    trendPercent: 0,
  }

  const meta: TradeMeta = {
    lawd,
    ym,
    propertyType: type,
    totalCount: items.length,
    fetchedAt: new Date().toISOString(),
  }

  return { items, summary, meta }
}

/**
 * Build a TradeSummary (items + meta) — used by the report aggregator.
 */
export async function getTradeSummary(
  type: PropertyType,
  lawd: string,
  ym: string,
): Promise<TradeSummary> {
  const { items, meta } = await getTradesWithSummary(type, lawd, ym)
  return { items, meta }
}
