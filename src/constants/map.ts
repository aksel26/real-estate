import type { Coordinates } from '@/types/region'
import type { PolygonStyle } from '@/types/map'

/** 기본 지도 중심 — 서울시청 */
export const DEFAULT_CENTER: Coordinates = {
  lat: 37.5665,
  lng: 126.978,
}

/** 기본 줌 레벨 */
export const DEFAULT_ZOOM = 11

/** 시군구 단위 표시 최소 줌 */
export const SIGUNGU_MIN_ZOOM = 9

/** 행정동 단위 표시 최소 줌 */
export const DONG_MIN_ZOOM = 12

/** 폴리곤 스타일 (default / hover / selected) */
export const POLYGON_STYLES: Record<'default' | 'hover' | 'selected', PolygonStyle> = {
  default: {
    fillColor: '#3B82F6',
    fillOpacity: 0.1,
    strokeColor: '#3B82F6',
    strokeWidth: 1,
  },
  hover: {
    fillColor: '#3B82F6',
    fillOpacity: 0.3,
    strokeColor: '#2563EB',
    strokeWidth: 2,
  },
  selected: {
    fillColor: '#2563EB',
    fillOpacity: 0.4,
    strokeColor: '#1D4ED8',
    strokeWidth: 3,
  },
}
