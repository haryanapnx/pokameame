import type { EntityOrigin } from '../types'
import type { RawBerry } from './schemas'
import type { BerryDetail, BerrySummary, CustomBerryInput } from './types'

export function toBerrySummary(raw: RawBerry, origin: EntityOrigin = 'pokeapi'): BerrySummary {
  return {
    id: raw.id,
    name: raw.name,
    firmness: raw.firmness.name,
    growthTime: raw.growth_time,
    origin,
  }
}

export function toBerryDetail(raw: RawBerry, origin: EntityOrigin = 'pokeapi'): BerryDetail {
  return {
    ...toBerrySummary(raw, origin),
    flavors: raw.flavors.map((entry) => ({ name: entry.flavor.name, potency: entry.potency })),
    maxHarvest: raw.max_harvest,
    naturalGiftPower: raw.natural_gift_power,
    naturalGiftType: raw.natural_gift_type?.name ?? null,
    size: raw.size,
    smoothness: raw.smoothness,
    soilDryness: raw.soil_dryness,
    itemName: raw.item?.name ?? null,
  }
}

/** Builds a domain detail model from a user-created berry record. */
export function toCustomBerryDetail(input: CustomBerryInput, id: number): BerryDetail {
  return {
    id,
    name: input.name,
    firmness: input.firmness,
    growthTime: input.growthTime,
    origin: 'custom',
    flavors: input.flavors,
    maxHarvest: input.maxHarvest ?? 0,
    naturalGiftPower: input.naturalGiftPower ?? 0,
    naturalGiftType: input.naturalGiftType ?? null,
    size: input.size ?? 0,
    smoothness: input.smoothness ?? 0,
    soilDryness: input.soilDryness ?? 0,
    itemName: input.itemName ?? null,
  }
}

/** Builds a domain summary model from a user-created berry record. */
export function toCustomBerrySummary(input: CustomBerryInput, id: number): BerrySummary {
  const detail = toCustomBerryDetail(input, id)

  return {
    id: detail.id,
    name: detail.name,
    firmness: detail.firmness,
    growthTime: detail.growthTime,
    origin: detail.origin,
  }
}
