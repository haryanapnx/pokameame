import { displayName, formatId } from './format'

describe('displayName', () => {
  it('capitalises a single word', () => {
    expect(displayName('pikachu')).toBe('Pikachu')
    expect(displayName('cheri')).toBe('Cheri')
  })

  it('turns hyphens into spaces and capitalises each word', () => {
    expect(displayName('mr-mime')).toBe('Mr Mime')
    expect(displayName('ho-oh')).toBe('Ho Oh')
    expect(displayName('very-soft')).toBe('Very Soft')
  })
})

describe('formatId', () => {
  it('pads short ids to three digits', () => {
    expect(formatId(25)).toBe('#025')
    expect(formatId(1)).toBe('#001')
  })

  it('leaves longer ids untouched', () => {
    expect(formatId(1000)).toBe('#1000')
  })

  it('honours a custom padding', () => {
    expect(formatId(7, 1)).toBe('#7')
  })
})
