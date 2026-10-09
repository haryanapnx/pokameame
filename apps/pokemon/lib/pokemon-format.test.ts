import { formatHeight, formatWeight } from './pokemon-format'

describe('formatHeight', () => {
  it('converts decimetres to metres', () => {
    expect(formatHeight(4)).toBe('0.4 m')
    expect(formatHeight(17)).toBe('1.7 m')
  })
})

describe('formatWeight', () => {
  it('converts hectograms to kilograms', () => {
    expect(formatWeight(60)).toBe('6.0 kg')
    expect(formatWeight(905)).toBe('90.5 kg')
  })
})
