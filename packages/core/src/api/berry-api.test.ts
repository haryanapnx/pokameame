import { createBerryApi } from './berry-api'
import type { PokeApiClient } from './pokeapi-client'

const rawBerry = {
  id: 1,
  name: 'cheri',
  growth_time: 3,
  max_harvest: 5,
  natural_gift_power: 60,
  size: 20,
  smoothness: 25,
  soil_dryness: 15,
  firmness: { name: 'soft' },
  flavors: [{ potency: 10, flavor: { name: 'spicy' } }],
  item: { name: 'cheri-berry' },
  natural_gift_type: { name: 'fire' },
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

describe('createBerryApi', () => {
  it('builds the paginated list path', async () => {
    const { client, calls } = fakeClient(() => emptyList)

    await createBerryApi(client).list({ limit: 20, offset: 20 })

    expect(calls).toEqual(['berry?limit=20&offset=20'])
  })

  it('requests the full list for the name index', async () => {
    const { client, calls } = fakeClient(() => emptyList)

    await createBerryApi(client).listAll()

    expect(calls[0]).toBe('berry?limit=100000&offset=0')
  })

  it('parses a berry detail payload', async () => {
    const { client } = fakeClient(() => rawBerry)

    await expect(createBerryApi(client).get('cheri')).resolves.toMatchObject({ name: 'cheri' })
  })

  it('surfaces parse errors for malformed payloads', async () => {
    const { client } = fakeClient(() => ({ name: 'cheri' }))

    await expect(createBerryApi(client).get(1)).rejects.toThrow()
  })
})
