import type { CatalogKind } from '../domain/catalog'

/** Query-key factory shared by hooks and (client-side) invalidation after a Server Action. */
export const queryKeys = {
  all: ['catalog'] as const,
  search: (kind: CatalogKind, query: string) => ['catalog', kind, 'search', query] as const,
  searchAll: (kind: CatalogKind) => ['catalog', kind, 'search'] as const,
}
