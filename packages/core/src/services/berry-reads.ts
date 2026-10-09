import 'server-only'

import { cacheLife, cacheTag } from 'next/cache'

import { createBerryApi } from '../api/berry-api'
import { CACHE_LIFE, berryDetailTag, berryIndexTag, berryListTag } from '../data/cache'
import { DEFAULT_PAGE_SIZE, toPageSlice, type PageSlice } from '../data/pagination'
import type { RawBerry } from '../domain/berry/schemas'
import type { RawListResponse } from '../domain/pokemon/schemas'
import { PokeApiRequestError } from '../errors'

export type BerryPage = {
  slice: PageSlice
  list: RawListResponse
}

/** Full Berry name index (the search source). Cached for one hour. */
export async function getBerryIndex(): Promise<RawListResponse> {
  'use cache'
  cacheLife(CACHE_LIFE.index)
  cacheTag(berryIndexTag())

  return createBerryApi().listAll()
}

/**
 * Raw upstream Berry detail, cached per id/name. An unknown name is a normal `null` result:
 * throwing across the cache boundary surfaces as an error even when the caller handles it.
 */
export async function getRawBerry(idOrName: string | number): Promise<RawBerry | null> {
  'use cache'
  cacheLife(CACHE_LIFE.detail)
  cacheTag(berryListTag(), berryDetailTag(idOrName))

  try {
    return await createBerryApi().get(idOrName)
  } catch (error) {
    if (error instanceof PokeApiRequestError && error.status === 404) return null
    throw error
  }
}

/** One upstream page of Berries. */
export async function getBerryPage(
  page: number,
  pageSize: number = DEFAULT_PAGE_SIZE,
): Promise<BerryPage> {
  'use cache'
  cacheLife(CACHE_LIFE.list)
  cacheTag(berryListTag())

  const slice = toPageSlice(page, pageSize)
  const list = await createBerryApi().list({ limit: slice.limit, offset: slice.offset })

  return { slice, list }
}
