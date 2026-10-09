import 'server-only'

import { parseRawBerry, type RawBerry } from '../domain/berry/schemas'
import { parseRawListResponse, type RawListResponse } from '../domain/pokemon/schemas'
import { createPokeApiClient, type PokeApiClient } from './pokeapi-client'

/** Upper bound used to fetch the whole name index in a single request. */
const FULL_LIST_LIMIT = 100_000

export type BerryApi = {
  list: (params: { limit: number; offset: number }) => Promise<RawListResponse>
  /** Fetches every berry name at once (used for search). */
  listAll: () => Promise<RawListResponse>
  get: (idOrName: string | number) => Promise<RawBerry>
}

export function createBerryApi(client: PokeApiClient = createPokeApiClient()): BerryApi {
  return {
    list: async ({ limit, offset }) =>
      parseRawListResponse(await client.get(`berry?limit=${limit}&offset=${offset}`)),

    listAll: async () =>
      parseRawListResponse(await client.get(`berry?limit=${FULL_LIST_LIMIT}&offset=0`)),

    get: async (idOrName) => parseRawBerry(await client.get(`berry/${idOrName}`)),
  }
}
