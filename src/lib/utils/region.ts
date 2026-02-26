import type { RegionLevel } from '@/types/region'

/**
 * 법정동 코드를 파싱하여 구성 요소를 반환
 * @param lawd 법정동 코드 (5~10자리)
 * @returns { sido: string, sigungu: string, dong: string }
 */
export function parseLawdCode(lawd: string): {
  sido: string
  sigungu: string
  dong: string
} {
  const padded = lawd.padEnd(10, '0')
  return {
    sido: padded.slice(0, 2),
    sigungu: padded.slice(0, 5),
    dong: padded.slice(0, 8),
  }
}

/**
 * 법정동 코드의 행정 레벨을 반환
 * @param lawd 법정동 코드
 * @returns RegionLevel
 */
export function getRegionLevel(lawd: string): RegionLevel {
  // 시도: 2자리 (예: "11")
  // 시군구: 5자리 (예: "11680")
  // 읍면동: 8자리 (예: "11680108")
  const trimmed = lawd.replace(/0+$/, '')

  if (trimmed.length <= 2) return 'sido'
  if (trimmed.length <= 5) return 'sigungu'
  return 'dong'
}

/**
 * 법정동 코드가 유효한지 검증 (5자리 시군구 코드)
 * @param lawd 검증할 코드
 */
export function isValidLawd(lawd: string): boolean {
  return /^\d{5}$/.test(lawd)
}

/**
 * 지역명에서 시도 접미사를 정규화
 * 예: "서울특별시" -> "서울", "경기도" -> "경기"
 * @param name 원본 지역명
 * @returns 정규화된 지역명
 */
export function normalizeRegionName(name: string): string {
  return name
    .replace(/특별시$|광역시$|특별자치시$|특별자치도$|도$/, '')
    .trim()
}

/**
 * 시군구 코드로 상위 시도 코드를 반환
 * @param sigunguCode 5자리 시군구 코드
 * @returns 2자리 시도 코드
 */
export function getSidoCode(sigunguCode: string): string {
  return sigunguCode.slice(0, 2)
}
