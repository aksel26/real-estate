import { z } from 'zod'

/** 5-digit lawd code (시군구) */
export const lawdSchema = z
  .string()
  .length(5, '법정동 코드는 5자리여야 합니다')
  .regex(/^\d{5}$/, '법정동 코드는 숫자 5자리여야 합니다')

/** YYYYMM with valid month 01-12 */
export const yearMonthSchema = z
  .string()
  .length(6, '연월은 6자리(YYYYMM)여야 합니다')
  .regex(/^\d{6}$/, '연월은 숫자 6자리여야 합니다')
  .refine((val) => {
    const month = parseInt(val.slice(4, 6), 10)
    return month >= 1 && month <= 12
  }, '유효한 월(01~12)이 아닙니다')

/** apartment | officetel | rowhouse */
export const propertyTypeSchema = z.enum(['apartment', 'officetel', 'rowhouse'], {
  message: '유형은 apartment, officetel, rowhouse 중 하나여야 합니다',
})

/** 1-12 months */
export const monthsSchema = z.coerce
  .number()
  .int()
  .min(1, '최소 1개월 이상이어야 합니다')
  .max(12, '최대 12개월까지 조회 가능합니다')

/** Region search query — at least 2 chars */
export const regionQuerySchema = z
  .string()
  .min(2, '검색어는 2자 이상이어야 합니다')
  .max(50, '검색어가 너무 깁니다')

// ---------------------------------------------------------------------------
// Compound schemas used by route handlers
// ---------------------------------------------------------------------------

export const tradesQuerySchema = z.object({
  type: propertyTypeSchema,
  lawd: lawdSchema,
  ym: yearMonthSchema,
})

export const rentsQuerySchema = z.object({
  type: propertyTypeSchema,
  lawd: lawdSchema,
  ym: yearMonthSchema,
})

export const reportQuerySchema = z.object({
  type: propertyTypeSchema,
  lawd: lawdSchema,
  months: monthsSchema.default(6),
})

export const regionCodeQuerySchema = z.object({
  q: regionQuerySchema,
})
