import { createAbilityApi } from './ability-api'
import type { PokeApiClient } from './pokeapi-client'

const rawAbility = {
  id: 9,
  name: 'static',
  generation: { name: 'generation-iii' },
  effect_entries: [{ short_effect: 'Contact may paralyze.', language: { name: 'en' } }],
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

describe('createAbilityApi', () => {
  it('requests the full ability index in one call', async () => {
    const { client, calls } = fakeClient(() => emptyList)

    await createAbilityApi(client).listAll()

    expect(calls).toEqual(['ability?limit=100000&offset=0'])
  })

  it('parses an ability name index payload', async () => {
    const { client } = fakeClient(() => ({
      count: 1,
      next: null,
      previous: null,
      results: [{ name: 'static', url: 'https://pokeapi.co/api/v2/ability/9/' }],
    }))

    await expect(createAbilityApi(client).listAll()).resolves.toMatchObject({
      count: 1,
      results: [{ name: 'static' }],
    })
  })

  it('parses an ability detail payload', async () => {
    const { client } = fakeClient(() => rawAbility)

    await expect(createAbilityApi(client).get('static')).resolves.toMatchObject({ name: 'static' })
  })

  it('surfaces parse errors for malformed payloads', async () => {
    const { client } = fakeClient(() => ({ name: 'static' }))

    await expect(createAbilityApi(client).get(9)).rejects.toThrow()
  })
})
