import { PokeApiParseError } from '../../errors'

import { toTypeDetail } from './mappers'
import { parseRawTypeDetail } from './schemas'

const validRaw = {
  id: 12,
  name: 'grass',
  damage_relations: {
    double_damage_from: [{ name: 'fire' }, { name: 'ice' }],
    half_damage_from: [{ name: 'water' }],
    no_damage_from: [],
  },
}

describe('parseRawTypeDetail', () => {
  it('parses the damage relations', () => {
    const parsed = parseRawTypeDetail(validRaw)

    expect(parsed.name).toBe('grass')
    expect(parsed.damage_relations.double_damage_from?.map((entry) => entry.name)).toEqual([
      'fire',
      'ice',
    ])
  })

  it('tolerates missing relation lists', () => {
    const parsed = parseRawTypeDetail({ ...validRaw, damage_relations: {} })

    expect(parsed.damage_relations.half_damage_from).toEqual([])
    expect(parsed.damage_relations.no_damage_from).toEqual([])
  })

  it('rejects a payload without damage relations', () => {
    expect(() => parseRawTypeDetail({ id: 1, name: 'grass' })).toThrow(PokeApiParseError)
    expect(() => parseRawTypeDetail('grass')).toThrow(PokeApiParseError)
  })
})

describe('toTypeDetail', () => {
  it('maps raw relations into the domain shape', () => {
    expect(toTypeDetail(parseRawTypeDetail(validRaw))).toEqual({
      id: 12,
      name: 'grass',
      damageRelations: {
        doubleDamageFrom: ['fire', 'ice'],
        halfDamageFrom: ['water'],
        noDamageFrom: [],
      },
    })
  })
})
