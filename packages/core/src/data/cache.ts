/**
 * Cache tags and `cacheLife` profiles for the server read functions.
 * Kept dependency-free so both services and Server Actions can agree on the same strings.
 */
export const CACHE_LIFE = {
  /** Full Pokemon/Berry name index backing search — one hour. */
  index: 'hours',
  /** List pages — short-lived. */
  list: 'minutes',
  /** Detail entries — long-lived. */
  detail: 'max',
} as const

export const CACHE_TAGS = {
  pokemon: 'pokemon',
  berries: 'berries',
  pokemonIndex: 'pokemon-index',
  berryIndex: 'berry-index',
  ability: 'ability',
  abilityIndex: 'ability-index',
  type: 'type',
} as const

export function pokemonListTag(): string {
  return CACHE_TAGS.pokemon
}

export function pokemonIndexTag(): string {
  return CACHE_TAGS.pokemonIndex
}

export function pokemonDetailTag(idOrName: string | number): string {
  return `${CACHE_TAGS.pokemon}:${idOrName}`
}

export function berryListTag(): string {
  return CACHE_TAGS.berries
}

export function berryIndexTag(): string {
  return CACHE_TAGS.berryIndex
}

export function berryDetailTag(idOrName: string | number): string {
  return `${CACHE_TAGS.berries}:${idOrName}`
}

export function abilityTag(idOrName: string | number): string {
  return `${CACHE_TAGS.ability}:${idOrName}`
}

export function abilityIndexTag(): string {
  return CACHE_TAGS.abilityIndex
}

export function typeTag(idOrName: string | number): string {
  return `${CACHE_TAGS.type}:${idOrName}`
}
