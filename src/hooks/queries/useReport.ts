import { useQuery } from '@tanstack/react-query'
import { fetchApi } from '@/lib/api/client'
import { endpoints } from '@/lib/api/endpoints'
import { useFilterStore } from '@/stores'
import { useSelectionStore } from '@/stores'
import { queryKeys } from './queryKeys'
import { dataQueryOptions } from './queryOptions'
import type { NeighborhoodReport } from '@/types'

export function useReport() {
  const propertyType = useFilterStore((s) => s.propertyType)
  const months = useFilterStore((s) => s.months)
  const selectedLawd = useSelectionStore((s) => s.selectedLawd)

  return useQuery<NeighborhoodReport>({
    queryKey: queryKeys.report.detail(propertyType, selectedLawd ?? '', months),
    queryFn: () =>
      fetchApi<NeighborhoodReport>(
        endpoints.report(propertyType, selectedLawd!, months)
      ),
    enabled: !!selectedLawd,
    ...dataQueryOptions,
  })
}
