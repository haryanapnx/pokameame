/**
 * `pg` currently treats `prefer`, `require` and `verify-ca` as aliases for `verify-full`, but
 * pg v9 / pg-connection-string v3 adopt libpq semantics where those modes verify less (or nothing).
 * Normalising to `verify-full` keeps the strict behaviour we already rely on and silences pg's
 * security warning about the upcoming change.
 */
export function normalizeConnectionString(connectionString: string): string {
  return connectionString.replace(
    /([?&])sslmode=(prefer|require|verify-ca)(?=&|$)/,
    '$1sslmode=verify-full',
  )
}

/** Resolves `DATABASE_URL` (or an explicit value) into a connection string ready for `pg`. */
export function resolveConnectionString(
  explicit?: string,
  env: Record<string, string | undefined> = process.env,
): string {
  const connectionString = explicit ?? env.DATABASE_URL

  if (!connectionString) {
    throw new Error('DATABASE_URL is not set (use the pooled Neon endpoint)')
  }

  return normalizeConnectionString(connectionString)
}
