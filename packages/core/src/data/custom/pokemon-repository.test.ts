import type { CustomPokemonInput } from '../../domain/pokemon/types'
import { DuplicateEntityError } from '../../errors'
import { createCustomPokemonRepository } from './pokemon-repository'
import { createMigratedTestDb } from './test-helpers'

const input: CustomPokemonInput = {
  name: 'pikablu',
  types: ['water'],
  abilities: [{ name: 'torrent', isHidden: false }],
  stats: [{ name: 'hp', value: 60 }],
}

describe('custom Pokemon repository', () => {
  it('creates a record and reads the payload back', async () => {
    const repo = createCustomPokemonRepository(await createMigratedTestDb())

    const created = await repo.create(input)

    expect(created.id).toBeGreaterThan(0)
    expect(created.name).toBe('pikablu')
    expect(created.payload).toEqual(input)
    expect(typeof created.createdAt).toBe('string')
  })

  it('finds by name, or returns null', async () => {
    const repo = createCustomPokemonRepository(await createMigratedTestDb())
    await repo.create(input)

    await expect(repo.findByName('pikablu')).resolves.toMatchObject({ name: 'pikablu' })
    await expect(repo.findByName('missingno')).resolves.toBeNull()
  })

  it('lists records in insertion order', async () => {
    const repo = createCustomPokemonRepository(await createMigratedTestDb())
    await repo.create(input)
    await repo.create({ ...input, name: 'pikared' })

    const all = await repo.list()

    expect(all.map((record) => record.name)).toEqual(['pikablu', 'pikared'])
  })

  it('rejects duplicate names with a typed error', async () => {
    const repo = createCustomPokemonRepository(await createMigratedTestDb())
    await repo.create(input)

    await expect(repo.create(input)).rejects.toBeInstanceOf(DuplicateEntityError)
  })
})
