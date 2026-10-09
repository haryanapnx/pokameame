/** Row shape as returned by `pg`; `payload` may arrive as a string or a parsed object. */
export type CustomRow<TPayload> = {
  id: number | string
  name: string
  payload: TPayload | string
  created_at: string | Date
}

export type CustomRecord<TPayload> = {
  id: number
  name: string
  payload: TPayload
  createdAt: string
}

export function toCustomRecord<TPayload>(row: CustomRow<TPayload>): CustomRecord<TPayload> {
  return {
    id: Number(row.id),
    name: row.name,
    payload: typeof row.payload === 'string' ? (JSON.parse(row.payload) as TPayload) : row.payload,
    createdAt:
      row.created_at instanceof Date ? row.created_at.toISOString() : String(row.created_at),
  }
}

/** Detects a unique-constraint violation from `pg` or `pg-mem`. */
export function isUniqueViolation(error: unknown): boolean {
  if (typeof error !== 'object' || error === null) return false

  if ((error as { code?: unknown }).code === '23505') return true

  const message = (error as { message?: unknown }).message
  return typeof message === 'string' && /duplicate key|unique constraint/i.test(message)
}
