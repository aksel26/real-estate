/**
 * Server-side region code logic.
 * Calls MCP client and normalizes results.
 */
import { fetchRegionCode } from '@/lib/mcp/client'
import { normalizeRegionCode } from '@/lib/mcp/normalizer'
import type { RegionCandidate } from '@/types/region'

/**
 * Search for region candidates by query.
 * @param query User search string (min 2 chars, already validated)
 * @returns Normalized region candidates
 */
export async function searchRegionCodes(query: string): Promise<RegionCandidate[]> {
  const raw = await fetchRegionCode(query)

  // Filter out 폐지 (废止) records if the field is present
  const active = raw.filter((r) => !r.폐지여부 || r.폐지여부 === '존재')

  return active.map(normalizeRegionCode)
}
