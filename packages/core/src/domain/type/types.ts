/** Defensive damage relations, as returned by `/type/{id or name}`. */
export type TypeDamageRelations = {
  doubleDamageFrom: string[]
  halfDamageFrom: string[]
  noDamageFrom: string[]
}

export type TypeDetail = {
  id: number
  name: string
  damageRelations: TypeDamageRelations
}

/** Combined effectiveness of one attacking type against a Pokemon's typing. */
export type TypeMultiplier = {
  type: string
  multiplier: number
}

export type DefensiveMatchups = {
  weakTo: TypeMultiplier[]
  resistantTo: TypeMultiplier[]
  immuneTo: string[]
}
