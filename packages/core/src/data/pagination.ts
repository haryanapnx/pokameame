export const DEFAULT_PAGE_SIZE = 20

export type PageSlice = {
  page: number
  pageSize: number
  offset: number
  limit: number
}

export type Paginated<T> = {
  items: T[]
  page: number
  pageSize: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrevious: boolean
}

/** Parses a page number from a URL search param; anything invalid falls back to `fallback`. */
export function parsePage(value: unknown, fallback = 1): number {
  const parsed =
    typeof value === 'number'
      ? Math.trunc(value)
      : typeof value === 'string' && value.trim() !== ''
        ? Number.parseInt(value, 10)
        : Number.NaN

  return Number.isFinite(parsed) && parsed >= 1 ? parsed : fallback
}

export function totalPagesFor(totalItems: number, pageSize: number = DEFAULT_PAGE_SIZE): number {
  if (pageSize <= 0 || totalItems <= 0) return 0
  return Math.ceil(totalItems / pageSize)
}

/** Clamps a page into `[1, totalPages]`; an empty collection clamps to page 1. */
export function clampPage(
  page: number,
  totalItems: number,
  pageSize: number = DEFAULT_PAGE_SIZE,
): number {
  const totalPages = totalPagesFor(totalItems, pageSize)
  if (totalPages === 0) return 1
  return Math.min(Math.max(Math.trunc(page) || 1, 1), totalPages)
}

/** Converts a 1-based page into the offset/limit pair PokeAPI expects. */
export function toPageSlice(page: number, pageSize: number = DEFAULT_PAGE_SIZE): PageSlice {
  const safePage = Math.max(1, Math.trunc(page) || 1)
  const safeSize = pageSize > 0 ? Math.trunc(pageSize) : DEFAULT_PAGE_SIZE

  return {
    page: safePage,
    pageSize: safeSize,
    offset: (safePage - 1) * safeSize,
    limit: safeSize,
  }
}

/** Slices an in-memory collection into a page with navigation flags. */
export function paginate<T>(
  items: T[],
  page: number,
  pageSize: number = DEFAULT_PAGE_SIZE,
): Paginated<T> {
  const total = items.length
  const totalPages = totalPagesFor(total, pageSize)
  const slice = toPageSlice(page, pageSize)

  return {
    items: items.slice(slice.offset, slice.offset + slice.pageSize),
    page: slice.page,
    pageSize: slice.pageSize,
    total,
    totalPages,
    hasNext: slice.page < totalPages,
    hasPrevious: slice.page > 1,
  }
}
