import 'server-only'

import { createCustomBerryRepository, type CustomBerryRepository } from '../data/custom'
import { toCustomBerryDetail } from '../domain/berry/mappers'
import type { BerryDetail } from '../domain/berry/types'
import { validateCustomBerryInput } from '../domain/berry/validation'
import { DuplicateEntityError } from '../errors'
import { fieldErrorsFromIssues, type CreateResult } from '../result'
import { getQueryable } from './db'

export type CustomBerryWriter = {
  create: (input: unknown) => Promise<CreateResult<BerryDetail>>
}

/**
 * Validates, rejects duplicates and inserts a custom berry. Never throws — callers get a typed
 * result. Deliberately performs **no** cache revalidation; the zone Server Action owns that.
 */
export function createCustomBerryWriter(repository: CustomBerryRepository): CustomBerryWriter {
  return {
    async create(input) {
      const parsed = validateCustomBerryInput(input)

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
        return { ok: true, data: toCustomBerryDetail(record.payload, record.id) }
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
            message: 'Could not save the berry. Please try again.',
          },
        }
      }
    },
  }
}

/** Wires the default repository; used by zone Server Actions. */
export async function saveCustomBerry(input: unknown): Promise<CreateResult<BerryDetail>> {
  return createCustomBerryWriter(createCustomBerryRepository(getQueryable())).create(input)
}
