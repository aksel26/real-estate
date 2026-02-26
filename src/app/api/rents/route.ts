import { NextResponse } from 'next/server'
import { rentsQuerySchema } from '@/lib/api/validation'
import { getRentsWithSummary } from '@/lib/api/rents'
import { MCPError } from '@/lib/mcp/errors'
import type { ApiResponse, ApiError } from '@/types'
import type { RentsResponse } from '@/lib/api/rents'

export async function GET(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url)
  const raw = {
    type: searchParams.get('type') ?? '',
    lawd: searchParams.get('lawd') ?? '',
    ym: searchParams.get('ym') ?? '',
  }

  const parsed = rentsQuerySchema.safeParse(raw)
  if (!parsed.success) {
    const err: ApiError = {
      error: parsed.error.issues[0]?.message ?? '잘못된 요청입니다',
      code: 'VALIDATION_ERROR',
      status: 400,
    }
    return NextResponse.json(err, { status: 400 })
  }

  try {
    const { type, lawd, ym } = parsed.data
    const result: RentsResponse = await getRentsWithSummary(type, lawd, ym)

    const body: ApiResponse<RentsResponse> = {
      data: result,
      success: true,
      timestamp: new Date().toISOString(),
    }

    return NextResponse.json(body, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=600',
      },
    })
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
