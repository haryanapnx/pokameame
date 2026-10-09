import { buildBerryListHref } from './berry-links'

describe('buildBerryListHref', () => {
  it('returns the bare list path for page 1 without a query', () => {
    expect(buildBerryListHref(1)).toBe('/berries')
  })

  it('includes the page only when it is above 1', () => {
    expect(buildBerryListHref(2)).toBe('/berries?page=2')
  })

  it('includes a trimmed query', () => {
    expect(buildBerryListHref(1, ' cheri ')).toBe('/berries?q=cheri')
  })

  it('combines query and page', () => {
    expect(buildBerryListHref(3, 'cheri')).toBe('/berries?q=cheri&page=3')
  })

  it('ignores a blank query', () => {
    expect(buildBerryListHref(1, '   ')).toBe('/berries')
  })
})
