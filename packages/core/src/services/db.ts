import 'server-only'

import type { Pool } from 'pg'

import { asQueryable, createPool } from '../data/custom/pool'
import type { Queryable } from '../data/custom/queryable'

let pool: Pool | undefined

/** Lazily creates the process-wide pool and adapts it to {@link Queryable}. */
export function getQueryable(): Queryable {
  pool ??= createPool()
  return asQueryable(pool)
}
