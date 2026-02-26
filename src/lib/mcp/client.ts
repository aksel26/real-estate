/**
 * MCP Client — server-side only.
 *
 * Set MCP_MODE=mock (default) to use generated mock data.
 * Set MCP_MODE=live and MCP_SERVER_URL to proxy requests to the real MCP server.
 */

import type { MCPTradeRaw, MCPRentRaw, MCPRegionCodeRaw } from './types'
import { MCPConnectionError, MCPResponseError, MCPTimeoutError, isRetryable } from './errors'
import { mockTradeData, mockRentData, mockRegionCodes } from './mock'
import type { PropertyType } from '@/types/filter'

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const MCP_MODE = process.env.MCP_MODE ?? 'mock'
const MCP_SERVER_URL = process.env.MCP_SERVER_URL ?? 'http://localhost:3001'
const DEFAULT_TIMEOUT_MS = 10_000
const MAX_RETRIES = 3

// ---------------------------------------------------------------------------
// Retry / timeout helpers
// ---------------------------------------------------------------------------

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Fetch with an AbortController timeout.
 */
async function fetchWithTimeout(
  url: string,
  init: RequestInit,
  timeoutMs = DEFAULT_TIMEOUT_MS,
): Promise<Response> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    return await fetch(url, { ...init, signal: controller.signal })
  } catch (err) {
    if ((err as Error).name === 'AbortError') {
      throw new MCPTimeoutError(timeoutMs)
    }
    throw err
  } finally {
    clearTimeout(timer)
  }
}

/**
 * Perform a fetch with exponential backoff retry.
 */
async function fetchWithRetry<T>(
  url: string,
  init: RequestInit,
  timeoutMs = DEFAULT_TIMEOUT_MS,
): Promise<T> {
  let lastError: unknown

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const res = await fetchWithTimeout(url, init, timeoutMs)

      if (!res.ok) {
        const body = await res.text().catch(() => '')
        throw new MCPResponseError(res.status, body)
      }

      return (await res.json()) as T
    } catch (err) {
      lastError = err

      if (!isRetryable(err) || attempt === MAX_RETRIES) break

      const backoffMs = Math.min(1000 * 2 ** attempt + Math.random() * 500, 8000)
      await sleep(backoffMs)
    }
  }

  // Re-wrap connection-level errors
  if (lastError instanceof MCPTimeoutError || lastError instanceof MCPResponseError) {
    throw lastError
  }
  throw new MCPConnectionError(MCP_SERVER_URL, lastError as Error)
}

// ---------------------------------------------------------------------------
// Live MCP API helpers
// ---------------------------------------------------------------------------

/** Map PropertyType to the MCP server's type string */
function propertyTypeToMCPParam(type: PropertyType): string {
  const map: Record<PropertyType, string> = {
    apartment: 'apt',
    officetel: 'officetel',
    rowhouse: 'rh',
  }
  return map[type]
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Fetch apartment trade records from MCP.
 * @param type Property type
 * @param lawd 5-digit region code
 * @param ym YYYYMM
 */
export async function fetchTrades(
  type: PropertyType,
  lawd: string,
  ym: string,
): Promise<MCPTradeRaw[]> {
  if (MCP_MODE === 'mock') {
    // Simulate a small async delay in mock mode
    await sleep(20)
    return mockTradeData(lawd, ym)
  }

  const url = new URL(`${MCP_SERVER_URL}/api/trades`)
  url.searchParams.set('type', propertyTypeToMCPParam(type))
  url.searchParams.set('LAWD_CD', lawd)
  url.searchParams.set('DEAL_YMD', ym)

  return fetchWithRetry<MCPTradeRaw[]>(url.toString(), { method: 'GET' })
}

/**
 * Fetch rent records (전월세) from MCP.
 * @param type Property type
 * @param lawd 5-digit region code
 * @param ym YYYYMM
 */
export async function fetchRents(
  type: PropertyType,
  lawd: string,
  ym: string,
): Promise<MCPRentRaw[]> {
  if (MCP_MODE === 'mock') {
    await sleep(20)
    return mockRentData(lawd, ym)
  }

  const url = new URL(`${MCP_SERVER_URL}/api/rents`)
  url.searchParams.set('type', propertyTypeToMCPParam(type))
  url.searchParams.set('LAWD_CD', lawd)
  url.searchParams.set('DEAL_YMD', ym)

  return fetchWithRetry<MCPRentRaw[]>(url.toString(), { method: 'GET' })
}

/**
 * Search for region codes by query string.
 * @param query Search term (e.g. "강남")
 */
export async function fetchRegionCode(query: string): Promise<MCPRegionCodeRaw[]> {
  if (MCP_MODE === 'mock') {
    await sleep(10)
    return mockRegionCodes(query)
  }

  const url = new URL(`${MCP_SERVER_URL}/api/region-code`)
  url.searchParams.set('q', query)

  return fetchWithRetry<MCPRegionCodeRaw[]>(url.toString(), { method: 'GET' })
}
