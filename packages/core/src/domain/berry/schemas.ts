import { asArray, asNumber, asString, fail, isRecord } from '../schemas'

export type RawBerryFlavor = {
  potency: number
  flavor: { name: string }
}

export type RawBerry = {
  id: number
  name: string
  growth_time: number
  max_harvest: number
  natural_gift_power: number
  size: number
  smoothness: number
  soil_dryness: number
  firmness: { name: string }
  flavors: RawBerryFlavor[]
  item: { name: string } | null
  natural_gift_type: { name: string } | null
}

function parseNamedResource(value: unknown, what: string): { name: string } | null {
  if (value === null || value === undefined) return null
  if (!isRecord(value)) fail(what)
  return { name: asString(value.name, `${what}.name`) }
}

function parseFlavor(value: unknown, index: number): RawBerryFlavor {
  if (!isRecord(value) || !isRecord(value.flavor)) fail(`flavors[${index}]`)
  return {
    potency: asNumber(value.potency, `flavors[${index}].potency`),
    flavor: { name: asString(value.flavor.name, `flavors[${index}].flavor.name`) },
  }
}

/** Validates and narrows an unknown PokeAPI berry payload. Throws {@link PokeApiParseError}. */
export function parseRawBerry(input: unknown): RawBerry {
  if (!isRecord(input)) fail('berry (not an object)')
  if (!isRecord(input.firmness)) fail('firmness')

  return {
    id: asNumber(input.id, 'id'),
    name: asString(input.name, 'name'),
    growth_time: asNumber(input.growth_time, 'growth_time'),
    max_harvest: asNumber(input.max_harvest, 'max_harvest'),
    natural_gift_power: asNumber(input.natural_gift_power, 'natural_gift_power'),
    size: asNumber(input.size, 'size'),
    smoothness: asNumber(input.smoothness, 'smoothness'),
    soil_dryness: asNumber(input.soil_dryness, 'soil_dryness'),
    firmness: { name: asString(input.firmness.name, 'firmness.name') },
    flavors: asArray(input.flavors, 'flavors').map(parseFlavor),
    item: parseNamedResource(input.item, 'item'),
    natural_gift_type: parseNamedResource(input.natural_gift_type, 'natural_gift_type'),
  }
}
