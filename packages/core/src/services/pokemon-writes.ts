import 'server-only'

import { createCustomPokemonRepository, type CustomPokemonRepository } from '../data/custom'
import { toCustomPokemonDetail } from '../domain/pokemon/mappers'
import type { PokemonDetail } from '../domain/pokemon/types'
import { validateCustomPokemonInput } from '../domain/pokemon/validation'
import { DuplicateEntityError } from '../errors'
import { fieldErrorsFromIssues, type CreateResult } from '../result'
import { getQueryable } from './db'

export type CustomPokemonWriter = {
  create: (input: unknown) => Promise<CreateResult<PokemonDetail>>
}

/**
 * Validates, rejects duplicates and inserts a custom Pokemon. Never throws — callers get a typed
 * result. Deliberately performs **no** cache revalidation; the zone Server Action owns that.
 */
export function createCustomPokemonWriter(
  repository: CustomPokemonRepository,
): CustomPokemonWriter {
  return {
    async create(input) {
      const parsed = validateCustomPokemonInput(input)

      if (!parsed.ok) {
        return {
          ok: false,
          error: {
            code: 'validation',
            message: 'Please fix the highlighted fields',
            fieldErrors: fieldErrorsFromIssues(parsed.issues),
          },
        }
      }

      try {
        const record = await repository.create(parsed.value)
        return { ok: true, data: toCustomPokemonDetail(record.payload, record.id) }
      } catch (error) {
        if (error instanceof DuplicateEntityError) {
          return {
            ok: false,
            error: {
              code: 'duplicate',
              message: error.message,
              fieldErrors: { name: 'That name is already taken' },
            },
          }
        }

        return {
          ok: false,
          error: {
            code: 'unexpected',
            message: 'Could not save the Pokemon. Please try again.',
          },
        }
      }
    },
  }
}

/** Wires the default repository; used by zone Server Actions. */
export async function saveCustomPokemon(input: unknown): Promise<CreateResult<PokemonDetail>> {
  return createCustomPokemonWriter(createCustomPokemonRepository(getQueryable())).create(input)
}
