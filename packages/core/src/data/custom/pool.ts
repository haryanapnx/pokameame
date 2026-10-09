import 'server-only'

import { Pool } from 'pg'

import { resolveConnectionString } from './connection'
import type { Queryable } from './queryable'

export type PoolOptions = {
  connectionString?: string
  max?: number
}

/**
 * Creates a small PostgreSQL pool. `DATABASE_URL` must be the **pooled** Neon endpoint; TLS is
 * pinned to `verify-full` by {@link resolveConnectionString} and the pool stays small because
 * serverless instances are many.
 */
export function createPool(options: PoolOptions = {}): Pool {
  return new Pool({
    connectionString: resolveConnectionString(options.connectionString),
    max: options.max ?? 5,
  })
}

/** Adapts a `pg` pool to the {@link Queryable} surface the repositories depend on. */
export function asQueryable(pool: Pool): Queryable {
  return {
    async query<Row>(text: string, params?: readonly unknown[]) {
      const result = await pool.query(text, params as unknown[])
      return { rows: result.rows as Row[], rowCount: result.rowCount }
    },
  }
}
