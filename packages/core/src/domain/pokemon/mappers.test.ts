import { toCustomPokemonDetail, toPokemonDetail, toPokemonSummary } from './mappers'
import { parseRawPokemon } from './schemas'

const raw = parseRawPokemon({
  id: 25,
  name: 'pikachu',
  height: 4,
  weight: 60,
  base_experience: 112,
  types: [{ type: { name: 'electric' } }],
  abilities: [
    { ability: { name: 'static' }, is_hidden: false },
    { ability: { name: 'lightning-rod' }, is_hidden: true },
  ],
  stats: [
    { base_stat: 35, stat: { name: 'hp' } },
    { base_stat: 55, stat: { name: 'attack' } },
  ],
  sprites: {
    front_default: 'sprite.png',
    other: { 'official-artwork': { front_default: 'artwork.png' } },
  },
})

describe('pokemon mappers', () => {
  it('maps a summary flagged as upstream', () => {
    expect(toPokemonSummary(raw)).toEqual({
      id: 25,
      name: 'pikachu',
      spriteUrl: 'sprite.png',
      types: ['electric'],
      origin: 'pokeapi',
    })
  })

  it('maps a detail with artwork, abilities and stats', () => {
    const detail = toPokemonDetail(raw)

    expect(detail.artworkUrl).toBe('artwork.png')
    expect(detail.baseExperience).toBe(112)
    expect(detail.height).toBe(4)
    expect(detail.weight).toBe(60)
    expect(detail.abilities).toEqual([
      { name: 'static', isHidden: false },
      { name: 'lightning-rod', isHidden: true },
    ])
    expect(detail.stats).toEqual([
      { name: 'hp', value: 35 },
      { name: 'attack', value: 55 },
    ])
  })

  it('falls back to null artwork when absent', () => {
    const detail = toPokemonDetail(parseRawPokemon({ ...raw, sprites: {} }))

    expect(detail.artworkUrl).toBeNull()
    expect(detail.spriteUrl).toBeNull()
  })

  it('builds a custom detail flagged as custom', () => {
    const custom = toCustomPokemonDetail(
      {
        name: 'pikablu',
        types: ['water'],
        abilities: [],
        stats: [{ name: 'hp', value: 10 }],
      },
      9001,
    )

    expect(custom).toMatchObject({
      id: 9001,
      name: 'pikablu',
      origin: 'custom',
      spriteUrl: null,
      artworkUrl: null,
      baseExperience: null,
    })
    expect(custom.types).toEqual(['water'])
  })

  it('carries the optional measurements of a custom Pokemon', () => {
    const custom = toCustomPokemonDetail(
      {
        name: 'pikablu',
        types: ['water'],
        abilities: [],
        stats: [{ name: 'hp', value: 10 }],
        height: 7,
        weight: 69,
        baseExperience: 64,
      },
      9001,
    )

    expect(custom).toMatchObject({ height: 7, weight: 69, baseExperience: 64 })
  })
})
