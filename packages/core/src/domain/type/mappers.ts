import type { RawTypeDetail } from './schemas'
import type { TypeDetail } from './types'

export function toTypeDetail(raw: RawTypeDetail): TypeDetail {
  return {
    id: raw.id,
    name: raw.name,
    damageRelations: {
      doubleDamageFrom: (raw.damage_relations.double_damage_from ?? []).map((entry) => entry.name),
      halfDamageFrom: (raw.damage_relations.half_damage_from ?? []).map((entry) => entry.name),
      noDamageFrom: (raw.damage_relations.no_damage_from ?? []).map((entry) => entry.name),
    },
  }
}
