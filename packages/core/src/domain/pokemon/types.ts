import type { EntityOrigin } from '../types'

export type PokemonAbility = {
  name: string
  isHidden: boolean
}

export type PokemonStat = {
  name: string
  value: number
}

export type PokemonSummary = {
  id: number
  name: string
  spriteUrl: string | null
  types: string[]
  origin: EntityOrigin
}

export type PokemonDetail = PokemonSummary & {
  artworkUrl: string | null
  /** Decimetres, as returned by PokeAPI. */
  height: number
  /** Hectograms, as returned by PokeAPI. */
  weight: number
  baseExperience: number | null
  abilities: PokemonAbility[]
  stats: PokemonStat[]
}

/** Payload accepted when creating a custom Pokemon. */
export type CustomPokemonInput = {
  name: string
  types: string[]
  abilities: PokemonAbility[]
  stats: PokemonStat[]
  /** Decimetres, as PokeAPI stores it. */
  height?: number
  /** Hectograms, as PokeAPI stores it. */
  weight?: number
  baseExperience?: number
}
