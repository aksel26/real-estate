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
  // ── 기존 8개 구 ──
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
  // ── 추가 17개 구 ──
  {
    name: '종로구',
    code: '11110',
    dongs: ['무악동', '평창동', '부암동', '혜화동', '교남동'],
    aptNames: ['경희궁자이', '광화문풍림스페이스본', '종로센트레빌', '인왕산아이파크', '세종래미안', '평창롯데캐슬'],
    priceBase: 130000,
    depositBase: 85000,
  },
  {
    name: '중구',
    code: '11140',
    dongs: ['신당동', '황학동', '을지로동', '충무로동', '약수동'],
    aptNames: ['남산타운', '신당래미안', '약수하이츠', '센트레빌아스테리움', '동대문롯데캐슬', '황학자이'],
    priceBase: 120000,
    depositBase: 78000,
  },
  {
    name: '동대문구',
    code: '11230',
    dongs: ['전농동', '답십리동', '이문동', '청량리동', '회기동'],
    aptNames: ['래미안크레시티', '전농힐스테이트', '답십리이편한세상', '이문아이파크', '청량리롯데캐슬'],
    priceBase: 85000,
    depositBase: 55000,
  },
  {
    name: '중랑구',
    code: '11260',
    dongs: ['면목동', '상봉동', '중화동', '묵동', '신내동'],
    aptNames: ['면목래미안', '상봉더샵', '중화한신', '묵동자이', '신내데시앙포레'],
    priceBase: 65000,
    depositBase: 42000,
  },
  {
    name: '성북구',
    code: '11290',
    dongs: ['길음동', '돈암동', '정릉동', '하월곡동', '장위동'],
    aptNames: ['래미안길음센터피스', '돈암이편한세상', '정릉푸르지오', '길음뉴타운자이', '장위래미안'],
    priceBase: 80000,
    depositBase: 52000,
  },
  {
    name: '강북구',
    code: '11305',
    dongs: ['미아동', '번동', '수유동', '우이동', '삼양동'],
    aptNames: ['미아래미안', 'SK북한산시티', '수유벽산라이브', '번동현대', '삼양힐스테이트'],
    priceBase: 55000,
    depositBase: 36000,
  },
  {
    name: '도봉구',
    code: '11320',
    dongs: ['창동', '쌍문동', '방학동', '도봉동', '삼양사거리동'],
    aptNames: ['창동주공', '쌍문역해링턴', '방학현대', '도봉래미안', '창동푸르지오'],
    priceBase: 60000,
    depositBase: 39000,
  },
  {
    name: '은평구',
    code: '11380',
    dongs: ['녹번동', '불광동', '응암동', '역촌동', '진관동'],
    aptNames: ['백련산힐스테이트', '불광래미안', '녹번역이편한세상', '은평뉴타운자이', '진관푸르지오'],
    priceBase: 75000,
    depositBase: 49000,
  },
  {
    name: '서대문구',
    code: '11410',
    dongs: ['북가좌동', '남가좌동', '연희동', '홍은동', '충현동'],
    aptNames: ['DMC래미안', '가좌자이', '연희파크푸르지오', '홍은벽산', 'e편한세상신촌'],
    priceBase: 90000,
    depositBase: 58000,
  },
  {
    name: '양천구',
    code: '11470',
    dongs: ['목동', '신월동', '신정동', '목1동', '목2동'],
    aptNames: ['목동신시가지', '신월래미안', '신정이편한세상', '목동현대하이페리온', '목동센트레빌', '목동파크자이'],
    priceBase: 100000,
    depositBase: 65000,
  },
  {
    name: '강서구',
    code: '11500',
    dongs: ['화곡동', '등촌동', '가양동', '마곡동', '방화동'],
    aptNames: ['마곡엠밸리', '등촌힐스테이트', '화곡푸르지오', '마곡래미안', '가양이편한세상', '방화현대'],
    priceBase: 80000,
    depositBase: 52000,
  },
  {
    name: '구로구',
    code: '11530',
    dongs: ['구로동', '신도림동', '고척동', '개봉동', '오류동'],
    aptNames: ['신도림디큐브시티', '구로래미안', '고척자이', '개봉푸르지오', '오류현대'],
    priceBase: 75000,
    depositBase: 49000,
  },
  {
    name: '금천구',
    code: '11545',
    dongs: ['시흥동', '독산동', '가산동', '탑동', '삼성동'],
    aptNames: ['독산래미안', '시흥힐스테이트', '가산자이', '금천롯데캐슬', '독산이편한세상'],
    priceBase: 65000,
    depositBase: 42000,
  },
  {
    name: '영등포구',
    code: '11560',
    dongs: ['여의도동', '당산동', '영등포동', '문래동', '양평동'],
    aptNames: ['여의도자이', '당산래미안', '영등포푸르지오', '문래힐스테이트', '아크로타워스퀘어', '당산센트레빌'],
    priceBase: 95000,
    depositBase: 62000,
  },
  {
    name: '동작구',
    code: '11590',
    dongs: ['노량진동', '상도동', '흑석동', '사당동', '대방동'],
    aptNames: ['흑석한강센트레빌', '상도래미안', '사당자이', '노량진이편한세상', '대방힐스테이트', '상도더샵'],
    priceBase: 100000,
    depositBase: 65000,
  },
  {
    name: '관악구',
    code: '11620',
    dongs: ['신림동', '봉천동', '남현동', '대학동', '조원동'],
    aptNames: ['신림래미안', '봉천자이', '관악푸르지오', '남현힐스테이트', '신림이편한세상'],
    priceBase: 70000,
    depositBase: 45000,
  },
  {
    name: '강동구',
    code: '11740',
    dongs: ['명일동', '고덕동', '상일동', '둔촌동', '길동'],
    aptNames: ['고덕래미안', '둔촌주공', '상일힐스테이트', '강동자이', '고덕아르테온', '둔촌올림픽파크에비뉴포레'],
    priceBase: 120000,
    depositBase: 78000,
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
