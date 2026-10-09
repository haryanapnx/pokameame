import 'server-only'

import { parseRawTypeDetail, type RawTypeDetail } from '../domain/type/schemas'
import { createPokeApiClient, type PokeApiClient } from './pokeapi-client'

export type TypeApi = {
  get: (idOrName: string | number) => Promise<RawTypeDetail>
}

export function createTypeApi(client: PokeApiClient = createPokeApiClient()): TypeApi {
  return {
    get: async (idOrName) => parseRawTypeDetail(await client.get(`type/${idOrName}`)),
  }
}
