import { PokeApiParseError } from '../../errors'

import { parseRawListResponse, parseRawPokemon } from './schemas'

const validRaw = {
  id: 25,
  name: 'pikachu',
  height: 4,
  weight: 60,
  base_experience: 112,
  types: [{ slot: 1, type: { name: 'electric' } }],
  abilities: [{ ability: { name: 'static' }, is_hidden: false }],
  stats: [{ base_stat: 35, stat: { name: 'hp' } }],
  sprites: { front_default: 'https://example.test/pikachu.png' },
}

describe('parseRawPokemon', () => {
  it('parses a valid payload', () => {
    const parsed = parseRawPokemon(validRaw)

    expect(parsed.name).toBe('pikachu')
    expect(parsed.types[0]?.type.name).toBe('electric')
    expect(parsed.sprites.front_default).toBe('https://example.test/pikachu.png')
  })

  it('rejects a non-object payload', () => {
    expect(() => parseRawPokemon(null)).toThrow(PokeApiParseError)
  })

  it('rejects a missing id', () => {
    expect(() => parseRawPokemon({ ...validRaw, id: undefined })).toThrow(PokeApiParseError)
  })

  it('rejects a wrongly typed types field', () => {
    expect(() => parseRawPokemon({ ...validRaw, types: 'electric' })).toThrow(PokeApiParseError)
  })

  it('rejects a malformed ability entry', () => {
    expect(() => parseRawPokemon({ ...validRaw, abilities: [{ ability: {} }] })).toThrow(
      PokeApiParseError,
    )
  })

  it('tolerates absent optional fields', () => {
    const parsed = parseRawPokemon({ ...validRaw, base_experience: null, sprites: {} })

    expect(parsed.base_experience).toBeNull()
    expect(parsed.sprites.front_default).toBeNull()
  })

  it('preserves the hidden-ability flag', () => {
    const parsed = parseRawPokemon({
      ...validRaw,
      abilities: [{ ability: { name: 'lightning-rod' }, is_hidden: true }],
    })

    expect(parsed.abilities[0]?.is_hidden).toBe(true)
  })
})

describe('parseRawListResponse', () => {
  it('parses a list payload', () => {
    const parsed = parseRawListResponse({
      count: 1,
      next: null,
      previous: null,
      results: [{ name: 'pikachu', url: 'https://example.test/pokemon/25' }],
    })

    expect(parsed.count).toBe(1)
    expect(parsed.results[0]?.name).toBe('pikachu')
  })

  it('rejects a payload without a results array', () => {
    expect(() => parseRawListResponse({ count: 1 })).toThrow(PokeApiParseError)
  })
})
