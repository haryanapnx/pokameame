import 'server-only'

import { cacheLife, cacheTag } from 'next/cache'

import { CACHE_LIFE, berryDetailTag, berryIndexTag, berryListTag } from '../data/cache'
import { mapWithConcurrency } from '../data/concurrency'
import { createCustomBerryRepository, type CustomBerryRecord } from '../data/custom'
import { DEFAULT_PAGE_SIZE, type Paginated } from '../data/pagination'
import {
  toBerryDetail,
  toBerrySummary,
  toCustomBerryDetail,
  toCustomBerrySummary,
} from '../domain/berry/mappers'
import type { BerryDetail, BerrySummary } from '../domain/berry/types'
import type { CatalogSuggestion } from '../domain/catalog'
import type { EntityOrigin } from '../domain/types'
import { filterCatalog, mergeCatalog, selectCatalogPage } from './catalog'
import { getBerryIndex, getRawBerry } from './berry-reads'
import { getQueryable } from './db'

/** Merged, searchable and paginated Berry list; custom entries override upstream ones. */
export async function listBerryCatalog(params: {
  page: number
  query?: string
  pageSize?: number
}): Promise<Paginated<BerrySummary>> {
  'use cache'
  cacheLife(CACHE_LIFE.list)
  cacheTag(berryListTag())

  const pageSize = params.pageSize ?? DEFAULT_PAGE_SIZE
  const [index, customRecords] = await Promise.all([
    getBerryIndex(),
    createCustomBerryRepository(getQueryable()).list(),
  ])

  const entries = filterCatalog(
    mergeCatalog(
      index.results.map((resource) => resource.name),
      customRecords,
    ),
    params.query,
  )
  const page = selectCatalogPage(entries, params.page, pageSize)

  const items = await mapWithConcurrency(
    page.items,
    8,
    (entry: { custom?: CustomBerryRecord; name: string; origin: EntityOrigin }) =>
      entry.custom
        ? Promise.resolve(toCustomBerrySummary(entry.custom.payload, entry.custom.id))
        : getRawBerry(entry.name).then((raw) => (raw ? toBerrySummary(raw) : null)),
  )

  // Names come from the cached index, so a miss is only possible if upstream dropped an entry.
  return { ...page, items: items.filter((item): item is BerrySummary => item !== null) }
}

/** Name suggestions for the berry search box, read from the cached index. */
export async function searchBerryNames(query: string, limit = 8): Promise<CatalogSuggestion[]> {
  'use cache'
  cacheLife(CACHE_LIFE.index)
  cacheTag(berryIndexTag(), berryListTag())

  if (query.trim() === '') return []

  const [index, customRecords] = await Promise.all([
    getBerryIndex(),
    createCustomBerryRepository(getQueryable()).list(),
  ])

  const entries = filterCatalog(
    mergeCatalog(
      index.results.map((resource) => resource.name),
      customRecords,
    ),
    query,
  )

  return entries
    .slice(0, Math.max(0, limit))
    .map((entry) =>
      entry.custom
        ? { name: entry.name, origin: entry.origin, id: entry.custom.id }
        : { name: entry.name, origin: entry.origin },
    )
}

/** Detail for a custom or upstream berry; custom records win, unknown names return null. */
export async function getBerryDetail(idOrName: string | number): Promise<BerryDetail | null> {
  'use cache'
  cacheLife(CACHE_LIFE.detail)
  cacheTag(berryListTag(), berryDetailTag(idOrName))

  const custom = await createCustomBerryRepository(getQueryable()).findByName(String(idOrName))
  if (custom) return toCustomBerryDetail(custom.payload, custom.id)

  const raw = await getRawBerry(idOrName)

  return raw ? toBerryDetail(raw) : null
}
