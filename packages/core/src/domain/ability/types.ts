/** Ability details from `/ability/{id or name}`, joined with the Pokemon's own ability entry. */
export type AbilityDetail = {
  id: number
  name: string
  /** `short_effect` from the English effect entry. */
  effect: string | null
  generation: string | null
}

export type PokemonAbilityInfo = {
  name: string
  isHidden: boolean
  effect: string | null
  generation: string | null
}
