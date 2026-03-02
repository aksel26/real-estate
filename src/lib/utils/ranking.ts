import type { TradeItem } from '@/types/trade'
import type { RentItem } from '@/types/rent'
import type {
  AreaBand,
  AreaBandId,
  AreaBandStats,
  AreaBreakdownItem,
  MonthlyTrendItem,
  AptRankItem,
  RankSortKey,
  RankSortDir,
  TradeRankItem,
  TradeSortKey,
} from '@/types/ranking'
import { AREA_BAND_MAP, LOW_SAMPLE_THRESHOLD } from '@/constants/ranking'
import { calculateMedian, calculateQuantile } from './calc'

/**
 * 면적대 필터링
 */
export function filterByAreaBand(items: RentItem[], bandId: AreaBandId): RentItem[] {
  if (bandId === 'all') return items

  const band = AREA_BAND_MAP[bandId]
  return items.filter((item) => {
    if (band.min !== null && item.area < band.min) return false
    if (band.max !== null && item.area >= band.max) return false
    return true
  })
}

/**
 * 면적대별 요약 통계 계산
 */
export function computeAreaBandStats(items: RentItem[], bandId: AreaBandId): AreaBandStats {
  const filtered = filterByAreaBand(items, bandId)
  const jeonseItems = filtered.filter((i) => i.rentType === 'jeonse')
  const monthlyItems = filtered.filter((i) => i.rentType === 'monthly')

  const jeonseDeposits = jeonseItems.map((i) => i.deposit)
  const monthlyDeposits = monthlyItems.map((i) => i.deposit)
  const monthlyRents = monthlyItems.map((i) => i.monthlyRent)

  return {
    bandId,
    medianDeposit: calculateMedian(jeonseDeposits),
    depositIQR: {
      q1: calculateQuantile(jeonseDeposits, 0.25),
      q3: calculateQuantile(jeonseDeposits, 0.75),
    },
    medianMonthlyDeposit: calculateMedian(monthlyDeposits),
    medianMonthlyRent: calculateMedian(monthlyRents),
    totalCount: filtered.length,
    jeonseCount: jeonseItems.length,
    monthlyCount: monthlyItems.length,
    isLowSample: filtered.length < LOW_SAMPLE_THRESHOLD,
  }
}

/**
 * 단지명별 그룹핑 → AptRankItem[] 생성
 */
export function groupByApartment(items: RentItem[]): AptRankItem[] {
  const groups = new Map<string, RentItem[]>()

  for (const item of items) {
    const existing = groups.get(item.aptName)
    if (existing) {
      existing.push(item)
    } else {
      groups.set(item.aptName, [item])
    }
  }

  const result: AptRankItem[] = []

  for (const [aptName, aptItems] of Array.from(groups.entries())) {
    const jeonseItems = aptItems.filter((i) => i.rentType === 'jeonse')
    const monthlyItems = aptItems.filter((i) => i.rentType === 'monthly')

    const recentItems = [...aptItems]
      .sort((a, b) => b.dealDate.localeCompare(a.dealDate))
      .slice(0, 10)

    // 대표 주소: 최신 거래의 dong + jibun
    const rep = recentItems[0]

    result.push({
      aptName,
      countTotal: aptItems.length,
      countJeonse: jeonseItems.length,
      countMonthly: monthlyItems.length,
      medianDeposit: calculateMedian(jeonseItems.map((i) => i.deposit)),
      medianMonthlyRent: calculateMedian(monthlyItems.map((i) => i.monthlyRent)),
      medianMonthlyDeposit: calculateMedian(monthlyItems.map((i) => i.deposit)),
      medianArea: calculateMedian(aptItems.map((i) => i.area)),
      dong: rep?.dong ?? '',
      jibun: rep?.jibun ?? '',
      recentItems,
    })
  }

  return result
}

/**
 * 단지 랭킹 정렬
 */
