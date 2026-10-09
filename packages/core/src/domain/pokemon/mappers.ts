import type { EntityOrigin } from '../types'
import type { RawPokemon } from './schemas'
import type { CustomPokemonInput, PokemonDetail, PokemonSummary } from './types'

export function toPokemonSummary(
  raw: RawPokemon,
  origin: EntityOrigin = 'pokeapi',
): PokemonSummary {
  return {
    id: raw.id,
    name: raw.name,
    spriteUrl: raw.sprites.front_default,
    types: raw.types.map((slot) => slot.type.name),
    origin,
  }
}

export function toPokemonDetail(raw: RawPokemon, origin: EntityOrigin = 'pokeapi'): PokemonDetail {
  return {
    ...toPokemonSummary(raw, origin),
    artworkUrl: raw.sprites.other?.['official-artwork']?.front_default ?? null,
    height: raw.height,
    weight: raw.weight,
    baseExperience: raw.base_experience,
    abilities: raw.abilities.map((entry) => ({
      name: entry.ability.name,
      isHidden: entry.is_hidden === true,
    })),
    stats: raw.stats.map((entry) => ({ name: entry.stat.name, value: entry.base_stat })),
  }
}

/** Builds a domain detail model from a user-created Pokemon record. */
export function toCustomPokemonDetail(input: CustomPokemonInput, id: number): PokemonDetail {
  return {
    id,
    name: input.name,
    spriteUrl: null,
    types: input.types,
    origin: 'custom',
    artworkUrl: null,
    height: input.height ?? 0,
    weight: input.weight ?? 0,
    baseExperience: input.baseExperience ?? null,
    abilities: input.abilities,
    stats: input.stats,
  }
}

/** Builds a domain summary model from a user-created Pokemon record. */
export function toCustomPokemonSummary(input: CustomPokemonInput, id: number): PokemonSummary {
  const detail = toCustomPokemonDetail(input, id)

  return {
    id: detail.id,
    name: detail.name,
    spriteUrl: detail.spriteUrl,
    types: detail.types,
    origin: detail.origin,
  }
}
