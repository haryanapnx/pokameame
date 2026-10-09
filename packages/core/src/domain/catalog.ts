import type { EntityOrigin } from './types'

export type CatalogKind = 'pokemon' | 'berry'

export type CatalogSuggestion = {
  name: string
  origin: EntityOrigin
  id?: number
}
