/**
 * MCP Client — server-side only.
 *
 * Set MCP_MODE=mock (default) to use generated mock data.
 * Set MCP_MODE=live to spawn the MCP server via stdio and call tools directly.
 */

import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js'

import type { MCPTradeRaw, MCPRentRaw, MCPRegionCodeRaw } from './types'
import { MCPConnectionError, MCPResponseError, MCPToolError, isRetryable } from './errors'
import { mockTradeData, mockRentData, mockRegionCodes } from './mock'
import type { PropertyType } from '@/types/filter'

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const MCP_MODE = process.env.MCP_MODE ?? 'mock'
const MAX_RETRIES = 3

// ---------------------------------------------------------------------------
// Singleton MCP Client (globalThis to survive Next.js hot-reload)
// ---------------------------------------------------------------------------

const globalForMCP = globalThis as typeof globalThis & { __mcpClient?: Client }

async function getMCPClient(): Promise<Client> {
  if (globalForMCP.__mcpClient) return globalForMCP.__mcpClient

  const command = process.env.MCP_SERVER_COMMAND ?? 'uv'
  const args = (process.env.MCP_SERVER_ARGS ?? '').split(',').filter(Boolean)

  const transport = new StdioClientTransport({
    command,
    args,
    env: {
      ...process.env,
      DATA_GO_KR_API_KEY: process.env.DATA_GO_KR_API_KEY ?? '',
    } as Record<string, string>,
  })

  const client = new Client({ name: 'real-estate-web', version: '0.1.0' })

  try {
    await client.connect(transport)
  } catch (err) {
    throw new MCPConnectionError(
      `${command} ${args.join(' ')}`,
      err instanceof Error ? err : new Error(String(err)),
    )
  }

  globalForMCP.__mcpClient = client
  return client
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Call an MCP tool with retry logic.
 * - `isError: true` responses throw MCPToolError (not retryable).
 * - Connection/transport errors are retried with exponential backoff.
 */
async function callTool<T>(toolName: string, args: Record<string, unknown>): Promise<T> {
  let lastError: unknown

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const client = await getMCPClient()
      const result = await client.callTool({ name: toolName, arguments: args })

      if (result.isError) {
        const msg =
          Array.isArray(result.content) &&
          result.content.length > 0 &&
          result.content[0].type === 'text'
            ? (result.content[0] as { type: 'text'; text: string }).text
            : 'Unknown error'
        throw new MCPToolError(toolName, msg)
      }

      const text =
        Array.isArray(result.content) &&
        result.content.length > 0 &&
        result.content[0].type === 'text'
          ? (result.content[0] as { type: 'text'; text: string }).text
          : null

      if (!text) throw new MCPResponseError(500, 'Empty tool response')

      return JSON.parse(text) as T
    } catch (err) {
      lastError = err
      if (!isRetryable(err) || attempt === MAX_RETRIES) break
      await sleep(Math.min(1000 * 2 ** attempt + Math.random() * 500, 8000))
    }
  }

  throw lastError
}

// ---------------------------------------------------------------------------
// PropertyType → MCP tool name mapping
// ---------------------------------------------------------------------------

const TRADE_TOOLS: Record<PropertyType, string> = {
  apartment: 'get_apartment_trades',
  officetel: 'get_officetel_trades',
  rowhouse: 'get_villa_trades',
}

const RENT_TOOLS: Record<PropertyType, string> = {
  apartment: 'get_apartment_rent',
  officetel: 'get_officetel_rent',
  rowhouse: 'get_villa_rent',
}

// ---------------------------------------------------------------------------
// MCP response wrapper types
// ---------------------------------------------------------------------------

interface MCPTradeResponse {
  total_count: number
  items: MCPTradeRaw[]
  summary: Record<string, unknown>
}

interface MCPRentResponse {
  total_count: number
  items: MCPRentRaw[]
  summary: Record<string, unknown>
}

interface MCPRegionCodeResponse {
  region_code: string
  full_name: string
  matches: MCPRegionCodeRaw[]
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Fetch trade records from MCP.
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
    await sleep(20)
    return mockTradeData(lawd, ym)
  }

  const response = await callTool<MCPTradeResponse>(TRADE_TOOLS[type], {
    region_code: lawd,
    year_month: ym,
  })
  return response.items
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

  const response = await callTool<MCPRentResponse>(RENT_TOOLS[type], {
    region_code: lawd,
    year_month: ym,
  })
  return response.items
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

  const response = await callTool<MCPRegionCodeResponse>('get_region_code', { query })
  return response.matches
}
