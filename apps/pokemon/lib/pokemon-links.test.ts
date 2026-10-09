import { buildPokemonListHref } from './pokemon-links'

describe('buildPokemonListHref', () => {
  it('returns the bare list path for page 1 without a query', () => {
    expect(buildPokemonListHref(1)).toBe('/pokemon')
  })

  it('includes the page only when it is above 1', () => {
    expect(buildPokemonListHref(3)).toBe('/pokemon?page=3')
  })

  it('includes a trimmed query', () => {
    expect(buildPokemonListHref(1, ' pika ')).toBe('/pokemon?q=pika')
  })

  it('combines query and page', () => {
    expect(buildPokemonListHref(2, 'pika')).toBe('/pokemon?q=pika&page=2')
  })

  it('ignores a blank query', () => {
    expect(buildPokemonListHref(1, '   ')).toBe('/pokemon')
  })
})
