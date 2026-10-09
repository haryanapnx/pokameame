import 'server-only'

import type { CustomBerryInput } from '../../domain/berry/types'
import { DuplicateEntityError } from '../../errors'
import type { Queryable } from './queryable'
import { isUniqueViolation, toCustomRecord, type CustomRecord, type CustomRow } from './record'

const COLUMNS = 'id, name, payload, created_at'

export type CustomBerryRecord = CustomRecord<CustomBerryInput>

export type CustomBerryRepository = {
  create: (input: CustomBerryInput) => Promise<CustomBerryRecord>
  findByName: (name: string) => Promise<CustomBerryRecord | null>
  list: () => Promise<CustomBerryRecord[]>
}

export function createCustomBerryRepository(db: Queryable): CustomBerryRepository {
  return {
    async create(input) {
      try {
        const result = await db.query<CustomRow<CustomBerryInput>>(
          `insert into custom_berry (name, payload) values ($1, $2) returning ${COLUMNS}`,
          [input.name, JSON.stringify(input)],
        )

        const row = result.rows[0]
        if (!row) throw new Error('Insert into custom_berry returned no row')
        return toCustomRecord(row)
      } catch (error) {
        if (isUniqueViolation(error)) throw new DuplicateEntityError('Berry', input.name)
        throw error
      }
    },

    async findByName(name) {
      const result = await db.query<CustomRow<CustomBerryInput>>(
        `select ${COLUMNS} from custom_berry where name = $1`,
        [name],
      )

      const row = result.rows[0]
      return row ? toCustomRecord(row) : null
    },

    async list() {
      const result = await db.query<CustomRow<CustomBerryInput>>(
        `select ${COLUMNS} from custom_berry order by id asc`,
      )

      return result.rows.map((row) => toCustomRecord(row))
    },
  }
}
