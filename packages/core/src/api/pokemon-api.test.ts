import { createPokemonApi } from './pokemon-api'
import type { PokeApiClient } from './pokeapi-client'

const rawPokemon = {
  id: 25,
  name: 'pikachu',
  height: 4,
  weight: 60,
  base_experience: 112,
  types: [{ type: { name: 'electric' } }],
  abilities: [{ ability: { name: 'static' }, is_hidden: false }],
  stats: [{ base_stat: 35, stat: { name: 'hp' } }],
  sprites: { front_default: null },
}

const emptyList = { count: 0, next: null, previous: null, results: [] }

function fakeClient(responder: (path: string) => unknown) {
  const calls: string[] = []
  const client: PokeApiClient = {
    get: async (path: string) => {
      calls.push(path)
      return responder(path)
    },
  }
  return { client, calls }
}

describe('createPokemonApi', () => {
  it('builds the paginated list path', async () => {
    const { client, calls } = fakeClient(() => emptyList)

    await createPokemonApi(client).list({ limit: 20, offset: 40 })

    expect(calls).toEqual(['pokemon?limit=20&offset=40'])
  })

  it('requests the full list for the name index', async () => {
    const { client, calls } = fakeClient(() => emptyList)

    await createPokemonApi(client).listAll()

    expect(calls[0]).toBe('pokemon?limit=100000&offset=0')
  })

  it('parses a pokemon detail payload', async () => {
    const { client } = fakeClient(() => rawPokemon)

    await expect(createPokemonApi(client).get(25)).resolves.toMatchObject({ name: 'pikachu' })
  })

  it('surfaces parse errors for malformed payloads', async () => {
    const { client } = fakeClient(() => ({ name: 'pikachu' }))

    await expect(createPokemonApi(client).get('pikachu')).rejects.toThrow()
  })
})
