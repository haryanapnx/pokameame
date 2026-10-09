import 'server-only'

import { PokeApiRequestError, PokeApiTimeoutError } from '../errors'

export const DEFAULT_POKEAPI_BASE_URL = 'https://pokeapi.co/api/v2'
export const DEFAULT_TIMEOUT_MS = 10_000

export type PokeApiClient = {
  /** Fetches `path` (relative to the base URL) and returns the parsed JSON body. */
  get: (path: string) => Promise<unknown>
}

export type PokeApiClientOptions = {
  baseUrl?: string
  timeoutMs?: number
  fetchImpl?: typeof fetch
}

function isAbortError(error: unknown): boolean {
  return error instanceof Error && error.name === 'AbortError'
}

/** Resolves the base URL from an explicit value, the environment, or the default. */
export function resolveBaseUrl(explicit?: string): string {
  const configured = explicit ?? process.env.POKEAPI_BASE_URL ?? DEFAULT_POKEAPI_BASE_URL
  return configured.replace(/\/+$/, '')
}

export function createPokeApiClient(options: PokeApiClientOptions = {}): PokeApiClient {
  const baseUrl = resolveBaseUrl(options.baseUrl)
  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS
  const doFetch = options.fetchImpl ?? fetch

  return {
    async get(path: string): Promise<unknown> {
      const url = `${baseUrl}/${path.replace(/^\/+/, '')}`
      const controller = new AbortController()
      const timer = setTimeout(() => controller.abort(), timeoutMs)

      try {
        const response = await doFetch(url, {
          signal: controller.signal,
          headers: { accept: 'application/json' },
        })

        if (!response.ok) {
          throw new PokeApiRequestError(
            `PokeAPI request failed (${response.status}) for ${url}`,
            response.status,
          )
        }

        try {
          return await response.json()
        } catch (cause) {
          throw new PokeApiRequestError(
            `PokeAPI returned invalid JSON for ${url}`,
            response.status,
            { cause },
          )
        }
      } catch (error) {
        if (error instanceof PokeApiRequestError) throw error
        if (isAbortError(error)) {
          throw new PokeApiTimeoutError(
            `PokeAPI request timed out after ${timeoutMs}ms for ${url}`,
            timeoutMs,
            { cause: error },
          )
        }
        throw new PokeApiRequestError(`PokeAPI request failed for ${url}`, 0, { cause: error })
      } finally {
        clearTimeout(timer)
      }
    },
  }
}
