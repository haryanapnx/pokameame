import { readdir, readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { resolveConnectionString } from '@poke/core/connection'
import { runMigrations, type Migration } from '@poke/core/migrations'
import { Pool } from 'pg'

const MIGRATIONS_DIR = fileURLToPath(new URL('../db/migrations/', import.meta.url))

async function loadMigrations(): Promise<Migration[]> {
  const entries = (await readdir(MIGRATIONS_DIR)).filter((name) => name.endsWith('.sql')).sort()

  return Promise.all(
    entries.map(async (name) => ({
      name,
      sql: await readFile(join(MIGRATIONS_DIR, name), 'utf8'),
    })),
  )
}

async function main(): Promise<void> {
  const pool = new Pool({ connectionString: resolveConnectionString(), max: 2 })

  try {
    const applied = await runMigrations(
      {
        async query<Row>(text: string, params?: readonly unknown[]) {
          const result = await pool.query(text, params as unknown[])
          return { rows: result.rows as Row[], rowCount: result.rowCount }
        },
      },
      await loadMigrations(),
    )

    console.log(
      applied.length > 0 ? `Applied migrations: ${applied.join(', ')}` : 'No pending migrations',
    )
  } finally {
    await pool.end()
  }
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error)
  process.exitCode = 1
})
