import { NextResponse } from 'next/server'
import { z } from 'zod'
import { regionCodeQuerySchema } from '@/lib/api/validation'
import { searchRegionCodes } from '@/lib/api/regionCode'
import { MCPError } from '@/lib/mcp/errors'
import type { ApiResponse, ApiError } from '@/types'

export async function GET(request: Request): Promise<NextResponse> {
  // Parse query params
  const { searchParams } = new URL(request.url)
  const raw = { q: searchParams.get('q') ?? '' }

  // Validate
  const parsed = regionCodeQuerySchema.safeParse(raw)
  if (!parsed.success) {
    const err: ApiError = {
      error: parsed.error.issues[0]?.message ?? '잘못된 요청입니다',
      code: 'VALIDATION_ERROR',
      status: 400,
    }
    return NextResponse.json(err, { status: 400 })
  }

  try {
    const candidates = await searchRegionCodes(parsed.data.q)

    const body: ApiResponse<typeof candidates> = {
      data: candidates,
      success: true,
      timestamp: new Date().toISOString(),
    }
    return NextResponse.json(body)
  } catch (err) {
    if (err instanceof MCPError) {
      const apiErr: ApiError = {
        error: err.message,
        code: err.code,
        status: err.statusCode,
      }
      return NextResponse.json(apiErr, { status: err.statusCode })
    }

    const apiErr: ApiError = {
      error: '서버 오류가 발생했습니다',
      code: 'INTERNAL_ERROR',
      status: 500,
    }
    return NextResponse.json(apiErr, { status: 500 })
  }
}
