import { cn } from './cn'

describe('cn', () => {
  it('joins class names with a single space', () => {
    expect(cn('px-2', 'py-1')).toBe('px-2 py-1')
  })

  it('resolves conflicting utilities with the last value winning', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4')
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500')
  })

  it('ignores falsy and conditional values', () => {
    const isHidden = false
    expect(cn('base', isHidden && 'hidden', undefined, null, 'extra')).toBe('base extra')
  })

  it('lets a later conditional class override an earlier one', () => {
    const isActive = true
    expect(cn('p-2', isActive && 'p-4')).toBe('p-4')
  })
})
