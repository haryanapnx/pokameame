/**
 * Maps items with a bounded number of concurrent async operations, preserving input order.
 * Used for the per-page detail fetches when building list views.
 */
export async function mapWithConcurrency<T, R>(
  items: readonly T[],
  limit: number,
  mapper: (item: T, index: number) => Promise<R>,
): Promise<R[]> {
  if (items.length === 0) return []

  const concurrency = Math.max(1, Math.min(Math.trunc(limit) || 1, items.length))
  const results = new Array<R>(items.length)
  let cursor = 0

  async function worker(): Promise<void> {
    while (cursor < items.length) {
      const index = cursor
      cursor += 1

      const item = items[index]
      if (item === undefined) continue

      results[index] = await mapper(item, index)
    }
  }

  await Promise.all(Array.from({ length: concurrency }, () => worker()))

  return results
}
