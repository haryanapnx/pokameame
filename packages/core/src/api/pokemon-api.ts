import 'server-only'

import {
  parseRawListResponse,
  parseRawPokemon,
  type RawListResponse,
  type RawPokemon,
} from '../domain/pokemon/schemas'
import { createPokeApiClient, type PokeApiClient } from './pokeapi-client'

/** Upper bound used to fetch the whole name index in a single request. */
export const FULL_LIST_LIMIT = 100_000

export type PokemonApi = {
  list: (params: { limit: number; offset: number }) => Promise<RawListResponse>
  /** Fetches every Pokemon name at once (used for search). */
  listAll: () => Promise<RawListResponse>
  get: (idOrName: string | number) => Promise<RawPokemon>
}

export function createPokemonApi(client: PokeApiClient = createPokeApiClient()): PokemonApi {
  return {
    list: async ({ limit, offset }) =>
      parseRawListResponse(await client.get(`pokemon?limit=${limit}&offset=${offset}`)),

    listAll: async () =>
      parseRawListResponse(await client.get(`pokemon?limit=${FULL_LIST_LIMIT}&offset=0`)),

    get: async (idOrName) => parseRawPokemon(await client.get(`pokemon/${idOrName}`)),
  }
}
