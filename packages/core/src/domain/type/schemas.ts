import { asArray, asNumber, asString, fail, isRecord } from '../schemas'

export type RawTypeRelations = {
  double_damage_from?: { name: string }[]
  half_damage_from?: { name: string }[]
  no_damage_from?: { name: string }[]
}

export type RawTypeDetail = {
  id: number
  name: string
  damage_relations: RawTypeRelations
}

function parseNamedList(value: unknown, what: string): { name: string }[] {
  if (value === undefined || value === null) return []

  return asArray(value, what).map((entry, index) => {
    if (!isRecord(entry)) fail(`${what}[${index}]`)
    return { name: asString(entry.name, `${what}[${index}].name`) }
  })
}

/** Validates and narrows an unknown PokeAPI type payload. */
export function parseRawTypeDetail(input: unknown): RawTypeDetail {
  if (!isRecord(input)) fail('type (not an object)')
  if (!isRecord(input.damage_relations)) fail('damage_relations')

  const relations = input.damage_relations

  return {
    id: asNumber(input.id, 'id'),
    name: asString(input.name, 'name'),
    damage_relations: {
      double_damage_from: parseNamedList(
        relations.double_damage_from,
        'damage_relations.double_damage_from',
      ),
      half_damage_from: parseNamedList(
        relations.half_damage_from,
        'damage_relations.half_damage_from',
      ),
      no_damage_from: parseNamedList(relations.no_damage_from, 'damage_relations.no_damage_from'),
    },
  }
}
