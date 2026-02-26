import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { fetchApi } from '@/lib/api/client'
import { endpoints } from '@/lib/api/endpoints'
import { queryKeys } from './queryKeys'
import { dataQueryOptions } from './queryOptions'
import type { TradeSummary } from '@/types'
import type { RentSummary } from '@/types'

function shiftYm(ym: string, delta: number): string {
  const year = parseInt(ym.slice(0, 4), 10)
  const month = parseInt(ym.slice(4, 6), 10) - 1 // 0-indexed
  const d = new Date(year, month + delta, 1)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  return `${y}${m}`
}

export function usePrefetchAdjacentMonths(
  type: string,
  lawd: string,
  currentYm: string
) {
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!lawd || !currentYm || !type) return

    const months = [shiftYm(currentYm, -1), shiftYm(currentYm, 1)]

    for (const ym of months) {
      queryClient.prefetchQuery({
        queryKey: queryKeys.trades.detail(type, lawd, ym),
        queryFn: () =>
          fetchApi<TradeSummary>(endpoints.trades(type, lawd, ym)),
        ...dataQueryOptions,
      })

      queryClient.prefetchQuery({
        queryKey: queryKeys.rents.detail(type, lawd, ym),
        queryFn: () =>
          fetchApi<RentSummary>(endpoints.rents(type, lawd, ym)),
        ...dataQueryOptions,
      })
    }
  }, [queryClient, type, lawd, currentYm])
}
