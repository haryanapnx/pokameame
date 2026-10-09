import { asArray, asNumber, asString, fail, isRecord } from '../schemas'

export type RawAbilityEffectEntry = {
  short_effect: string
  language: { name: string }
}

export type RawAbility = {
  id: number
  name: string
  generation: { name: string } | null
  effect_entries: RawAbilityEffectEntry[]
}

function parseEffectEntry(value: unknown, index: number): RawAbilityEffectEntry {
  if (!isRecord(value) || !isRecord(value.language)) fail(`effect_entries[${index}]`)

  return {
    short_effect: asString(value.short_effect, `effect_entries[${index}].short_effect`),
    language: { name: asString(value.language.name, `effect_entries[${index}].language.name`) },
  }
}

/** Validates and narrows an unknown PokeAPI ability payload. */
export function parseRawAbility(input: unknown): RawAbility {
  if (!isRecord(input)) fail('ability (not an object)')

  const generation = input.generation

  return {
    id: asNumber(input.id, 'id'),
    name: asString(input.name, 'name'),
    generation: isRecord(generation)
      ? { name: asString(generation.name, 'generation.name') }
      : null,
    effect_entries: asArray(input.effect_entries, 'effect_entries').map(parseEffectEntry),
  }
}
