import type { CustomBerryRepository } from '../data/custom'
import { DuplicateEntityError } from '../errors'
import { createCustomBerryWriter } from './berry-writes'

const validInput = {
  name: 'mystery-berry',
  firmness: 'soft',
  growthTime: 12,
  flavors: [{ name: 'bitter', potency: 20 }],
}

function fakeRepository(overrides: Partial<CustomBerryRepository> = {}): CustomBerryRepository {
  return {
    create: async (input) => ({
      id: 3,
      name: input.name,
      payload: input,
      createdAt: '2026-01-01T00:00:00.000Z',
    }),
    findByName: async () => null,
    list: async () => [],
    ...overrides,
  }
}

describe('createCustomBerryWriter', () => {
  it('validates before touching the database', async () => {
    let createCalls = 0
    const writer = createCustomBerryWriter(
      fakeRepository({
        create: async () => {
          createCalls += 1
          throw new Error('should not be called')
        },
      }),
    )

    const result = await writer.create({ ...validInput, flavors: [] })

    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.error.code).toBe('validation')
    expect(createCalls).toBe(0)
  })

  it('returns the created detail on success', async () => {
    const writer = createCustomBerryWriter(fakeRepository())

    const result = await writer.create(validInput)

    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.data).toMatchObject({ id: 3, name: 'mystery-berry', origin: 'custom' })
    }
  })

  it('maps duplicate names to a typed error', async () => {
    const writer = createCustomBerryWriter(
      fakeRepository({
        create: async () => {
          throw new DuplicateEntityError('Berry', 'mystery-berry')
        },
      }),
    )

    const result = await writer.create(validInput)

    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.error.code).toBe('duplicate')
  })

  it('never throws on unexpected failures', async () => {
    const writer = createCustomBerryWriter(
      fakeRepository({
        create: async () => {
          throw new Error('database is down')
        },
      }),
    )

    const result = await writer.create(validInput)

    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.error.code).toBe('unexpected')
  })
})
