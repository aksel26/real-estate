'use client'

import { useMemo } from 'react'
import { useFilterStore, useUIStore } from '@/stores'
import { useMultiMonthRents } from './useMultiMonthRents'
import { filterByAreaBand, computeAreaBandStats, groupByApartment, sortAptRanking } from '@/lib/utils'

export function useAptRanking() {
  const areaBand = useFilterStore((s) => s.areaBand)
  const rankSortKey = useUIStore((s) => s.rankSortKey)
  const rankSortDir = useUIStore((s) => s.rankSortDir)

  const { items, isLoading, isError } = useMultiMonthRents()

  const bandStats = useMemo(
    () => computeAreaBandStats(items, areaBand),
    [items, areaBand],
  )

  const rankedApts = useMemo(() => {
    const filtered = filterByAreaBand(items, areaBand)
    const grouped = groupByApartment(filtered)
    return sortAptRanking(grouped, rankSortKey, rankSortDir)
  }, [items, areaBand, rankSortKey, rankSortDir])

  return { bandStats, rankedApts, isLoading, isError }
}
