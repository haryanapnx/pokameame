import { useQuery, type UseQueryResult } from '@tanstack/react-query'

import type { CatalogKind, CatalogSuggestion } from '../domain/catalog'
import { queryKeys } from './query-keys'

export type CatalogSearchOptions = {
  /** Zone Route Handler, e.g. `/api/pokemon/search`. */
  endpoint: string
  kind: CatalogKind
  query: string
  limit?: number
  enabled?: boolean
}

function parseSuggestions(payload: unknown): CatalogSuggestion[] {
  if (!Array.isArray(payload)) return []

  const suggestions: CatalogSuggestion[] = []

  for (const entry of payload) {
    if (typeof entry !== 'object' || entry === null) continue

    const record = entry as Record<string, unknown>
    if (typeof record.name !== 'string' || record.name === '') continue

    const suggestion: CatalogSuggestion = {
      name: record.name,
      origin: record.origin === 'custom' ? 'custom' : 'pokeapi',
    }
    if (typeof record.id === 'number') suggestion.id = record.id

    suggestions.push(suggestion)
  }

  return suggestions
}

async function fetchSuggestions(
  endpoint: string,
  query: string,
  limit: number,
): Promise<CatalogSuggestion[]> {
  const params = new URLSearchParams({ q: query, limit: String(limit) })
  const response = await fetch(`${endpoint}?${params.toString()}`)

  if (!response.ok) {
    throw new Error(`Search request failed (${response.status})`)
  }

  return parseSuggestions(await response.json())
}

/**
 * Search suggestions for the autocomplete island. Disabled while the query is blank, so an empty
 * box never hits the Route Handler.
 */
export function useCatalogSearch({
  endpoint,
  kind,
  query,
  limit = 8,
  enabled,
}: CatalogSearchOptions): UseQueryResult<CatalogSuggestion[], Error> {
  const term = query.trim()

  return useQuery({
    queryKey: queryKeys.search(kind, term),
    queryFn: () => fetchSuggestions(endpoint, term, limit),
    enabled: (enabled ?? true) && term.length > 0,
  })
}
