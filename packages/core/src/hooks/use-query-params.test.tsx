import { act, renderHook } from '@testing-library/react'

import { useQueryParams } from './use-query-params'

const mocks = vi.hoisted(() => ({
  replace: vi.fn(),
  searchParams: new URLSearchParams('page=2&q=bulba'),
}))

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: mocks.replace }),
  usePathname: () => '/pokemon',
  useSearchParams: () => mocks.searchParams,
}))

describe('useQueryParams', () => {
  beforeEach(() => {
    mocks.replace.mockClear()
  })

  it('reads the current value of a parameter', () => {
    const { result } = renderHook(() => useQueryParams())

    expect(result.current.get('q')).toBe('bulba')
    expect(result.current.get('page')).toBe('2')
    expect(result.current.get('missing')).toBeNull()
  })

  it('replaces the URL with the merged query string', () => {
    const { result } = renderHook(() => useQueryParams())

    act(() => {
      result.current.setParams({ q: 'pika' })
    })

    expect(mocks.replace).toHaveBeenCalledWith('/pokemon?page=2&q=pika', { scroll: false })
  })

  it('removes a parameter when cleared', () => {
    const { result } = renderHook(() => useQueryParams())

    act(() => {
      result.current.setParams({ page: null })
    })

    expect(mocks.replace).toHaveBeenCalledWith('/pokemon?q=bulba', { scroll: false })
  })

  it('exposes a pending flag from the transition', () => {
    const { result } = renderHook(() => useQueryParams())

    expect(result.current.isPending).toBe(false)
  })
})
