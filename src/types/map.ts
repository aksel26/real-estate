import type { Coordinates } from './region'

/** 지도 뷰 경계 */
export interface MapBounds {
  sw: Coordinates
  ne: Coordinates
}

/** 지도 중심 좌표 */
export type MapCenter = Coordinates

/** GeoJSON Feature의 geometry 좌표 (폴리곤) */
export type PolygonCoordinates = number[][][]

/** GeoJSON Feature 속성 */
export interface PolygonProperties {
  /** 법정동 코드 */
  code: string
  /** 지역명 */
  name: string
  [key: string]: unknown
}

/** GeoJSON Feature (폴리곤) */
export interface PolygonFeature {
  type: 'Feature'
  properties: PolygonProperties
  geometry: {
    type: 'Polygon' | 'MultiPolygon'
    coordinates: PolygonCoordinates | number[][][][]
  }
}

/** GeoJSON FeatureCollection */
export interface GeoJsonData {
  type: 'FeatureCollection'
  features: PolygonFeature[]
}

/** 폴리곤 스타일 */
export interface PolygonStyle {
  fillColor: string
  fillOpacity: number
  strokeColor: string
  strokeWidth: number
}

/** 지도 뷰 상태 */
export interface MapViewState {
  center: Coordinates
  zoom: number
  bounds: MapBounds | null
}

/** 렌더링용 지역 폴리곤 데이터 */
export interface RegionPolygon {
  /** 법정동 코드 */
  regionCode: string
  regionName: string
  /** 폴리곤 꼭짓점 배열 */
  coordinates: Coordinates[]
  /** 폴리곤 중심점 */
  center: Coordinates
}
