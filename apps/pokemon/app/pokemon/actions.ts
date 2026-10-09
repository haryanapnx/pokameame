'use server'

import { updateTag } from 'next/cache'
import { redirect } from 'next/navigation'

import { CACHE_TAGS, pokemonDetailTag, type CreateResult, type PokemonDetail } from '@poke/core'
import { saveCustomPokemon } from '@poke/core/services'

import { toCreatePokemonPayload } from '../../lib/pokemon-form'

export type CreatePokemonActionState = CreateResult<PokemonDetail> | null

export async function createPokemonAction(
  _previousState: CreatePokemonActionState,
  formData: FormData,
): Promise<CreatePokemonActionState> {
  const result = await saveCustomPokemon(toCreatePokemonPayload(formData))

  if (!result.ok) return result

  updateTag(CACHE_TAGS.pokemon)
  updateTag(pokemonDetailTag(result.data.name))

  redirect(`/pokemon/${result.data.name}`)
}
