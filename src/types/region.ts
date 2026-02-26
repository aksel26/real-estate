/** 시도/시군구/행정동 레벨 */
export type RegionLevel = 'sido' | 'sigungu' | 'dong'

/** 위경도 좌표 */
export interface Coordinates {
  lat: number
  lng: number
}

/** 시군구/행정동 지역 정보 */
export interface Region {
  /** 법정동 코드 ("11680") */
  lawd: string
  /** 지역명 ("서울특별시 강남구") */
  name: string
  /** 짧은 이름 ("강남구") */
  shortName: string
  level: RegionLevel
  /** 중심 좌표 (지도 이동용) */
  center: Coordinates
  /** 상위 지역 코드 */
  parentLawd?: string
}

/** 법정동 코드 (5자리 시군구 코드) */
export type RegionCode = string

/** 지역 검색 후보 항목 */
export interface RegionCandidate {
  lawd: string
  name: string
}

/** 지역 검색 결과 */
export interface RegionSearchResult {
  lawd: string
  name: string
  level: RegionLevel
  candidates?: RegionCandidate[]
}
