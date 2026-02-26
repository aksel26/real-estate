/**
 * 현재 연월을 "YYYYMM" 형식으로 반환
 * @returns "202601"
 */
export function getCurrentYearMonth(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  return `${year}${month}`
}

/**
 * 특정 연월에서 n개월 전 연월을 반환
 * @param yearMonth "YYYYMM" 형식
 * @param n 뺄 개월 수
 * @returns "YYYYMM" 형식
 */
export function subtractMonths(yearMonth: string, n: number): string {
  const year = parseInt(yearMonth.slice(0, 4), 10)
  const month = parseInt(yearMonth.slice(4, 6), 10)

  const date = new Date(year, month - 1 - n, 1)
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  return `${y}${m}`
}

/**
 * 최근 n개월의 "YYYYMM" 목록을 최신순으로 반환
 * @param n 개월 수
 * @param baseYm 기준 연월 (기본: 현재월)
 * @returns ["202601", "202512", ..., "202508"] (최신 → 과거 순)
 */
export function getRecentMonths(n: number, baseYm?: string): string[] {
  const base = baseYm ?? getCurrentYearMonth()
  const result: string[] = []

  for (let i = 0; i < n; i++) {
    result.push(subtractMonths(base, i))
  }

  return result
}

/**
 * "YYYYMM" 형식을 한국어 레이블로 변환
 * @param yearMonth "202601"
 * @returns "2026년 1월"
 */
export function yearMonthToLabel(yearMonth: string): string {
  const year = yearMonth.slice(0, 4)
  const month = parseInt(yearMonth.slice(4, 6), 10)
  return `${year}년 ${month}월`
}

/**
 * "YYYYMM" 형식을 짧은 레이블로 변환 (차트 축용)
 * @param yearMonth "202601"
 * @returns "1월"
 */
export function yearMonthToShortLabel(yearMonth: string): string {
  const month = parseInt(yearMonth.slice(4, 6), 10)
  return `${month}월`
}

/**
 * "YYYYMM" 형식이 유효한지 검증
 * @param yearMonth 검증할 문자열
 */
export function isValidYearMonth(yearMonth: string): boolean {
  if (!/^\d{6}$/.test(yearMonth)) return false
  const month = parseInt(yearMonth.slice(4, 6), 10)
  return month >= 1 && month <= 12
}
