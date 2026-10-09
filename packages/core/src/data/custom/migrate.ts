import type { Queryable } from './queryable'

export type Migration = {
  name: string
  sql: string
}

const MIGRATIONS_TABLE = '_migrations'

const CREATE_MIGRATIONS_TABLE = `
  create table if not exists ${MIGRATIONS_TABLE} (
    name text primary key,
    applied_at timestamptz not null default now()
  )
`

/**
 * Applies pending migrations in name order and records them, so re-running is a no-op.
 * Returns the names of migrations that were applied this run.
 */
export async function runMigrations(db: Queryable, migrations: Migration[]): Promise<string[]> {
  await db.query(CREATE_MIGRATIONS_TABLE)

  const alreadyApplied = await db.query<{ name: string }>(`select name from ${MIGRATIONS_TABLE}`)
  const done = new Set(alreadyApplied.rows.map((row) => row.name))

  const applied: string[] = []
  const ordered = [...migrations].sort((a, b) => a.name.localeCompare(b.name))

  for (const migration of ordered) {
    if (done.has(migration.name)) continue

    await db.query(migration.sql)
    await db.query(`insert into ${MIGRATIONS_TABLE} (name) values ($1)`, [migration.name])
    applied.push(migration.name)
  }

  return applied
}
