import {
  DEFAULT_PAGE_SIZE,
  clampPage,
  paginate,
  parsePage,
  toPageSlice,
  totalPagesFor,
} from './pagination'

describe('parsePage', () => {
  it('parses positive integers from strings', () => {
    expect(parsePage('3')).toBe(3)
    expect(parsePage(' 12 ')).toBe(12)
  })

  it('accepts numbers and truncates fractions', () => {
    expect(parsePage(4)).toBe(4)
    expect(parsePage(3.7)).toBe(3)
  })

  it('falls back for missing or invalid input', () => {
    expect(parsePage(undefined)).toBe(1)
    expect(parsePage(null)).toBe(1)
    expect(parsePage('')).toBe(1)
    expect(parsePage('abc')).toBe(1)
    expect(parsePage('0')).toBe(1)
    expect(parsePage('-2')).toBe(1)
    expect(parsePage(0)).toBe(1)
  })

  it('honours a custom fallback', () => {
    expect(parsePage('nope', 5)).toBe(5)
  })
})

describe('totalPagesFor', () => {
  it('rounds up a remainder', () => {
    expect(totalPagesFor(41, 20)).toBe(3)
  })

  it('is exact when the count divides evenly', () => {
    expect(totalPagesFor(40, 20)).toBe(2)
  })

  it('is zero for an empty collection or invalid page size', () => {
    expect(totalPagesFor(0)).toBe(0)
    expect(totalPagesFor(10, 0)).toBe(0)
  })
})

describe('clampPage', () => {
  it('clamps above the last page', () => {
    expect(clampPage(99, 41, 20)).toBe(3)
  })

  it('clamps below the first page', () => {
    expect(clampPage(0, 41, 20)).toBe(1)
  })

  it('returns page 1 when there is nothing to show', () => {
    expect(clampPage(5, 0)).toBe(1)
  })
})

describe('toPageSlice', () => {
  it('computes the offset for a page', () => {
    expect(toPageSlice(3, 20)).toEqual({ page: 3, pageSize: 20, offset: 40, limit: 20 })
  })

  it('defaults the page size', () => {
    expect(toPageSlice(1).pageSize).toBe(DEFAULT_PAGE_SIZE)
  })

  it('normalises an invalid page and size', () => {
    expect(toPageSlice(-5, 10).page).toBe(1)
    expect(toPageSlice(2, -1).pageSize).toBe(DEFAULT_PAGE_SIZE)
  })
})

describe('paginate', () => {
  const items = Array.from({ length: 45 }, (_, index) => index + 1)

  it('slices the requested page and reports navigation flags', () => {
    const result = paginate(items, 2, 20)

    expect(result.items).toHaveLength(20)
    expect(result.items[0]).toBe(21)
    expect(result.total).toBe(45)
    expect(result.totalPages).toBe(3)
    expect(result.hasNext).toBe(true)
    expect(result.hasPrevious).toBe(true)
  })

  it('handles a partial last page', () => {
    const result = paginate(items, 3, 20)

    expect(result.items).toHaveLength(5)
    expect(result.hasNext).toBe(false)
    expect(result.hasPrevious).toBe(true)
  })

  it('returns an empty slice past the last page', () => {
    const result = paginate(items, 99, 20)

    expect(result.items).toEqual([])
    expect(result.hasNext).toBe(false)
    expect(result.hasPrevious).toBe(true)
  })

  it('handles an empty collection', () => {
    const result = paginate([], 1)

    expect(result.items).toEqual([])
    expect(result.total).toBe(0)
    expect(result.hasPrevious).toBe(false)
    expect(result.hasNext).toBe(false)
  })
})
