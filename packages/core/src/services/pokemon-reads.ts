import 'server-only'

import { cacheLife, cacheTag } from 'next/cache'

import { createPokemonApi } from '../api/pokemon-api'
import { CACHE_LIFE, pokemonDetailTag, pokemonIndexTag, pokemonListTag } from '../data/cache'
import { DEFAULT_PAGE_SIZE, toPageSlice, type PageSlice } from '../data/pagination'
import type { RawListResponse, RawPokemon } from '../domain/pokemon/schemas'
import { PokeApiRequestError } from '../errors'

export type PokemonPage = {
  slice: PageSlice
  list: RawListResponse
}

/** Full Pokemon name index (the search source). Cached for one hour. */
export async function getPokemonIndex(): Promise<RawListResponse> {
  'use cache'
  cacheLife(CACHE_LIFE.index)
  cacheTag(pokemonIndexTag())

  return createPokemonApi().listAll()
}

/**
 * Raw upstream Pokemon detail, cached per id/name. An unknown name is a normal `null` result:
 * throwing across the cache boundary surfaces as an error even when the caller handles it.
 */
export async function getRawPokemon(idOrName: string | number): Promise<RawPokemon | null> {
  'use cache'
  cacheLife(CACHE_LIFE.detail)
  cacheTag(pokemonListTag(), pokemonDetailTag(idOrName))

  try {
    return await createPokemonApi().get(idOrName)
  } catch (error) {
    if (error instanceof PokeApiRequestError && error.status === 404) return null
    throw error
  }
}

/** One upstream page of Pokemon. `page`/`pageSize` are arguments so they form part of the cache key. */
export async function getPokemonPage(
  page: number,
  pageSize: number = DEFAULT_PAGE_SIZE,
): Promise<PokemonPage> {
  'use cache'
  cacheLife(CACHE_LIFE.list)
  cacheTag(pokemonListTag())

  const slice = toPageSlice(page, pageSize)
  const list = await createPokemonApi().list({ limit: slice.limit, offset: slice.offset })

  return { slice, list }
}
