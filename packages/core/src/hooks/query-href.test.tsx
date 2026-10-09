import { buildQueryHref } from './query-href'

describe('buildQueryHref', () => {
  it('sets new query parameters', () => {
    expect(buildQueryHref('/pokemon', '', { q: 'pika' })).toBe('/pokemon?q=pika')
  })

  it('merges into the existing query string', () => {
    expect(buildQueryHref('/pokemon', 'page=2&q=bulba', { q: 'pika' })).toBe(
      '/pokemon?page=2&q=pika',
    )
  })

  it('removes keys updated with null, undefined or empty string', () => {
    expect(buildQueryHref('/pokemon', 'page=2&q=bulba', { q: null })).toBe('/pokemon?page=2')
    expect(buildQueryHref('/pokemon', 'page=2&q=bulba', { q: undefined })).toBe('/pokemon?page=2')
    expect(buildQueryHref('/pokemon', 'page=2&q=bulba', { q: '' })).toBe('/pokemon?page=2')
  })

  it('drops the question mark when nothing is left', () => {
    expect(buildQueryHref('/pokemon', 'page=2', { page: null })).toBe('/pokemon')
  })

  it('accepts numeric values', () => {
    expect(buildQueryHref('/pokemon', '', { page: 3 })).toBe('/pokemon?page=3')
  })

  it('can replace several keys at once', () => {
    expect(buildQueryHref('/pokemon', 'page=2&q=bulba', { page: 1, q: null })).toBe(
      '/pokemon?page=1',
    )
  })
})
