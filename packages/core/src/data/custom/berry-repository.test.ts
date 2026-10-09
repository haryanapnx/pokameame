import type { CustomBerryInput } from '../../domain/berry/types'
import { DuplicateEntityError } from '../../errors'
import { createCustomBerryRepository } from './berry-repository'
import { createMigratedTestDb } from './test-helpers'

const input: CustomBerryInput = {
  name: 'mystery-berry',
  firmness: 'very-soft',
  growthTime: 12,
  flavors: [{ name: 'bitter', potency: 20 }],
}

describe('custom Berry repository', () => {
  it('creates a record and reads the payload back', async () => {
    const repo = createCustomBerryRepository(await createMigratedTestDb())

    const created = await repo.create(input)

    expect(created.id).toBeGreaterThan(0)
    expect(created.name).toBe('mystery-berry')
    expect(created.payload).toEqual(input)
  })

  it('finds by name, or returns null', async () => {
    const repo = createCustomBerryRepository(await createMigratedTestDb())
    await repo.create(input)

    await expect(repo.findByName('mystery-berry')).resolves.toMatchObject({
      name: 'mystery-berry',
    })
    await expect(repo.findByName('nope')).resolves.toBeNull()
  })

  it('lists records in insertion order', async () => {
    const repo = createCustomBerryRepository(await createMigratedTestDb())
    await repo.create(input)
    await repo.create({ ...input, name: 'second-berry' })

    const all = await repo.list()

    expect(all.map((record) => record.name)).toEqual(['mystery-berry', 'second-berry'])
  })

  it('rejects duplicate names with a typed error', async () => {
    const repo = createCustomBerryRepository(await createMigratedTestDb())
    await repo.create(input)

    await expect(repo.create(input)).rejects.toBeInstanceOf(DuplicateEntityError)
  })
})
