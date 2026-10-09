import {
  isRecord,
  readName,
  readNumber,
  readOptionalNumber,
  slugify,
  type ValidationIssue,
  type ValidationResult,
} from '../validation'
import type { CustomPokemonInput, PokemonAbility, PokemonStat } from './types'

const MAX_TYPES = 2
const MIN_STAT = 1
const MAX_STAT = 255
/** Decimetres — 100 m is well past any Pokemon. */
const MAX_HEIGHT = 1000
/** Hectograms — 1000 kg covers the heaviest Pokemon. */
const MAX_WEIGHT = 10_000
const MAX_BASE_EXPERIENCE = 1000

function validateTypes(value: unknown, issues: ValidationIssue[]): string[] {
  if (!Array.isArray(value) || value.length === 0) {
    issues.push({ field: 'types', message: 'Pick at least one type' })
    return []
  }

  if (value.length > MAX_TYPES) {
    issues.push({ field: 'types', message: `APokemon can have at most ${MAX_TYPES} types` })
  }

  const types = value
    .filter((entry): entry is string => typeof entry === 'string' && entry.trim() !== '')
    .map((entry) => entry.trim().toLowerCase())

  if (types.length !== value.length) {
    issues.push({ field: 'types', message: 'Each type needs a name' })
  }

  return types.slice(0, MAX_TYPES)
}

function validateAbilities(value: unknown, issues: ValidationIssue[]): PokemonAbility[] {
  if (value === undefined || value === null) return []

  if (!Array.isArray(value)) {
    issues.push({ field: 'abilities', message: 'Abilities must be a list' })
    return []
  }

  const abilities: PokemonAbility[] = []

  value.forEach((entry, index) => {
    if (!isRecord(entry) || typeof entry.name !== 'string' || entry.name.trim() === '') {
      issues.push({ field: `abilities.${index}.name`, message: 'Ability name is required' })
      return
    }

    abilities.push({ name: slugify(entry.name), isHidden: entry.isHidden === true })
  })

  return abilities
}

function validateStats(value: unknown, issues: ValidationIssue[]): PokemonStat[] {
  if (!Array.isArray(value) || value.length === 0) {
    issues.push({ field: 'stats', message: 'Add at least one stat' })
    return []
  }

  const stats: PokemonStat[] = []

  value.forEach((entry, index) => {
    if (!isRecord(entry) || typeof entry.name !== 'string' || entry.name.trim() === '') {
      issues.push({ field: `stats.${index}.name`, message: 'Stat name is required' })
      return
    }

    stats.push({
      name: slugify(entry.name),
      value: readNumber(entry.value, issues, `stats.${index}.value`, 'Stat value', {
        min: MIN_STAT,
        max: MAX_STAT,
        integer: true,
      }),
    })
  })

  return stats
}

/** Validates and normalises an unknown custom-Pokemon payload. */
export function validateCustomPokemonInput(input: unknown): ValidationResult<CustomPokemonInput> {
  if (!isRecord(input)) {
    return { ok: false, issues: [{ field: 'form', message: 'Expected an object' }] }
  }

  const issues: ValidationIssue[] = []

  const name = readName(input.name, issues)
  const types = validateTypes(input.types, issues)
  const abilities = validateAbilities(input.abilities, issues)
  const stats = validateStats(input.stats, issues)
  const height = readOptionalNumber(input.height, issues, 'height', 'Height', {
    min: 0,
    max: MAX_HEIGHT,
  })
  const weight = readOptionalNumber(input.weight, issues, 'weight', 'Weight', {
    min: 0,
    max: MAX_WEIGHT,
  })
  const baseExperience = readOptionalNumber(
    input.baseExperience,
    issues,
    'baseExperience',
    'Base experience',
    { min: 0, max: MAX_BASE_EXPERIENCE },
  )

  if (issues.length > 0) return { ok: false, issues }

  return {
    ok: true,
    value: {
      name,
      types,
      abilities,
      stats,
      ...(height !== undefined ? { height } : {}),
      ...(weight !== undefined ? { weight } : {}),
      ...(baseExperience !== undefined ? { baseExperience } : {}),
    },
  }
}
