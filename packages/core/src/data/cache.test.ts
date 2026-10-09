import {
  CACHE_LIFE,
  CACHE_TAGS,
  berryDetailTag,
  berryIndexTag,
  berryListTag,
  pokemonDetailTag,
  pokemonIndexTag,
  pokemonListTag,
} from './cache'

describe('cache tags', () => {
  it('builds list tags', () => {
    expect(pokemonListTag()).toBe('pokemon')
    expect(berryListTag()).toBe('berries')
  })

  it('builds index tags', () => {
    expect(pokemonIndexTag()).toBe('pokemon-index')
    expect(berryIndexTag()).toBe('berry-index')
  })

  it('builds detail tags from a name or id', () => {
    expect(pokemonDetailTag('pikachu')).toBe('pokemon:pikachu')
    expect(pokemonDetailTag(25)).toBe('pokemon:25')
    expect(berryDetailTag('cheri')).toBe('berries:cheri')
  })

  it('keeps tag constants in sync with the helpers', () => {
    expect(pokemonListTag()).toBe(CACHE_TAGS.pokemon)
    expect(berryIndexTag()).toBe(CACHE_TAGS.berryIndex)
  })
})

describe('cache life profiles', () => {
  it('refreshes the search index hourly', () => {
    expect(CACHE_LIFE.index).toBe('hours')
  })

  it('keeps details long-lived and lists short-lived', () => {
    expect(CACHE_LIFE.detail).toBe('max')
    expect(CACHE_LIFE.list).toBe('minutes')
  })
})
