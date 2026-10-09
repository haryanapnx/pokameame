import { filterCatalog, mergeCatalog, selectCatalogPage, type CatalogEntry } from './catalog'

type CustomRecord = { id: number; name: string }

const customRecords: CustomRecord[] = [
  { id: 1, name: 'Pikablu' },
  { id: 2, name: 'mystery-mon' },
]

const upstreamNames = ['bulbasaur', 'pikachu', 'PIKABLU', 'charmander']

describe('mergeCatalog', () => {
  it('lists custom entries first and flags their origin', () => {
    const entries = mergeCatalog(upstreamNames, customRecords)

    expect(entries[0]).toMatchObject({ name: 'Pikablu', origin: 'custom' })
    expect(entries[1]).toMatchObject({ name: 'mystery-mon', origin: 'custom' })
  })

  it('lets a custom entry override an upstream name, ignoring case', () => {
    const entries = mergeCatalog(upstreamNames, customRecords)
    const overridden = entries.filter((entry) => entry.name.trim().toLowerCase() === 'pikablu')

    expect(overridden).toHaveLength(1)
    expect(overridden[0]?.origin).toBe('custom')
    expect(entries.some((entry) => entry.name === 'PIKABLU')).toBe(false)
  })

  it('deduplicates custom entries that share a name', () => {
    const entries = mergeCatalog(
      [],
      [
        { id: 1, name: 'dup' },
        { id: 2, name: 'DUP' },
      ],
    )

    expect(entries).toHaveLength(1)
  })

  it('keeps upstream entries that have no custom override', () => {
    const names = mergeCatalog(upstreamNames, customRecords).map((entry) => entry.name)

    expect(names).toEqual(expect.arrayContaining(['bulbasaur', 'pikachu', 'charmander']))
  })
})

describe('filterCatalog', () => {
  const entries = mergeCatalog(upstreamNames, customRecords)

  it('returns everything for an empty query', () => {
    expect(filterCatalog(entries, '')).toHaveLength(entries.length)
    expect(filterCatalog(entries, undefined)).toHaveLength(entries.length)
    expect(filterCatalog(entries, '   ')).toHaveLength(entries.length)
  })

  it('matches case-insensitively on a substring', () => {
    expect(filterCatalog(entries, 'PIKA').map((entry) => entry.name)).toEqual([
      'Pikablu',
      'pikachu',
    ])
  })

  it('matches custom and upstream entries alike', () => {
    const result = filterCatalog(entries, 'mon')

    expect(result.map((entry) => entry.name)).toEqual(['mystery-mon'])
    expect(result[0]?.origin).toBe('custom')
  })

  it('returns nothing when there is no match', () => {
    expect(filterCatalog(entries, 'zzz')).toEqual([])
  })
})

describe('selectCatalogPage', () => {
  const entries: CatalogEntry<CustomRecord>[] = Array.from({ length: 45 }, (_, index) => ({
    name: `mon-${index + 1}`,
    origin: 'pokeapi' as const,
  }))

  it('slices the page and reports navigation flags', () => {
    const page = selectCatalogPage(entries, 2, 20)

    expect(page.items).toHaveLength(20)
    expect(page.items[0]?.name).toBe('mon-21')
    expect(page).toMatchObject({ page: 2, pageSize: 20, total: 45, totalPages: 3, hasNext: true })
  })

  it('returns an empty slice past the end', () => {
    const page = selectCatalogPage(entries, 99, 20)

    expect(page.items).toEqual([])
    expect(page.hasNext).toBe(false)
  })
})

describe('catalog flow', () => {
  it('merges, searches and paginates into the list shape', async () => {
    const names = Array.from({ length: 25 }, (_, index) => `mon-${index + 1}`)
    const entries = filterCatalog(mergeCatalog(names, customRecords), 'mon')
    const page = selectCatalogPage(entries, 2, 10)

    const items = await Promise.all(
      page.items.map(async (entry) => ({ name: entry.name, origin: entry.origin })),
    )
    const result = { ...page, items }

    expect(result).toMatchObject({
      page: 2,
      pageSize: 10,
      total: 26,
      totalPages: 3,
      hasNext: true,
      hasPrevious: true,
    })
    expect(result.items).toHaveLength(10)
  })
})
