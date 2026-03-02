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
  return raw.map(normalizeRegionCode)
}
