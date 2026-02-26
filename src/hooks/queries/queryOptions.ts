import { DEFAULT_STALE_TIME, DEFAULT_GC_TIME } from '@/constants/query'

/** Shared query defaults for report, trades, rents (10min stale / 1hr gc) */
export const dataQueryOptions = {
  staleTime: DEFAULT_STALE_TIME,
  gcTime: DEFAULT_GC_TIME,
} as const

/** Query defaults for region code lookups (30min stale / 6hr gc) */
export const regionCodeQueryOptions = {
  staleTime: 30 * 60 * 1000,
  gcTime: 6 * 60 * 60 * 1000,
} as const
