import { validateCustomPokemonInput } from './validation'

const valid = {
  name: 'Pika Blu',
  types: ['electric'],
  abilities: [{ name: 'static', isHidden: false }],
  stats: [{ name: 'hp', value: 35 }],
}

describe('validateCustomPokemonInput', () => {
  it('normalises the name and returns a typed value', () => {
    const result = validateCustomPokemonInput(valid)

    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.value.name).toBe('pika-blu')
      expect(result.value.types).toEqual(['electric'])
    }
  })

  it('rejects a non-object payload', () => {
    expect(validateCustomPokemonInput(null).ok).toBe(false)
  })

  it('requires a name', () => {
    const result = validateCustomPokemonInput({ ...valid, name: '   ' })

    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.issues.map((issue) => issue.field)).toContain('name')
  })

  it('rejects names with unsupported characters', () => {
    expect(validateCustomPokemonInput({ ...valid, name: 'pika@chu' }).ok).toBe(false)
  })

  it('requires at least one type', () => {
    const result = validateCustomPokemonInput({ ...valid, types: [] })

    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.issues.map((issue) => issue.field)).toContain('types')
  })

  it('rejects more than two types', () => {
    expect(validateCustomPokemonInput({ ...valid, types: ['a', 'b', 'c'] }).ok).toBe(false)
  })

  it('requires at least one stat and bounds its value', () => {
    expect(validateCustomPokemonInput({ ...valid, stats: [] }).ok).toBe(false)
    expect(validateCustomPokemonInput({ ...valid, stats: [{ name: 'hp', value: 999 }] }).ok).toBe(
      false,
    )
  })

  it('accepts optional dimensions and base experience', () => {
    const result = validateCustomPokemonInput({
      ...valid,
      height: 4,
      weight: 69,
      baseExperience: 64,
    })

    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.value).toMatchObject({ height: 4, weight: 69, baseExperience: 64 })
    }
  })

  it('keeps the optional details absent when they are not given', () => {
    const result = validateCustomPokemonInput(valid)

    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.value.height).toBeUndefined()
      expect(result.value.weight).toBeUndefined()
      expect(result.value.baseExperience).toBeUndefined()
    }
  })

  it('allows heavy Pokemon', () => {
    const result = validateCustomPokemonInput({ ...valid, weight: 4600 })

    expect(result.ok).toBe(true)
    if (result.ok) expect(result.value.weight).toBe(4600)
  })

  it('rejects out-of-range dimensions and base experience', () => {
    const height = validateCustomPokemonInput({ ...valid, height: 5000 })
    const weight = validateCustomPokemonInput({ ...valid, weight: 99_999 })
    const baseExperience = validateCustomPokemonInput({ ...valid, baseExperience: 5000 })

    expect(height.ok).toBe(false)
    expect(weight.ok).toBe(false)
    expect(baseExperience.ok).toBe(false)
    if (!height.ok) expect(height.issues.map((issue) => issue.field)).toContain('height')
    if (!weight.ok) expect(weight.issues.map((issue) => issue.field)).toContain('weight')
    if (!baseExperience.ok) {
      expect(baseExperience.issues.map((issue) => issue.field)).toContain('baseExperience')
    }
  })

  it('rejects a non-numeric base experience', () => {
    const result = validateCustomPokemonInput({ ...valid, baseExperience: 'lots' })

    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.issues.map((issue) => issue.field)).toContain('baseExperience')
  })

  it('reports every problem at once', () => {
    const result = validateCustomPokemonInput({ name: '', types: [], stats: [] })

    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.issues.map((issue) => issue.field)).toEqual(
        expect.arrayContaining(['name', 'types', 'stats']),
      )
    }
  })
})
