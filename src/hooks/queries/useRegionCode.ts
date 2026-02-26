import { useQuery } from '@tanstack/react-query'
import { fetchApi } from '@/lib/api/client'
import { endpoints } from '@/lib/api/endpoints'
import { queryKeys } from './queryKeys'
import { regionCodeQueryOptions } from './queryOptions'

export interface RegionCodeResult {
  lawd: string
  name: string
}

export function useRegionCode(query: string) {
  return useQuery<RegionCodeResult[]>({
    queryKey: queryKeys.regionCode.search(query),
    queryFn: () =>
      fetchApi<RegionCodeResult[]>(endpoints.regionCode(query)),
    enabled: query.length >= 2,
    ...regionCodeQueryOptions,
  })
}
