import type { CustomPokemonRepository } from '../data/custom'
import { DuplicateEntityError } from '../errors'
import { createCustomPokemonWriter } from './pokemon-writes'

const validInput = {
  name: 'pikablu',
  types: ['water'],
  abilities: [],
  stats: [{ name: 'hp', value: 60 }],
}

function fakeRepository(overrides: Partial<CustomPokemonRepository> = {}): CustomPokemonRepository {
  return {
    create: async (input) => ({
      id: 7,
      name: input.name,
      payload: input,
      createdAt: '2026-01-01T00:00:00.000Z',
    }),
    findByName: async () => null,
    list: async () => [],
    ...overrides,
  }
}

describe('createCustomPokemonWriter', () => {
  it('validates before touching the database', async () => {
    let createCalls = 0
    const writer = createCustomPokemonWriter(
      fakeRepository({
        create: async () => {
          createCalls += 1
          throw new Error('should not be called')
        },
      }),
    )

    const result = await writer.create({ ...validInput, name: '' })

    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.error.code).toBe('validation')
    expect(createCalls).toBe(0)
  })

  it('returns per-field errors for the form', async () => {
    const writer = createCustomPokemonWriter(fakeRepository())

    const result = await writer.create({ ...validInput, types: [] })

    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.error.fieldErrors?.types).toBeDefined()
  })

  it('returns the created detail on success', async () => {
    const writer = createCustomPokemonWriter(fakeRepository())

    const result = await writer.create(validInput)

    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.data).toMatchObject({ id: 7, name: 'pikablu', origin: 'custom' })
    }
  })

  it('maps duplicate names to a typed error', async () => {
    const writer = createCustomPokemonWriter(
      fakeRepository({
        create: async () => {
          throw new DuplicateEntityError('Pokemon', 'pikablu')
        },
      }),
    )

    const result = await writer.create(validInput)

    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.error.code).toBe('duplicate')
      expect(result.error.fieldErrors?.name).toBeDefined()
    }
  })

  it('never throws on unexpected failures', async () => {
    const writer = createCustomPokemonWriter(
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
