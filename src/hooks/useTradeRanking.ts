'use client'

import { useMemo } from 'react'
import { useFilterStore, useUIStore } from '@/stores'
import { useMultiMonthTrades } from './useMultiMonthTrades'
import { filterTradeByAreaBand, groupTradesByApartment, sortTradeRanking } from '@/lib/utils'

export function useTradeRanking() {
  const areaBand = useFilterStore((s) => s.areaBand)
  const rankSortDir = useUIStore((s) => s.rankSortDir)

  const { items, isLoading, isError } = useMultiMonthTrades()

  const rankedApts = useMemo(() => {
    const filtered = filterTradeByAreaBand(items, areaBand)
    const grouped = groupTradesByApartment(filtered)
    return sortTradeRanking(grouped, 'countTotal', rankSortDir)
  }, [items, areaBand, rankSortDir])

  return { rankedApts, isLoading, isError }
}
