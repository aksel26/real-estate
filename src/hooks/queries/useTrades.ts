import { useQuery } from '@tanstack/react-query'
import { fetchApi } from '@/lib/api/client'
import { endpoints } from '@/lib/api/endpoints'
import { useFilterStore } from '@/stores'
import { useSelectionStore } from '@/stores'
import { queryKeys } from './queryKeys'
import { dataQueryOptions } from './queryOptions'
import type { TradeSummary } from '@/types'

export function useTrades(ym: string) {
  const propertyType = useFilterStore((s) => s.propertyType)
  const selectedLawd = useSelectionStore((s) => s.selectedLawd)

  return useQuery<TradeSummary>({
    queryKey: queryKeys.trades.detail(propertyType, selectedLawd ?? '', ym),
    queryFn: () =>
      fetchApi<TradeSummary>(
        endpoints.trades(propertyType, selectedLawd!, ym)
      ),
    enabled: !!selectedLawd && !!ym,
    ...dataQueryOptions,
  })
}
