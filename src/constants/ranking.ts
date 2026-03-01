import type { AreaBand, AreaBandId, RankSortKey, RankSortDir } from '@/types/ranking'

/** 면적대 구간 정의 */
export const AREA_BANDS: AreaBand[] = [
  { id: 'all', label: '전체', min: null, max: null },
  { id: 'xs', label: '~40㎡', min: null, max: 40 },
  { id: 'sm', label: '40~60㎡', min: 40, max: 60 },
  { id: 'md', label: '60~85㎡', min: 60, max: 85 },
  { id: 'lg', label: '85~110㎡', min: 85, max: 110 },
  { id: 'xl', label: '110㎡~', min: 110, max: null },
]

/** 면적대 ID → AreaBand 빠른 조회 */
export const AREA_BAND_MAP: Record<AreaBandId, AreaBand> = Object.fromEntries(
  AREA_BANDS.map((b) => [b.id, b]),
) as Record<AreaBandId, AreaBand>

/** 랭킹 정렬 옵션 */
export const RANK_SORT_OPTIONS: { key: RankSortKey; dir: RankSortDir; label: string }[] = [
  { key: 'countTotal', dir: 'desc', label: '거래 많은 순' },
  { key: 'medianDeposit', dir: 'desc', label: '보증금 높은 순' },
  { key: 'medianDeposit', dir: 'asc', label: '보증금 낮은 순' },
  { key: 'medianMonthlyRent', dir: 'desc', label: '월세 높은 순' },
  { key: 'medianMonthlyRent', dir: 'asc', label: '월세 낮은 순' },
]

/** 표본 부족 기준 건수 */
export const LOW_SAMPLE_THRESHOLD = 5

/** 기본 랭킹 노출 건수 */
export const DEFAULT_RANK_LIMIT = 10
