export type QueryParamUpdates = Record<string, string | number | null | undefined>

/**
 * Merges `updates` into an existing query string. `null`, `undefined` and `''` remove the key,
 * so callers can clear `page` when starting a new search.
 */
export function buildQueryHref(
  pathname: string,
  currentQuery: string,
  updates: QueryParamUpdates,
): string {
  const params = new URLSearchParams(currentQuery)

  for (const [key, value] of Object.entries(updates)) {
    if (value === null || value === undefined || value === '') {
      params.delete(key)
    } else {
      params.set(key, String(value))
    }
  }

  const query = params.toString()
  return query === '' ? pathname : `${pathname}?${query}`
}
