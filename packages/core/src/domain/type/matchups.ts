import type { DefensiveMatchups, TypeDetail, TypeMultiplier } from './types'

function sortMultipliers(entries: TypeMultiplier[], direction: 'asc' | 'desc'): TypeMultiplier[] {
  return [...entries].sort((a, b) =>
    a.multiplier === b.multiplier
      ? a.type.localeCompare(b.type)
      : direction === 'desc'
        ? b.multiplier - a.multiplier
        : a.multiplier - b.multiplier,
  )
}

/**
 * Combines the defensive damage relations of a Pokemon's types into one effectiveness profile.
 * Dual typings multiply (e.g. 2× and 2× → 4×; 2× and ½× → neutral, so it is dropped).
 */
export function computeDefensiveMatchups(types: TypeDetail[]): DefensiveMatchups {
  const multipliers = new Map<string, number>()

  const apply = (type: string, factor: number) => {
    multipliers.set(type, (multipliers.get(type) ?? 1) * factor)
  }

  for (const type of types) {
    for (const attacker of type.damageRelations.doubleDamageFrom) apply(attacker, 2)
    for (const attacker of type.damageRelations.halfDamageFrom) apply(attacker, 0.5)
    for (const attacker of type.damageRelations.noDamageFrom) apply(attacker, 0)
  }

  const weakTo: TypeMultiplier[] = []
  const resistantTo: TypeMultiplier[] = []
  const immuneTo: string[] = []

  for (const [type, multiplier] of multipliers) {
    if (multiplier === 0) immuneTo.push(type)
    else if (multiplier > 1) weakTo.push({ type, multiplier })
    else if (multiplier < 1) resistantTo.push({ type, multiplier })
  }

  return {
    weakTo: sortMultipliers(weakTo, 'desc'),
    resistantTo: sortMultipliers(resistantTo, 'asc'),
    immuneTo: [...immuneTo].sort((a, b) => a.localeCompare(b)),
  }
}
