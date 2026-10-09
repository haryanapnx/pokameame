import { paginate, type Paginated } from '../data/pagination'
import type { EntityOrigin } from '../domain/types'

export type CatalogEntry<TCustom> = {
  name: string
  origin: EntityOrigin
  custom?: TCustom
}

function normalizeName(name: string): string {
  return name.trim().toLowerCase()
}

export function mergeCatalog<TCustom extends { name: string }>(
  upstreamNames: readonly string[],
  custom: readonly TCustom[],
): CatalogEntry<TCustom>[] {
  const entries: CatalogEntry<TCustom>[] = []
  const seen = new Set<string>()

  for (const record of custom) {
    const key = normalizeName(record.name)
    if (seen.has(key)) continue
    seen.add(key)
    entries.push({ name: record.name, origin: 'custom', custom: record })
  }

  for (const name of upstreamNames) {
    const key = normalizeName(name)
    if (seen.has(key)) continue
    seen.add(key)
    entries.push({ name, origin: 'pokeapi' })
  }

  return entries
}

/** Case-insensitive substring search across the catalog. An empty query returns everything. */
export function filterCatalog<TCustom>(
  entries: readonly CatalogEntry<TCustom>[],
  query?: string,
): CatalogEntry<TCustom>[] {
  const term = query?.trim().toLowerCase()
  if (!term) return [...entries]

  return entries.filter((entry) => normalizeName(entry.name).includes(term))
}

/** Paginates catalog entries with navigation flags. */
export function selectCatalogPage<TCustom>(
  entries: readonly CatalogEntry<TCustom>[],
  page: number,
  pageSize: number,
): Paginated<CatalogEntry<TCustom>> {
  return paginate([...entries], page, pageSize)
}
