import { toBerryDetail, toBerrySummary, toCustomBerryDetail } from './mappers'
import { parseRawBerry } from './schemas'

const raw = parseRawBerry({
  id: 1,
  name: 'cheri',
  growth_time: 3,
  max_harvest: 5,
  natural_gift_power: 60,
  size: 20,
  smoothness: 25,
  soil_dryness: 15,
  firmness: { name: 'soft' },
  flavors: [
    { potency: 10, flavor: { name: 'spicy' } },
    { potency: 0, flavor: { name: 'sweet' } },
  ],
  item: { name: 'cheri-berry' },
  natural_gift_type: { name: 'fire' },
})

describe('berry mappers', () => {
  it('maps a summary flagged as upstream', () => {
    expect(toBerrySummary(raw)).toEqual({
      id: 1,
      name: 'cheri',
      firmness: 'soft',
      growthTime: 3,
      origin: 'pokeapi',
    })
  })

  it('maps a detail with flavors and effects', () => {
    const detail = toBerryDetail(raw)

    expect(detail.flavors).toEqual([
      { name: 'spicy', potency: 10 },
      { name: 'sweet', potency: 0 },
    ])
    expect(detail.maxHarvest).toBe(5)
    expect(detail.naturalGiftPower).toBe(60)
    expect(detail.naturalGiftType).toBe('fire')
    expect(detail.size).toBe(20)
    expect(detail.smoothness).toBe(25)
    expect(detail.soilDryness).toBe(15)
    expect(detail.itemName).toBe('cheri-berry')
  })

  it('falls back to nulls when optional resources are absent', () => {
    const detail = toBerryDetail(parseRawBerry({ ...raw, item: null, natural_gift_type: null }))

    expect(detail.itemName).toBeNull()
    expect(detail.naturalGiftType).toBeNull()
  })

  it('builds a custom detail flagged as custom', () => {
    const custom = toCustomBerryDetail(
      {
        name: 'mystery-berry',
        firmness: 'very-soft',
        growthTime: 12,
        flavors: [{ name: 'bitter', potency: 20 }],
      },
      9001,
    )

    expect(custom).toMatchObject({
      id: 9001,
      name: 'mystery-berry',
      firmness: 'very-soft',
      growthTime: 12,
      origin: 'custom',
      maxHarvest: 0,
      naturalGiftType: null,
      itemName: null,
    })
    expect(custom.flavors).toEqual([{ name: 'bitter', potency: 20 }])
  })
})
