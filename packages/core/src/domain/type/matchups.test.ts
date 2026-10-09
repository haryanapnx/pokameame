import { computeDefensiveMatchups } from './matchups'
import type { TypeDamageRelations, TypeDetail } from './types'

function type(name: string, relations: Partial<TypeDamageRelations> = {}): TypeDetail {
  return {
    id: 1,
    name,
    damageRelations: { doubleDamageFrom: [], halfDamageFrom: [], noDamageFrom: [], ...relations },
  }
}

describe('computeDefensiveMatchups', () => {
  it('lists what a single type is weak and resistant to, sorted by name', () => {
    const matchups = computeDefensiveMatchups([
      type('grass', {
        doubleDamageFrom: ['ice', 'fire'],
        halfDamageFrom: ['water', 'grass'],
      }),
    ])

    expect(matchups.weakTo).toEqual([
      { type: 'fire', multiplier: 2 },
      { type: 'ice', multiplier: 2 },
    ])
    expect(matchups.resistantTo).toEqual([
      { type: 'grass', multiplier: 0.5 },
      { type: 'water', multiplier: 0.5 },
    ])
    expect(matchups.immuneTo).toEqual([])
  })

  it('multiplies dual typings', () => {
    const matchups = computeDefensiveMatchups([
      type('grass', { doubleDamageFrom: ['fire'], halfDamageFrom: ['water'] }),
      type('water', { doubleDamageFrom: ['fire'], halfDamageFrom: ['grass'] }),
    ])

    expect(matchups.weakTo).toEqual([{ type: 'fire', multiplier: 4 }])
    expect(matchups.resistantTo).toEqual([
      { type: 'grass', multiplier: 0.5 },
      { type: 'water', multiplier: 0.5 },
    ])
  })

  it('drops neutral combinations but keeps immunities', () => {
    const matchups = computeDefensiveMatchups([
      type('grass', { doubleDamageFrom: ['fire'], halfDamageFrom: ['grass'] }),
      type('water', { noDamageFrom: ['fire'], halfDamageFrom: ['grass'] }),
    ])

    expect(matchups.weakTo).toEqual([])
    expect(matchups.immuneTo).toEqual(['fire'])
    expect(matchups.resistantTo).toEqual([{ type: 'grass', multiplier: 0.25 }])
  })

  it('orders weaknesses by multiplier, heaviest first', () => {
    const matchups = computeDefensiveMatchups([
      type('a', { doubleDamageFrom: ['rock', 'bug'] }),
      type('b', { doubleDamageFrom: ['bug'] }),
    ])

    expect(matchups.weakTo).toEqual([
      { type: 'bug', multiplier: 4 },
      { type: 'rock', multiplier: 2 },
    ])
  })

  it('handles an empty type list', () => {
    expect(computeDefensiveMatchups([])).toEqual({ weakTo: [], resistantTo: [], immuneTo: [] })
  })
})
