import { validateCustomBerryInput } from './validation'

const valid = {
  name: 'Mystery Berry',
  firmness: 'very-soft',
  growthTime: 12,
  flavors: [{ name: 'bitter', potency: 20 }],
}

describe('validateCustomBerryInput', () => {
  it('normalises the name and returns a typed value', () => {
    const result = validateCustomBerryInput(valid)

    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.value.name).toBe('mystery-berry')
      expect(result.value.firmness).toBe('very-soft')
      expect(result.value.naturalGiftType).toBeNull()
    }
  })

  it('rejects a non-object payload', () => {
    expect(validateCustomBerryInput('cheri').ok).toBe(false)
  })

  it('requires firmness and a non-negative growth time', () => {
    const missingFirmness = validateCustomBerryInput({ ...valid, firmness: '' })
    const negativeGrowth = validateCustomBerryInput({ ...valid, growthTime: -1 })

    expect(missingFirmness.ok).toBe(false)
    expect(negativeGrowth.ok).toBe(false)
  })

  it('requires at least one flavor and bounds potency', () => {
    expect(validateCustomBerryInput({ ...valid, flavors: [] }).ok).toBe(false)
    expect(
      validateCustomBerryInput({ ...valid, flavors: [{ name: 'bitter', potency: 999 }] }).ok,
    ).toBe(false)
  })

  it('accepts optional properties', () => {
    const result = validateCustomBerryInput({
      ...valid,
      maxHarvest: 5,
      naturalGiftPower: 60,
      size: 20,
      smoothness: 25,
      soilDryness: 15,
      naturalGiftType: 'fire',
      itemName: 'mystery-berry',
    })

    expect(result.ok).toBe(true)
    if (result.ok) expect(result.value).toMatchObject({ maxHarvest: 5, naturalGiftType: 'fire' })
  })

  it('reports every problem at once', () => {
    const result = validateCustomBerryInput({ name: '', firmness: '', growthTime: -5, flavors: [] })

    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.issues.map((issue) => issue.field)).toEqual(
        expect.arrayContaining(['name', 'firmness', 'growthTime', 'flavors']),
      )
    }
  })
})
