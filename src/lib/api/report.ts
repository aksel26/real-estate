/**
 * Server-side report aggregation logic.
 * Fetches N months of trades + rents, aggregates into NeighborhoodReport.
 */
import { getTradesWithSummary } from './trades'
import { getRentsWithSummary } from './rents'
import { calculateMedian, calculateQuantile, calculateChangeRate } from '@/lib/utils/calc'
import { getCurrentYearMonth, subtractMonths } from '@/lib/utils/date'
import { JEONSE_RATE_THRESHOLDS } from '@/constants/filter'
import type { PropertyType } from '@/types/filter'
import type { NeighborhoodReport, TrendPoint, PriceStats, JeonseRateLevel } from '@/types/report'
import type { TradeReport, QuantileRange, TrendDirection } from '@/types/trade'
import type { RentReport } from '@/types/rent'
import type { TradeItem } from '@/types/trade'
import type { RentItem } from '@/types/rent'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function computeJeonseRate(depositMedian: number, priceMedian: number): PriceStats {
  if (priceMedian === 0) {
    return { value: 0, level: 'good', description: '매매 데이터 없음' }
  }

  const value = Math.round((depositMedian / priceMedian) * 1000) / 10 // 1 decimal

  let level: JeonseRateLevel
  if (value >= 70) {
    level = 'caution'
  } else if (value >= 50) {
    level = 'normal'
  } else {
    level = 'good'
  }

  const levelLabel = { caution: '주의', normal: '보통', good: '양호' }[level]
  const description = `전세가율 ${value.toFixed(1)}% — ${levelLabel}`

  return { value, level, description }
}

function trendDirection(changePercent: number): TrendDirection {
  if (changePercent > 1) return 'up'
  if (changePercent < -1) return 'down'
  return 'flat'
}

function buildTradeReport(allItems: TradeItem[], changePercent: number): TradeReport {
  const prices = allItems.map((i) => i.price)
  const medianPrice = calculateMedian(prices)

  const priceRange: QuantileRange = {
    min: prices.length > 0 ? Math.min(...prices) : 0,
    max: prices.length > 0 ? Math.max(...prices) : 0,
    q1: calculateQuantile(prices, 0.25),
    q3: calculateQuantile(prices, 0.75),
  }

  return {
    medianPrice,
    totalCount: allItems.length,
    priceRange,
    trend: trendDirection(changePercent),
    trendPercent: Math.round(changePercent * 10) / 10,
  }
}

function buildRentReport(allItems: RentItem[]): RentReport {
  const jeonseItems = allItems.filter((i) => i.rentType === 'jeonse')
  const monthlyItems = allItems.filter((i) => i.rentType === 'monthly')

  const deposits = jeonseItems.map((i) => i.deposit)
  const monthlies = monthlyItems.map((i) => i.monthlyRent)

  return {
    medianDeposit: calculateMedian(deposits),
    medianMonthly: calculateMedian(monthlies),
    totalCount: allItems.length,
    jeonseCount: jeonseItems.length,
    monthlyCount: monthlyItems.length,
    depositRange: {
      min: deposits.length > 0 ? Math.min(...deposits) : 0,
      max: deposits.length > 0 ? Math.max(...deposits) : 0,
      q1: calculateQuantile(deposits, 0.25),
      q3: calculateQuantile(deposits, 0.75),
    },
  }
}

// ---------------------------------------------------------------------------
// Main aggregator
// ---------------------------------------------------------------------------

/**
 * Aggregate N months of trade + rent data into a NeighborhoodReport.
 * Uses Promise.allSettled so partial month failures do not abort the response.
 *
 * @param type Property type
 * @param lawd 5-digit region code
 * @param months Number of months to include (1-12)
 * @param regionName Display name for the region (optional, defaults to lawd)
 */
export async function buildNeighborhoodReport(
  type: PropertyType,
  lawd: string,
  months: number,
  regionName?: string,
): Promise<NeighborhoodReport> {
  const endYm = getCurrentYearMonth()
  const startYm = subtractMonths(endYm, months - 1)

  // Build list of yearMonths (oldest first)
  const yearMonths: string[] = []
  for (let i = months - 1; i >= 0; i--) {
    yearMonths.push(subtractMonths(endYm, i))
  }

  // Fetch all months in parallel, tolerating partial failures
  const tradeResults = await Promise.allSettled(
    yearMonths.map((ym) => getTradesWithSummary(type, lawd, ym)),
  )
  const rentResults = await Promise.allSettled(
    yearMonths.map((ym) => getRentsWithSummary(type, lawd, ym)),
  )

  // Build monthly trend points
  const monthly: TrendPoint[] = yearMonths.map((ym, idx) => {
    const tradeResult = tradeResults[idx]
    const rentResult = rentResults[idx]

    const tradeItems =
      tradeResult.status === 'fulfilled' ? tradeResult.value.items : []
    const rentItems =
      rentResult.status === 'fulfilled' ? rentResult.value.items : []

    const jeonseDeposits = rentItems
      .filter((i) => i.rentType === 'jeonse')
      .map((i) => i.deposit)

    return {
      ym,
      tradeCount: tradeItems.length,
      tradeMedianPrice: calculateMedian(tradeItems.map((i) => i.price)),
      rentCount: rentItems.length,
      rentMedianDeposit: calculateMedian(jeonseDeposits),
    }
  })

  // Aggregate all items across fulfilled months
  const allTradeItems = tradeResults
    .filter((r): r is PromiseFulfilledResult<Awaited<ReturnType<typeof getTradesWithSummary>>> =>
      r.status === 'fulfilled',
    )
    .flatMap((r) => r.value.items)

  const allRentItems = rentResults
    .filter((r): r is PromiseFulfilledResult<Awaited<ReturnType<typeof getRentsWithSummary>>> =>
      r.status === 'fulfilled',
    )
    .flatMap((r) => r.value.items)

  // Compute trend: compare newest month median vs oldest month median
  const validMonthlyTrades = monthly.filter((m) => m.tradeMedianPrice > 0)
  const oldestPrice =
    validMonthlyTrades.length > 0 ? validMonthlyTrades[0].tradeMedianPrice : 0
  const newestPrice =
    validMonthlyTrades.length > 0
      ? validMonthlyTrades[validMonthlyTrades.length - 1].tradeMedianPrice
      : 0
  const changePercent = calculateChangeRate(oldestPrice, newestPrice)

  const tradeReport = buildTradeReport(allTradeItems, changePercent)
  const rentReport = buildRentReport(allRentItems)

  const jeonseRate = computeJeonseRate(rentReport.medianDeposit, tradeReport.medianPrice)

  return {
    region: {
      lawd,
      name: regionName ?? lawd,
    },
    propertyType: type,
    period: {
      months,
      startYm,
      endYm,
    },
    trade: tradeReport,
    rent: rentReport,
    jeonseRate,
    monthly,
  }
}
