/**
 * Raw MCP response types — before normalization.
 * Field names match the Korean API field names from the real-estate-mcp server.
 */

/** 매매 거래 원시 응답 */
export interface MCPTradeRaw {
  /** 거래금액 (만원, 콤마 포함 가능 "85,000") */
  거래금액: string
  /** 년도 "2026" */
  년: string
  /** 월 "01" */
  월: string
  /** 일 "15" */
  일: string
  /** 법정동 이름 "역삼동" */
  법정동: string
  /** 단지명 "래미안" */
  아파트: string
  /** 전용면적 (㎡) "84.98" */
  전용면적: string
  /** 층 "12" */
  층: string
  /** 지번 (optional) */
  지번?: string
  /** 건축년도 (optional) */
  건축년도?: string
}

/** 전월세 거래 원시 응답 */
export interface MCPRentRaw {
  /** 보증금 (만원, 콤마 포함 가능 "50,000") */
  보증금액: string
  /** 월세금액 (만원, 전세면 "0") */
  월세금액: string
  /** 년도 "2026" */
  년: string
  /** 월 "01" */
  월: string
  /** 일 "15" */
  일: string
  /** 법정동 이름 */
  법정동: string
  /** 단지명 */
  아파트: string
  /** 전용면적 (㎡) */
  전용면적: string
  /** 층 */
  층: string
  /** 지번 (optional) */
  지번?: string
  /** 건축년도 (optional) */
  건축년도?: string
}

/** 법정동 코드 원시 응답 */
export interface MCPRegionCodeRaw {
  /** 법정동 코드 (5자리 또는 10자리) */
  법정동코드: string
  /** 법정동명 "서울특별시 강남구" */
  법정동명: string
  /** 폐지여부 (optional) "존재" | "폐지" */
  폐지여부?: string
}
