import 'server-only'

import type { CustomPokemonInput } from '../../domain/pokemon/types'
import { DuplicateEntityError } from '../../errors'
import type { Queryable } from './queryable'
import { isUniqueViolation, toCustomRecord, type CustomRecord, type CustomRow } from './record'

const COLUMNS = 'id, name, payload, created_at'

export type CustomPokemonRecord = CustomRecord<CustomPokemonInput>

export type CustomPokemonRepository = {
  create: (input: CustomPokemonInput) => Promise<CustomPokemonRecord>
  findByName: (name: string) => Promise<CustomPokemonRecord | null>
  list: () => Promise<CustomPokemonRecord[]>
}

export function createCustomPokemonRepository(db: Queryable): CustomPokemonRepository {
  return {
    async create(input) {
      try {
        const result = await db.query<CustomRow<CustomPokemonInput>>(
          `insert into custom_pokemon (name, payload) values ($1, $2) returning ${COLUMNS}`,
          [input.name, JSON.stringify(input)],
        )

        const row = result.rows[0]
        if (!row) throw new Error('Insert into custom_pokemon returned no row')
        return toCustomRecord(row)
      } catch (error) {
        if (isUniqueViolation(error)) throw new DuplicateEntityError('Pokemon', input.name)
        throw error
      }
    },

    async findByName(name) {
      const result = await db.query<CustomRow<CustomPokemonInput>>(
        `select ${COLUMNS} from custom_pokemon where name = $1`,
        [name],
      )

      const row = result.rows[0]
      return row ? toCustomRecord(row) : null
    },

    async list() {
      const result = await db.query<CustomRow<CustomPokemonInput>>(
        `select ${COLUMNS} from custom_pokemon order by id asc`,
      )

      return result.rows.map((row) => toCustomRecord(row))
    },
  }
}
