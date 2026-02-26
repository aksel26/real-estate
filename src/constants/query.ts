import type { PropertyType } from '@/types/filter'

/** TanStack Query staleTime 기본값 (10분) */
export const DEFAULT_STALE_TIME = 10 * 60 * 1000

/** TanStack Query gcTime 기본값 (1시간) */
export const DEFAULT_GC_TIME = 60 * 60 * 1000

/** Query Key 팩토리 */
export const QUERY_KEYS = {
  report: {
    all: ['report'] as const,
    byRegion: (lawd: string) => ['report', lawd] as const,
    detail: (type: PropertyType, lawd: string, months: number) =>
      ['report', type, lawd, months] as const,
  },
  trades: {
    all: ['trades'] as const,
    byRegion: (lawd: string) => ['trades', lawd] as const,
    detail: (type: PropertyType, lawd: string, ym: string) =>
      ['trades', type, lawd, ym] as const,
  },
  rents: {
    all: ['rents'] as const,
    byRegion: (lawd: string) => ['rents', lawd] as const,
    detail: (type: PropertyType, lawd: string, ym: string) =>
      ['rents', type, lawd, ym] as const,
  },
  regionCode: {
    search: (q: string) => ['regionCode', q] as const,
  },
} as const
