import { readFile } from 'node:fs/promises'

import { newDb } from 'pg-mem'

import { runMigrations, type Migration } from './migrate'
import type { Queryable } from './queryable'

const INIT_MIGRATION_URL = new URL('../../../../../db/migrations/0001_init.sql', import.meta.url)

export async function loadInitMigrations(): Promise<Migration[]> {
  return [{ name: '0001_init.sql', sql: await readFile(INIT_MIGRATION_URL, 'utf8') }]
}

/** In-memory Postgres with the real SQL migrations applied. */
export async function createMigratedTestDb(): Promise<Queryable> {
  // pg-mem's AST-coverage check rejects `create table if not exists` when the table already
  // exists (its parser short-circuits the statement); real Postgres has no such limitation.
  const adapter = newDb({ noAstCoverageCheck: true }).adapters.createPg()
  const pool = new adapter.Pool()

  const db: Queryable = {
    async query<Row>(text: string, params?: readonly unknown[]) {
      const result = await pool.query(text, params as unknown[])
      return { rows: result.rows as Row[], rowCount: result.rowCount ?? null }
    },
  }

  await runMigrations(db, await loadInitMigrations())

  return db
}
