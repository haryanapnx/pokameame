import { asArray, asNumber, asString, fail, isRecord } from '../schemas'

export type RawPokemonTypeSlot = {
  type: { name: string }
}

export type RawPokemonAbility = {
  ability: { name: string }
  is_hidden?: boolean
}

export type RawPokemonStat = {
  base_stat: number
  stat: { name: string }
}

export type RawPokemonSprites = {
  front_default: string | null
  other?: { 'official-artwork'?: { front_default?: string | null } }
}

export type RawPokemon = {
  id: number
  name: string
  height: number
  weight: number
  base_experience: number | null
  types: RawPokemonTypeSlot[]
  abilities: RawPokemonAbility[]
  stats: RawPokemonStat[]
  sprites: RawPokemonSprites
}

export type RawNamedResource = {
  name: string
  url: string
}

export type RawListResponse = {
  count: number
  next: string | null
  previous: string | null
  results: RawNamedResource[]
}

function parseSprites(value: unknown): RawPokemonSprites {
  if (!isRecord(value)) fail('sprites')

  const front = value.front_default
  const frontDefault =
    front === null || front === undefined ? null : asString(front, 'sprites.front_default')

  let artwork: string | null = null
  const other = value.other
  if (isRecord(other)) {
    const official = other['official-artwork']
    if (isRecord(official)) {
      const art = official.front_default
      artwork =
        art === null || art === undefined
          ? null
          : asString(art, 'sprites.other.official-artwork.front_default')
    }
  }

  return { front_default: frontDefault, other: { 'official-artwork': { front_default: artwork } } }
}

function parseTypeSlot(value: unknown, index: number): RawPokemonTypeSlot {
  if (!isRecord(value) || !isRecord(value.type)) fail(`types[${index}]`)
  return { type: { name: asString(value.type.name, `types[${index}].type.name`) } }
}

function parseAbility(value: unknown, index: number): RawPokemonAbility {
  if (!isRecord(value) || !isRecord(value.ability)) fail(`abilities[${index}]`)
  return {
    ability: { name: asString(value.ability.name, `abilities[${index}].ability.name`) },
    is_hidden: value.is_hidden === true,
  }
}

function parseStat(value: unknown, index: number): RawPokemonStat {
  if (!isRecord(value) || !isRecord(value.stat)) fail(`stats[${index}]`)
  return {
    base_stat: asNumber(value.base_stat, `stats[${index}].base_stat`),
    stat: { name: asString(value.stat.name, `stats[${index}].stat.name`) },
  }
}

/** Validates and narrows an unknownPokeAPIPokemon payload. Throws {@link PokeApiParseError}. */
export function parseRawPokemon(input: unknown): RawPokemon {
  if (!isRecord(input)) fail('pokemon (not an object)')

  return {
    id: asNumber(input.id, 'id'),
    name: asString(input.name, 'name'),
    height: asNumber(input.height, 'height'),
    weight: asNumber(input.weight, 'weight'),
    base_experience:
      input.base_experience === null || input.base_experience === undefined
        ? null
        : asNumber(input.base_experience, 'base_experience'),
    types: asArray(input.types, 'types').map(parseTypeSlot),
    abilities: asArray(input.abilities, 'abilities').map(parseAbility),
    stats: asArray(input.stats, 'stats').map(parseStat),
    sprites: parseSprites(input.sprites),
  }
}

/** Validates and narrows an unknown PokeAPI list payload. Throws {@link PokeApiParseError}. */
export function parseRawListResponse(input: unknown): RawListResponse {
  if (!isRecord(input)) fail('list (not an object)')

  const results = asArray(input.results, 'results').map((entry, index) => {
    if (!isRecord(entry)) fail(`results[${index}]`)
    return {
      name: asString(entry.name, `results[${index}].name`),
      url: asString(entry.url, `results[${index}].url`),
    }
  })

  return {
    count: asNumber(input.count, 'count'),
    next: input.next === null || input.next === undefined ? null : asString(input.next, 'next'),
    previous:
      input.previous === null || input.previous === undefined
        ? null
        : asString(input.previous, 'previous'),
    results,
  }
}
