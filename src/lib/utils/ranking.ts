import type { RentItem } from '@/types/rent'
import type { AreaBand, AreaBandId, AreaBandStats, AptRankItem, RankSortKey, RankSortDir } from '@/types/ranking'
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

    result.push({
      aptName,
      countTotal: aptItems.length,
      countJeonse: jeonseItems.length,
      countMonthly: monthlyItems.length,
      medianDeposit: calculateMedian(jeonseItems.map((i) => i.deposit)),
      medianMonthlyRent: calculateMedian(monthlyItems.map((i) => i.monthlyRent)),
      medianMonthlyDeposit: calculateMedian(monthlyItems.map((i) => i.deposit)),
      medianArea: calculateMedian(aptItems.map((i) => i.area)),
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
