import 'server-only'

import { cacheLife, cacheTag } from 'next/cache'

import { CACHE_LIFE, pokemonDetailTag, pokemonIndexTag, pokemonListTag } from '../data/cache'
import { mapWithConcurrency } from '../data/concurrency'
import { createCustomPokemonRepository, type CustomPokemonRecord } from '../data/custom'
import { DEFAULT_PAGE_SIZE, type Paginated } from '../data/pagination'
import type { PokemonAbilityInfo } from '../domain/ability/types'
import type { CatalogSuggestion } from '../domain/catalog'
import {
  toCustomPokemonDetail,
  toCustomPokemonSummary,
  toPokemonDetail,
  toPokemonSummary,
} from '../domain/pokemon/mappers'
import type { PokemonAbility, PokemonDetail, PokemonSummary } from '../domain/pokemon/types'
import { computeDefensiveMatchups } from '../domain/type/matchups'
import type { DefensiveMatchups, TypeDetail } from '../domain/type/types'
import type { EntityOrigin } from '../domain/types'
import { getAbilityDetail } from './ability-reads'
import { filterCatalog, mergeCatalog, selectCatalogPage } from './catalog'
import { getQueryable } from './db'
import { getPokemonIndex, getRawPokemon } from './pokemon-reads'
import { getTypeDetail } from './type-reads'

/**
 * Merged, searchable and paginated Pokemon list — custom entries override upstream ones, and
 * types/sprites for the visible page are fetched with bounded concurrency.
 * `page`/`query` are arguments so they take part in the cache key.
 */
export async function listPokemonCatalog(params: {
  page: number
  query?: string
  pageSize?: number
}): Promise<Paginated<PokemonSummary>> {
  'use cache'
  cacheLife(CACHE_LIFE.list)
  cacheTag(pokemonListTag())

  const pageSize = params.pageSize ?? DEFAULT_PAGE_SIZE
  const [index, customRecords] = await Promise.all([
    getPokemonIndex(),
    createCustomPokemonRepository(getQueryable()).list(),
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
    (entry: { custom?: CustomPokemonRecord; name: string; origin: EntityOrigin }) =>
      entry.custom
        ? Promise.resolve(toCustomPokemonSummary(entry.custom.payload, entry.custom.id))
        : getRawPokemon(entry.name).then((raw) => (raw ? toPokemonSummary(raw) : null)),
  )

  // Names come from the cached index, so a miss is only possible if upstream dropped an entry.
  return { ...page, items: items.filter((item): item is PokemonSummary => item !== null) }
}

/** Name suggestions for the search box, read from the cached index without detail fetches. */
export async function searchPokemonNames(query: string, limit = 8): Promise<CatalogSuggestion[]> {
  'use cache'
  cacheLife(CACHE_LIFE.index)
  cacheTag(pokemonIndexTag(), pokemonListTag())

  if (query.trim() === '') return []

  const [index, customRecords] = await Promise.all([
    getPokemonIndex(),
    createCustomPokemonRepository(getQueryable()).list(),
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

/** Detail for a custom or upstream Pokemon; custom records win, unknown names return null. */
export async function getPokemonDetail(idOrName: string | number): Promise<PokemonDetail | null> {
  'use cache'
  cacheLife(CACHE_LIFE.detail)
  cacheTag(pokemonListTag(), pokemonDetailTag(idOrName))

  const custom = await createCustomPokemonRepository(getQueryable()).findByName(String(idOrName))
  if (custom) return toCustomPokemonDetail(custom.payload, custom.id)

  const raw = await getRawPokemon(idOrName)

  return raw ? toPokemonDetail(raw) : null
}

/**
 * Enriches a Pokemon's abilities with data from `/ability/{name}` (effect text + generation).
 * The hidden flag comes from the Pokemon itself, not the ability resource.
 */
export async function getPokemonAbilities(
  abilities: PokemonAbility[],
): Promise<PokemonAbilityInfo[]> {
  'use cache'
  cacheLife(CACHE_LIFE.detail)
  cacheTag(pokemonListTag())

  const details = await Promise.all(abilities.map((ability) => getAbilityDetail(ability.name)))

  return abilities.map((ability, index) => {
    const detail = details[index]

    return {
      name: ability.name,
      isHidden: ability.isHidden,
      effect: detail?.effect ?? null,
      generation: detail?.generation ?? null,
    }
  })
}

/** Defensive matchups for a Pokemon's typing, derived from each `/type/{name}` damage relations. */
export async function getPokemonTypeMatchups(types: string[]): Promise<DefensiveMatchups> {
  'use cache'
  cacheLife(CACHE_LIFE.detail)
  cacheTag(pokemonListTag())

  const details = await Promise.all(types.map((type) => getTypeDetail(type)))

  return computeDefensiveMatchups(details.filter((detail): detail is TypeDetail => detail !== null))
}
