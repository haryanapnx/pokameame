import type { RawAbility } from './schemas'
import type { AbilityDetail } from './types'

/** Picks the English short effect, falling back to the first entry PokeAPI provides. */
export function toAbilityDetail(raw: RawAbility): AbilityDetail {
  const english = raw.effect_entries.find((entry) => entry.language.name === 'en')

  return {
    id: raw.id,
    name: raw.name,
    effect: english?.short_effect ?? raw.effect_entries[0]?.short_effect ?? null,
    generation: raw.generation?.name ?? null,
  }
}
