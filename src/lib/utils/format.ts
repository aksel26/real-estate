/**
 * 가격(만원)을 "X억 Y만원" 형식으로 포맷
 * @param manwon 만원 단위 숫자
 * @returns "15억 3,000만원" | "5,500만원" | "0원"
 */
export function formatPrice(manwon: number): string {
  if (manwon === 0) return '0원'

  const eok = Math.floor(manwon / 10000)
  const remainder = manwon % 10000

  if (eok > 0 && remainder > 0) {
    return `${eok.toLocaleString('ko-KR')}억 ${remainder.toLocaleString('ko-KR')}만원`
  }
  if (eok > 0) {
    return `${eok.toLocaleString('ko-KR')}억`
  }
  return `${manwon.toLocaleString('ko-KR')}만원`
}

/**
 * 가격(만원)을 짧은 형식으로 포맷 (차트 축 레이블용)
 * @param manwon 만원 단위 숫자
 * @returns "15.3억" | "5,500만"
 */
export function formatPriceShort(manwon: number): string {
  if (manwon === 0) return '0'

  const eok = manwon / 10000
  if (eok >= 1) {
    return `${eok % 1 === 0 ? eok : eok.toFixed(1)}억`
  }
  return `${manwon.toLocaleString('ko-KR')}만`
}

/**
 * 숫자를 퍼센트 문자열로 포맷
 * @param value 0~100 범위의 숫자
 * @param digits 소수점 자릿수 (기본: 1)
 * @returns "72.3%"
 */
export function formatPercent(value: number, digits = 1): string {
  return `${value.toFixed(digits)}%`
}

/**
 * 거래량(건수)을 포맷
 * @param count 거래 건수
 * @returns "1,234건"
 */
export function formatVolume(count: number): string {
  return `${count.toLocaleString('ko-KR')}건`
}

/**
 * 면적(㎡)을 포맷
 * @param area 면적 (㎡)
 * @returns "84.9㎡"
 */
export function formatArea(area: number): string {
  return `${area.toFixed(1)}㎡`
}
