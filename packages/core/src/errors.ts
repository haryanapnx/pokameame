/** Thrown when a PokeAPI payload does not match the expected shape. */
export class PokeApiParseError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'PokeApiParseError'
  }
}

/** Thrown when a PokeAPI HTTP request fails. `status` is 0 for network-level failures. */
export class PokeApiRequestError extends Error {
  readonly status: number

  constructor(message: string, status: number, options?: { cause?: unknown }) {
    super(message, options)
    this.name = 'PokeApiRequestError'
    this.status = status
  }
}

/** Thrown when a PokeAPI request exceeds the configured timeout. */
export class PokeApiTimeoutError extends Error {
  readonly timeoutMs: number

  constructor(message: string, timeoutMs: number, options?: { cause?: unknown }) {
    super(message, options)
    this.name = 'PokeApiTimeoutError'
    this.timeoutMs = timeoutMs
  }
}

/** Thrown when creating a custom record whose name already exists. */
export class DuplicateEntityError extends Error {
  readonly entity: string
  readonly entityName: string

  constructor(entity: string, entityName: string) {
    super(`${entity} "${entityName}" already exists`)
    this.name = 'DuplicateEntityError'
    this.entity = entity
    this.entityName = entityName
  }
}
