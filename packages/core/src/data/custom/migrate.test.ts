import { runMigrations } from './migrate'
import { createMigratedTestDb, loadInitMigrations } from './test-helpers'

describe('runMigrations', () => {
  it('creates both custom tables', async () => {
    const db = await createMigratedTestDb()

    await expect(
      db.query('select id, name, payload, created_at from custom_pokemon'),
    ).resolves.toBeDefined()
    await expect(
      db.query('select id, name, payload, created_at from custom_berry'),
    ).resolves.toBeDefined()
  })

  it('records applied migrations', async () => {
    const db = await createMigratedTestDb()

    const result = await db.query<{ name: string }>('select name from _migrations')

    expect(result.rows.map((row) => row.name)).toEqual(['0001_init.sql'])
  })

  it('is idempotent — re-running applies nothing', async () => {
    const db = await createMigratedTestDb()

    await expect(runMigrations(db, await loadInitMigrations())).resolves.toEqual([])
  })

  it('applies only migrations that are still pending', async () => {
    const db = await createMigratedTestDb()
    const extra = [
      { name: '0002_extra.sql', sql: 'create table if not exists extra (id serial primary key)' },
    ]

    await expect(runMigrations(db, extra)).resolves.toEqual(['0002_extra.sql'])
    await expect(runMigrations(db, extra)).resolves.toEqual([])
  })
})
