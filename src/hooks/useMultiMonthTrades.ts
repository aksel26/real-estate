'use client'

import { useQueries } from '@tanstack/react-query'
import { fetchApi } from '@/lib/api/client'
import { endpoints } from '@/lib/api/endpoints'
import { queryKeys, dataQueryOptions } from './queries'
import { useFilterStore, useSelectionStore } from '@/stores'
import { getRecentMonths } from '@/lib/utils'
import type { TradeSummary, TradeItem } from '@/types'

export function useMultiMonthTrades() {
  const propertyType = useFilterStore((s) => s.propertyType)
  const months = useFilterStore((s) => s.months)
  const selectedLawd = useSelectionStore((s) => s.selectedLawd)

  const ymList = getRecentMonths(months)

  const queries = useQueries({
    queries: ymList.map((ym) => ({
      queryKey: queryKeys.trades.detail(propertyType, selectedLawd ?? '', ym),
      queryFn: () =>
        fetchApi<TradeSummary>(endpoints.trades(propertyType, selectedLawd!, ym)),
      enabled: !!selectedLawd,
      ...dataQueryOptions,
    })),
  })

  const isLoading = queries.some((q) => q.isLoading)
  const isError = queries.some((q) => q.isError)

  const items: TradeItem[] = queries.flatMap((q) => q.data?.items ?? [])

  return { items, isLoading, isError }
}
