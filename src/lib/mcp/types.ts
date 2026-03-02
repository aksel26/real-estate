/**
 * Raw MCP response types — before normalization.
 * Field names match the actual MCP server tool output (English snake_case).
 */

/** 매매 거래 원시 응답 아이템 */
export interface MCPTradeRaw {
  /** 단지명 (아파트: apt_name, 오피스텔/빌라: unit_name) */
  apt_name?: string
  unit_name?: string
  /** 법정동 이름 "역삼동" */
  dong: string
  /** 전용면적 (㎡) */
  area_sqm: number
  /** 층 */
  floor: number
  /** 거래금액 (만원) */
  price_10k: number
  /** 거래일 "2026-01-15" */
  trade_date: string
  /** 건축년도 */
  build_year: number
  /** 거래유형 */
  deal_type?: string
  /** 주택유형 (빌라/단독) */
  house_type?: string
}

/** 전월세 거래 원시 응답 아이템 */
export interface MCPRentRaw {
  /** 단지명 */
  unit_name: string
  /** 법정동 이름 */
  dong: string
  /** 전용면적 (㎡) */
  area_sqm: number
  /** 층 */
  floor: number
  /** 보증금 (만원) */
  deposit_10k: number
  /** 월세 (만원, 전세면 0) */
  monthly_rent_10k: number
  /** 계약유형 */
  contract_type?: string
  /** 거래일 "2026-01-15" */
  trade_date: string
  /** 건축년도 */
  build_year: number
  /** 주택유형 (빌라/단독) */
  house_type?: string
}

/** 법정동 코드 원시 응답 (matches 배열 아이템) */
export interface MCPRegionCodeRaw {
  /** 법정동 코드 (10자리) */
  code: string
  /** 법정동명 "서울특별시 강남구" */
  name: string
}
