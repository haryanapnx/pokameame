export { PokeApiParseError, PokeApiRequestError, PokeApiTimeoutError } from './errors'
export type { EntityOrigin } from './domain/types'

export type {
  CustomPokemonInput,
  PokemonAbility,
  PokemonDetail,
  PokemonStat,
  PokemonSummary,
} from './domain/pokemon/types'
export { parseRawListResponse, parseRawPokemon } from './domain/pokemon/schemas'
export type {
  RawListResponse,
  RawNamedResource,
  RawPokemon,
  RawPokemonAbility,
  RawPokemonStat,
  RawPokemonTypeSlot,
} from './domain/pokemon/schemas'
export { toCustomPokemonDetail, toPokemonDetail, toPokemonSummary } from './domain/pokemon/mappers'

export type { BerryDetail, BerryFlavor, BerrySummary, CustomBerryInput } from './domain/berry/types'
export { parseRawBerry } from './domain/berry/schemas'
export type { RawBerry, RawBerryFlavor } from './domain/berry/schemas'
export { toBerryDetail, toBerrySummary, toCustomBerryDetail } from './domain/berry/mappers'

export type { AbilityDetail, PokemonAbilityInfo } from './domain/ability/types'
export { parseRawAbility } from './domain/ability/schemas'
export type { RawAbility, RawAbilityEffectEntry } from './domain/ability/schemas'
export { toAbilityDetail } from './domain/ability/mappers'

export type {
  DefensiveMatchups,
  TypeDamageRelations,
  TypeDetail,
  TypeMultiplier,
} from './domain/type/types'
export { parseRawTypeDetail } from './domain/type/schemas'
export type { RawTypeDetail, RawTypeRelations } from './domain/type/schemas'
export { toTypeDetail } from './domain/type/mappers'
export { computeDefensiveMatchups } from './domain/type/matchups'

export {
  CACHE_LIFE,
  CACHE_TAGS,
  DEFAULT_PAGE_SIZE,
  abilityIndexTag,
  abilityTag,
  berryDetailTag,
  berryIndexTag,
  berryListTag,
  clampPage,
  paginate,
  parsePage,
  pokemonDetailTag,
  pokemonIndexTag,
  pokemonListTag,
  toPageSlice,
  totalPagesFor,
  typeTag,
} from './data/index'
export type { PageSlice, Paginated } from './data/index'

export {
  ENTITY_NAME_PATTERN,
  NAME_MAX_LENGTH,
  normalizeEntityName,
  slugify,
  type ValidationIssue,
  type ValidationResult,
} from './domain/validation'
export { validateCustomPokemonInput } from './domain/pokemon/validation'
export { validateCustomBerryInput } from './domain/berry/validation'
export { displayName, formatId } from './domain/format'
export { fieldErrorsFromIssues } from './result'
export type { CreateError, CreateErrorCode, CreateResult } from './result'
