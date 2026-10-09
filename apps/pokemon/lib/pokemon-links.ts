export function buildPokemonListHref(page: number, query?: string): string {
  const params = new URLSearchParams()
  const term = query?.trim()

  if (term) params.set('q', term)
  if (page > 1) params.set('page', String(page))

  const search = params.toString()
  return search === '' ? '/pokemon' : `/pokemon?${search}`
}
