import {
  isRecord,
  readName,
  readNumber,
  readOptionalNumber,
  readOptionalString,
  readString,
  type ValidationIssue,
  type ValidationResult,
} from '../validation'
import type { BerryFlavor, CustomBerryInput } from './types'

const MAX_POTENCY = 40
const MAX_GROWTH_HOURS = 168
const MAX_PROPERTY = 255

function validateFlavors(value: unknown, issues: ValidationIssue[]): BerryFlavor[] {
  if (!Array.isArray(value) || value.length === 0) {
    issues.push({ field: 'flavors', message: 'Add at least one flavor' })
    return []
  }

  const flavors: BerryFlavor[] = []

  value.forEach((entry, index) => {
    if (!isRecord(entry) || typeof entry.name !== 'string' || entry.name.trim() === '') {
      issues.push({ field: `flavors.${index}.name`, message: 'Flavor name is required' })
      return
    }

    flavors.push({
      name: entry.name.trim().toLowerCase(),
      potency: readNumber(entry.potency, issues, `flavors.${index}.potency`, 'Potency', {
        min: 0,
        max: MAX_POTENCY,
        integer: true,
      }),
    })
  })

  return flavors
}

/** Validates and normalises an unknown custom-Berry payload. */
export function validateCustomBerryInput(input: unknown): ValidationResult<CustomBerryInput> {
  if (!isRecord(input)) {
    return { ok: false, issues: [{ field: 'form', message: 'Expected an object' }] }
  }

  const issues: ValidationIssue[] = []

  const name = readName(input.name, issues)
  const firmness = readString(input.firmness, issues, 'firmness', 'Firmness')
  const growthTime = readNumber(input.growthTime, issues, 'growthTime', 'Growth time', {
    min: 0,
    max: MAX_GROWTH_HOURS,
    integer: true,
  })
  const flavors = validateFlavors(input.flavors, issues)
  const maxHarvest = readOptionalNumber(input.maxHarvest, issues, 'maxHarvest', 'Max harvest', {
    min: 0,
    max: 100,
    integer: true,
  })
  const naturalGiftPower = readOptionalNumber(
    input.naturalGiftPower,
    issues,
    'naturalGiftPower',
    'Natural gift power',
    { min: 0, max: MAX_PROPERTY, integer: true },
  )
  const size = readOptionalNumber(input.size, issues, 'size', 'Size', {
    min: 0,
    max: MAX_PROPERTY,
  })
  const smoothness = readOptionalNumber(input.smoothness, issues, 'smoothness', 'Smoothness', {
    min: 0,
    max: MAX_PROPERTY,
    integer: true,
  })
  const soilDryness = readOptionalNumber(input.soilDryness, issues, 'soilDryness', 'Soil dryness', {
    min: 0,
    max: MAX_PROPERTY,
    integer: true,
  })
  const naturalGiftType = readOptionalString(
    input.naturalGiftType,
    issues,
    'naturalGiftType',
    'Natural gift type',
  )
  const itemName = readOptionalString(input.itemName, issues, 'itemName', 'Item name')

  if (issues.length > 0) return { ok: false, issues }

  return {
    ok: true,
    value: {
      name,
      firmness,
      growthTime,
      flavors,
      ...(maxHarvest !== undefined ? { maxHarvest } : {}),
      ...(naturalGiftPower !== undefined ? { naturalGiftPower } : {}),
      ...(size !== undefined ? { size } : {}),
      ...(smoothness !== undefined ? { smoothness } : {}),
      ...(soilDryness !== undefined ? { soilDryness } : {}),
      naturalGiftType: naturalGiftType ?? null,
      itemName: itemName ?? null,
    },
  }
}
