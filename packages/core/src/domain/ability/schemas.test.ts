import { PokeApiParseError } from '../../errors'

import { toAbilityDetail } from './mappers'
import { parseRawAbility } from './schemas'

const validRaw = {
  id: 9,
  name: 'static',
  generation: { name: 'generation-iii' },
  effect_entries: [
    { short_effect: 'Berührung kann lähmen.', language: { name: 'de' } },
    { short_effect: 'Contact with the Pokemon may paralyze.', language: { name: 'en' } },
  ],
}

describe('parseRawAbility', () => {
  it('parses the effect entries and generation', () => {
    const parsed = parseRawAbility(validRaw)

    expect(parsed.name).toBe('static')
    expect(parsed.effect_entries).toHaveLength(2)
    expect(parsed.generation?.name).toBe('generation-iii')
  })

  it('tolerates a missing generation', () => {
    expect(parseRawAbility({ ...validRaw, generation: null }).generation).toBeNull()
  })

  it('rejects malformed effect entries', () => {
    expect(() => parseRawAbility({ ...validRaw, effect_entries: [{}] })).toThrow(PokeApiParseError)
    expect(() => parseRawAbility({ name: 'static' })).toThrow(PokeApiParseError)
  })
})

describe('toAbilityDetail', () => {
  it('prefers the English short effect', () => {
    expect(toAbilityDetail(parseRawAbility(validRaw))).toEqual({
      id: 9,
      name: 'static',
      effect: 'Contact with the Pokemon may paralyze.',
      generation: 'generation-iii',
    })
  })

  it('falls back to the first entry when English is missing', () => {
    const raw = parseRawAbility({
      ...validRaw,
      effect_entries: [{ short_effect: 'Deutsch', language: { name: 'de' } }],
    })

    expect(toAbilityDetail(raw).effect).toBe('Deutsch')
  })

  it('returns null when there are no effect entries', () => {
    const raw = parseRawAbility({ ...validRaw, effect_entries: [] })

    expect(toAbilityDetail(raw).effect).toBeNull()
  })
})
