/** 공통 API 응답 래퍼 */
export interface ApiResponse<T> {
  data: T
  success: boolean
  /** ISO 8601 */
  timestamp: string
}

/** API 에러 응답 */
export interface ApiError {
  error: string
  code?: string
  status: number
}

/** 페이지네이션 응답 */
export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}
