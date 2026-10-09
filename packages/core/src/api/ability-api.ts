import 'server-only'

import { parseRawAbility, type RawAbility } from '../domain/ability/schemas'
import { parseRawListResponse, type RawListResponse } from '../domain/pokemon/schemas'
import { createPokeApiClient, type PokeApiClient } from './pokeapi-client'

/** Upper bound used to fetch the whole ability index in a single request. */
const FULL_LIST_LIMIT = 100_000

export type AbilityApi = {
  /** Fetches every ability name at once (feeds the add-custom form). */
  listAll: () => Promise<RawListResponse>
  get: (idOrName: string | number) => Promise<RawAbility>
}

export function createAbilityApi(client: PokeApiClient = createPokeApiClient()): AbilityApi {
  return {
    listAll: async () =>
      parseRawListResponse(await client.get(`ability?limit=${FULL_LIST_LIMIT}&offset=0`)),

    get: async (idOrName) => parseRawAbility(await client.get(`ability/${idOrName}`)),
  }
}
