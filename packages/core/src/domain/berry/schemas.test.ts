import { PokeApiParseError } from '../../errors'

import { parseRawBerry } from './schemas'

const validRaw = {
  id: 1,
  name: 'cheri',
  growth_time: 3,
  max_harvest: 5,
  natural_gift_power: 60,
  size: 20,
  smoothness: 25,
  soil_dryness: 15,
  firmness: { name: 'soft' },
  flavors: [{ potency: 10, flavor: { name: 'spicy' } }],
  item: { name: 'cheri-berry' },
  natural_gift_type: { name: 'fire' },
}

describe('parseRawBerry', () => {
  it('parses a valid payload', () => {
    const parsed = parseRawBerry(validRaw)

    expect(parsed.name).toBe('cheri')
    expect(parsed.firmness.name).toBe('soft')
    expect(parsed.flavors[0]?.flavor.name).toBe('spicy')
    expect(parsed.natural_gift_type?.name).toBe('fire')
  })

  it('rejects a non-object payload', () => {
    expect(() => parseRawBerry('cheri')).toThrow(PokeApiParseError)
  })

  it('rejects a payload without firmness', () => {
    expect(() => parseRawBerry({ ...validRaw, firmness: undefined })).toThrow(PokeApiParseError)
  })

  it('rejects a malformed flavor entry', () => {
    expect(() => parseRawBerry({ ...validRaw, flavors: [{ potency: 'lots' }] })).toThrow(
      PokeApiParseError,
    )
  })

  it('tolerates absent optional resources', () => {
    const parsed = parseRawBerry({ ...validRaw, item: null, natural_gift_type: null })

    expect(parsed.item).toBeNull()
    expect(parsed.natural_gift_type).toBeNull()
  })
})