export function sortAptRanking(
  items: AptRankItem[],
  sortKey: RankSortKey,
  sortDir: RankSortDir,
): AptRankItem[] {
  return [...items].sort((a, b) => {
    const aVal = a[sortKey]
    const bVal = b[sortKey]
    return sortDir === 'desc' ? bVal - aVal : aVal - bVal
  })
}

/**
 * 매매 면적대 필터링 (TradeItem도 area 필드가 있으므로 동일 로직)
 */
export function filterTradeByAreaBand(items: TradeItem[], bandId: AreaBandId): TradeItem[] {
  if (bandId === 'all') return items

  const band = AREA_BAND_MAP[bandId]
  return items.filter((item) => {
    if (band.min !== null && item.area < band.min) return false
    if (band.max !== null && item.area >= band.max) return false
    return true
  })
}

/**
 * 매매 단지명별 그룹핑 → TradeRankItem[] 생성
 */
export function groupTradesByApartment(items: TradeItem[]): TradeRankItem[] {
  const groups = new Map<string, TradeItem[]>()

  for (const item of items) {
    const existing = groups.get(item.aptName)
    if (existing) {
      existing.push(item)
    } else {
      groups.set(item.aptName, [item])
    }
  }

  const result: TradeRankItem[] = []

  for (const [aptName, aptItems] of Array.from(groups.entries())) {
    const recentItems = [...aptItems]
      .sort((a, b) => b.dealDate.localeCompare(a.dealDate))
      .slice(0, 10)

    const rep = recentItems[0]

    result.push({
      aptName,
      countTotal: aptItems.length,
      medianPrice: calculateMedian(aptItems.map((i) => i.price)),
      medianArea: calculateMedian(aptItems.map((i) => i.area)),
      dong: rep?.dong ?? '',
      jibun: rep?.jibun ?? '',
      recentItems,
    })
  }

  return result
}

/**
 * 매매 단지 랭킹 정렬
 */
export function sortTradeRanking(
  items: TradeRankItem[],
  sortKey: TradeSortKey,
  sortDir: RankSortDir,
): TradeRankItem[] {
  return [...items].sort((a, b) => {
    const aVal = a[sortKey]
    const bVal = b[sortKey]
    return sortDir === 'desc' ? bVal - aVal : aVal - bVal
  })
}

/**
 * 면적별 시세 브레이크다운 (10㎡ 단위 구간)
 * @param items 거래 아이템 배열
 * @param valueKey 값 추출 키 ('price' | 'deposit')
 */
export function computeAreaBreakdown<T extends { area: number }>(
  items: T[],
  valueKey: keyof T,
): AreaBreakdownItem[] {
  const groups = new Map<number, number[]>()

  for (const item of items) {
    const bucket = Math.floor(item.area / 10) * 10
    const values = groups.get(bucket)
    const val = item[valueKey] as number
    if (values) {
      values.push(val)
    } else {
      groups.set(bucket, [val])
    }
  }

  return Array.from(groups.entries())
    .sort(([a], [b]) => a - b)
    .map(([bucket, values]) => ({
      areaLabel: `${bucket}㎡`,
      medianValue: calculateMedian(values),
      count: values.length,
    }))
}

/**
 * 월별 추이 계산 (dealDate에서 YYYY-MM 추출 → 월별 중위값)
 * @param items 거래 아이템 배열
 * @param valueKey 값 추출 키 ('price' | 'deposit')
 */
export function computeMonthlyTrend<T extends { dealDate: string }>(
  items: T[],
  valueKey: keyof T,
): MonthlyTrendItem[] {
  const groups = new Map<string, number[]>()

  for (const item of items) {
    const ym = item.dealDate.slice(0, 7) // "2026-01-15" → "2026-01"
    const values = groups.get(ym)
    const val = item[valueKey] as number
    if (values) {
      values.push(val)
    } else {
      groups.set(ym, [val])
    }
  }

  return Array.from(groups.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([ym, values]) => ({
      ym,
      medianValue: calculateMedian(values),
      count: values.length,
    }))
}
