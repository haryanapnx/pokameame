import 'server-only'

import { cacheLife, cacheTag } from 'next/cache'

import { createAbilityApi } from '../api/ability-api'
import { abilityIndexTag, abilityTag, CACHE_LIFE, pokemonListTag } from '../data/cache'
import { toAbilityDetail } from '../domain/ability/mappers'
import type { RawAbility } from '../domain/ability/schemas'
import type { AbilityDetail } from '../domain/ability/types'
import type { RawListResponse } from '../domain/pokemon/schemas'
import { PokeApiRequestError } from '../errors'

/** Every upstream ability name, cached for one hour — feeds the add-custom form's multi-select. */
export async function getAbilityIndex(): Promise<RawListResponse> {
  'use cache'
  cacheLife(CACHE_LIFE.index)
  cacheTag(abilityIndexTag())

  return createAbilityApi().listAll()
}

/**
 * Raw upstream ability, cached per id/name. An unknown name is a normal `null` result: throwing
 * across the cache boundary surfaces as an error even when the caller handles it.
 */
export async function getRawAbility(idOrName: string | number): Promise<RawAbility | null> {
  'use cache'
  cacheLife(CACHE_LIFE.detail)
  cacheTag(pokemonListTag(), abilityTag(idOrName))

  try {
    return await createAbilityApi().get(idOrName)
  } catch (error) {
    if (error instanceof PokeApiRequestError && error.status === 404) return null
    throw error
  }
}

/** Parsed ability detail; unknown names return null. */
export async function getAbilityDetail(idOrName: string | number): Promise<AbilityDetail | null> {
  'use cache'
  cacheLife(CACHE_LIFE.detail)
  cacheTag(pokemonListTag(), abilityTag(idOrName))

  const raw = await getRawAbility(idOrName)

  return raw ? toAbilityDetail(raw) : null
}
