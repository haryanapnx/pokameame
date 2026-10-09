'use server'

import { updateTag } from 'next/cache'
import { redirect } from 'next/navigation'

import { CACHE_TAGS, berryDetailTag, type BerryDetail, type CreateResult } from '@poke/core'
import { saveCustomBerry } from '@poke/core/services'

import { toCreateBerryPayload } from '../../lib/berry-form'

export type CreateBerryActionState = CreateResult<BerryDetail> | null

/**
 * Server Action for the add-berry form. Validates inside `@poke/core`, then refreshes the affected
 * caches — `updateTag` gives read-your-writes, so the new entry is visible immediately.
 */
export async function createBerryAction(
  _previousState: CreateBerryActionState,
  formData: FormData,
): Promise<CreateBerryActionState> {
  const result = await saveCustomBerry(toCreateBerryPayload(formData))

  if (!result.ok) return result

  updateTag(CACHE_TAGS.berries)
  updateTag(berryDetailTag(result.data.name))

  redirect(`/berries/${result.data.name}`)
}
