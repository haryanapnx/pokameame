import type { PokemonAbility } from '@poke/core'

export const STAT_KEYS = [
  'hp',
  'attack',
  'defense',
  'special-attack',
  'special-defense',
  'speed',
] as const

export type StatKey = (typeof STAT_KEYS)[number]

export const STAT_LABELS: Record<StatKey, string> = {
  hp: 'HP',
  attack: 'Attack',
  defense: 'Defense',
  'special-attack': 'Sp. Atk',
  'special-defense': 'Sp. Def',
  speed: 'Speed',
}

function readNames(formData: FormData, field: string): string[] {
  return formData
    .getAll(field)
    .filter((value): value is string => typeof value === 'string')
    .map((value) => value.trim())
    .filter((value) => value !== '')
}

/** Abilities picked in the multi-selects; picking one in the hidden list marks it hidden. */
export function readAbilities(formData: FormData): PokemonAbility[] {
  const hidden = new Set(readNames(formData, 'hidden-abilities'))

  return readNames(formData, 'abilities').map((name) => ({ name, isHidden: hidden.has(name) }))
}

const METRES_TO_DECIMETRES = 10
const KILOGRAMS_TO_HECTOGRAMS = 10

function readOptionalNumber(
  formData: FormData,
  field: string,
  scale = 1,
): number | string | undefined {
  const raw = String(formData.get(field) ?? '').trim()
  if (raw === '') return undefined

  const value = Number(raw)

  return Number.isFinite(value) ? value * scale : raw
}

export function toCreatePokemonPayload(formData: FormData): unknown {
  return {
    name: formData.get('name') ?? '',
    types: formData.getAll('types').filter((value): value is string => typeof value === 'string'),
    abilities: readAbilities(formData),
    stats: STAT_KEYS.map((key) => ({
      name: key,
      value: Number(String(formData.get(`stat-${key}`) ?? '')),
    })),
    height: readOptionalNumber(formData, 'height', METRES_TO_DECIMETRES),
    weight: readOptionalNumber(formData, 'weight', KILOGRAMS_TO_HECTOGRAMS),
    baseExperience: readOptionalNumber(formData, 'base-experience'),
  }
}
