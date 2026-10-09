import 'server-only'

import { cacheLife, cacheTag } from 'next/cache'

import { createTypeApi } from '../api/type-api'
import { CACHE_LIFE, pokemonListTag, typeTag } from '../data/cache'
import { toTypeDetail } from '../domain/type/mappers'
import type { RawTypeDetail } from '../domain/type/schemas'
import type { TypeDetail } from '../domain/type/types'
import { PokeApiRequestError } from '../errors'

/**
 * Raw upstream type (with damage relations), cached per id/name. An unknown name is a normal
 * `null` result: throwing across the cache boundary surfaces as an error even when handled.
 */
export async function getRawTypeDetail(idOrName: string | number): Promise<RawTypeDetail | null> {
  'use cache'
  cacheLife(CACHE_LIFE.detail)
  cacheTag(pokemonListTag(), typeTag(idOrName))

  try {
    return await createTypeApi().get(idOrName)
  } catch (error) {
    if (error instanceof PokeApiRequestError && error.status === 404) return null
    throw error
  }
}

/** Parsed type detail; unknown names return null. */
export async function getTypeDetail(idOrName: string | number): Promise<TypeDetail | null> {
  'use cache'
  cacheLife(CACHE_LIFE.detail)
  cacheTag(pokemonListTag(), typeTag(idOrName))

  const raw = await getRawTypeDetail(idOrName)

  return raw ? toTypeDetail(raw) : null
}
