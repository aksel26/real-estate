import { useQuery } from '@tanstack/react-query'
import { fetchApi } from '@/lib/api/client'
import { endpoints } from '@/lib/api/endpoints'
import { useFilterStore } from '@/stores'
import { useSelectionStore } from '@/stores'
import { queryKeys } from './queryKeys'
import { dataQueryOptions } from './queryOptions'
import type { RentSummary } from '@/types'

export function useRents(ym: string) {
  const propertyType = useFilterStore((s) => s.propertyType)
  const selectedLawd = useSelectionStore((s) => s.selectedLawd)

  return useQuery<RentSummary>({
    queryKey: queryKeys.rents.detail(propertyType, selectedLawd ?? '', ym),
    queryFn: () =>
      fetchApi<RentSummary>(
        endpoints.rents(propertyType, selectedLawd!, ym)
      ),
    enabled: !!selectedLawd && !!ym,
    ...dataQueryOptions,
  })
}
