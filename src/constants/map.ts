import type { Coordinates } from '@/types/region';
import type { PolygonStyle } from '@/types/map';

/** 기본 지도 중심 — 서울시청 */
export const DEFAULT_CENTER: Coordinates = {
  lat: 37.5665,
  lng: 126.978,
};

/** 기본 줌 레벨 */
export const DEFAULT_ZOOM = 8;

/** 시군구 단위 표시 최소 줌 */
export const SIGUNGU_MIN_ZOOM = 9;

/** 행정동 단위 표시 최소 줌 */
export const DONG_MIN_ZOOM = 12;

/** 폴리곤 스타일 (default / hover / selected) */
export const POLYGON_STYLES: Record<'default' | 'hover' | 'selected', PolygonStyle> = {
  default: {
    fillColor: '#93C5FD',
    fillOpacity: 0.15,
    strokeColor: '#60A5FA',
    strokeWidth: 2,
    strokeStyle: 'shortdot',
  },
  hover: {
    fillColor: '#A78BFA',
    fillOpacity: 0.35,
    strokeColor: '#8B5CF6',
    strokeWidth: 3,
    strokeStyle: 'shortdot',
  },
  selected: {
    fillColor: '#F472B6',
    fillOpacity: 0.45,
    strokeColor: '#EC4899',
    strokeWidth: 3,
    strokeStyle: 'dot',
  },
};
