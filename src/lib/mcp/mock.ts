import type { MCPTradeRaw, MCPRentRaw, MCPRegionCodeRaw } from './types'

// ---------------------------------------------------------------------------
// Seoul district data
// ---------------------------------------------------------------------------

const SEOUL_DISTRICTS: Array<{
  name: string
  code: string
  dongs: string[]
  aptNames: string[]
  priceBase: number  // 만원, 33평 기준 중위가
  depositBase: number // 만원, 전세 기준 중위
}> = [
  {
    name: '강남구',
    code: '11680',
    dongs: ['역삼동', '삼성동', '대치동', '개포동', '청담동'],
    aptNames: ['래미안', '아이파크', '자이', '힐스테이트', '더샵', '롯데캐슬'],
    priceBase: 280000,
    depositBase: 180000,
  },
  {
    name: '서초구',
    code: '11650',
    dongs: ['반포동', '잠원동', '방배동', '서초동', '양재동'],
    aptNames: ['반포자이', '아크로리버파크', '래미안퍼스티지', '센트레빌', '롯데캐슬'],
    priceBase: 260000,
    depositBase: 170000,
  },
  {
    name: '송파구',
    code: '11710',
    dongs: ['잠실동', '가락동', '문정동', '거여동', '마천동'],
    aptNames: ['잠실엘스', '리센츠', '트리지움', '파크리오', '헬리오시티'],
    priceBase: 200000,
    depositBase: 130000,
  },
  {
    name: '마포구',
    code: '11440',
    dongs: ['공덕동', '아현동', '망원동', '합정동', '상암동'],
    aptNames: ['마포래미안', '공덕자이', '아현아이파크', '마포더클래시', '상암월드컵파크'],
    priceBase: 140000,
    depositBase: 90000,
  },
  {
    name: '용산구',
    code: '11170',
    dongs: ['한남동', '이촌동', '서빙고동', '후암동', '청파동'],
    aptNames: ['한남더힐', '이촌한가람', '용산파크자이', '래미안첼리투스', '유엔빌리지'],
    priceBase: 220000,
    depositBase: 140000,
  },
  {
    name: '성동구',
    code: '11200',
    dongs: ['성수동', '왕십리동', '옥수동', '금호동', '응봉동'],
    aptNames: ['힐스테이트서울숲', '트리마제', '갤러리아포레', '옥수파크힐스', '금호두산위브'],
    priceBase: 130000,
    depositBase: 85000,
  },
  {
    name: '광진구',
    code: '11215',
    dongs: ['광장동', '구의동', '자양동', '화양동', '중곡동'],
    aptNames: ['워커힐', '광장힐스테이트', '자양한신', '구의자이', '더퍼스트'],
    priceBase: 110000,
    depositBase: 72000,
  },
  {
    name: '노원구',
    code: '11350',
    dongs: ['상계동', '중계동', '하계동', '월계동', '공릉동'],
    aptNames: ['상계주공', '중계그린', '태릉우성', '노원이편한세상', '공릉래미안'],
    priceBase: 70000,
    depositBase: 45000,
  },
]

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function rand(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function randFloat(min: number, max: number, decimals = 2): number {
  return parseFloat((Math.random() * (max - min) + min).toFixed(decimals))
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

/** Format number with Korean comma style */
function fmt(n: number): string {
  return n.toLocaleString('ko-KR')
}

function findDistrict(lawd: string) {
  return SEOUL_DISTRICTS.find((d) => d.code === lawd) ?? SEOUL_DISTRICTS[0]
}

// Common area sizes (㎡) for apartments
const AREA_SIZES = [33.06, 49.58, 59.99, 74.99, 84.98, 101.29, 114.99, 134.98]

// ---------------------------------------------------------------------------
// Mock generators
// ---------------------------------------------------------------------------

/**
 * Generate 10-30 realistic apartment trade records for a given lawd + yearMonth.
 */
export function mockTradeData(lawd: string, yearMonth: string): MCPTradeRaw[] {
  const district = findDistrict(lawd)
  const year = yearMonth.slice(0, 4)
  const month = yearMonth.slice(4, 6)
  const count = rand(10, 30)

  return Array.from({ length: count }, (): MCPTradeRaw => {
    const area = pick(AREA_SIZES)
    // Price scales roughly with area vs 84.98 baseline
    const areaRatio = area / 84.98
    const basePrice = district.priceBase * areaRatio
    const price = rand(
      Math.floor(basePrice * 0.8),
      Math.floor(basePrice * 1.25),
    )

    return {
      거래금액: fmt(price),
      년: year,
      월: month,
      일: String(rand(1, 28)).padStart(2, '0'),
      법정동: pick(district.dongs),
      아파트: pick(district.aptNames),
      전용면적: String(randFloat(area - 5, area + 5)),
      층: String(rand(1, 30)),
      지번: `${rand(1, 999)}-${rand(1, 20)}`,
      건축년도: String(rand(1990, 2023)),
    }
  })
}

/**
 * Generate 10-30 realistic rent records for a given lawd + yearMonth.
 */
export function mockRentData(lawd: string, yearMonth: string): MCPRentRaw[] {
  const district = findDistrict(lawd)
  const year = yearMonth.slice(0, 4)
  const month = yearMonth.slice(4, 6)
  const count = rand(10, 30)

  return Array.from({ length: count }, (): MCPRentRaw => {
    const area = pick(AREA_SIZES)
    const areaRatio = area / 84.98
    const baseDeposit = district.depositBase * areaRatio

    // ~60% jeonse, ~40% monthly
    const isJeonse = Math.random() < 0.6
    const deposit = rand(
      Math.floor(baseDeposit * 0.75),
      Math.floor(baseDeposit * 1.3),
    )
    const monthlyRent = isJeonse ? 0 : rand(50, 300)

    return {
      보증금액: fmt(deposit),
      월세금액: fmt(monthlyRent),
      년: year,
      월: month,
      일: String(rand(1, 28)).padStart(2, '0'),
      법정동: pick(district.dongs),
      아파트: pick(district.aptNames),
      전용면적: String(randFloat(area - 5, area + 5)),
      층: String(rand(1, 30)),
      지번: `${rand(1, 999)}-${rand(1, 20)}`,
      건축년도: String(rand(1990, 2023)),
    }
  })
}

/**
 * Return matching Seoul 구 codes for a query string.
 * Matches on 구 name (e.g. "강남" matches "강남구").
 */
export function mockRegionCodes(query: string): MCPRegionCodeRaw[] {
  const normalized = query.trim()

  const matches = SEOUL_DISTRICTS.filter(
    (d) =>
      d.name.includes(normalized) ||
      d.code.startsWith(normalized),
  )

  // If no specific match, return top 5
  const source = matches.length > 0 ? matches : SEOUL_DISTRICTS.slice(0, 5)

  return source.map((d): MCPRegionCodeRaw => ({
    법정동코드: d.code,
    법정동명: `서울특별시 ${d.name}`,
    폐지여부: '존재',
  }))
}
