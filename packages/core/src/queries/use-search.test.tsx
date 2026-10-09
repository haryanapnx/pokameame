import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'

import { useCatalogSearch } from './use-search'

function createWrapper() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })

  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={client}>{children}</QueryClientProvider>
  }
}

const baseOptions = { endpoint: '/api/pokemon/search', kind: 'pokemon' as const }

describe('useCatalogSearch', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('stays idle while the query is blank', () => {
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)

    const { result } = renderHook(() => useCatalogSearch({ ...baseOptions, query: '   ' }), {
      wrapper: createWrapper(),
    })

    expect(result.current.fetchStatus).toBe('idle')
    expect(result.current.isLoading).toBe(false)
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('requests the Route Handler with the trimmed term', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [{ name: 'pikachu', origin: 'pokeapi' }],
    })
    vi.stubGlobal('fetch', fetchMock)

    const { result } = renderHook(() => useCatalogSearch({ ...baseOptions, query: '  pika ' }), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(fetchMock).toHaveBeenCalledWith('/api/pokemon/search?q=pika&limit=8')
    expect(result.current.data).toEqual([{ name: 'pikachu', origin: 'pokeapi' }])
  })

  it('drops malformed entries from the response', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => [
          { name: 'pikachu', origin: 'pokeapi' },
          { name: 'Pikablu', origin: 'custom', id: 3 },
          { name: 42 },
          null,
          { origin: 'custom' },
        ],
      }),
    )

    const { result } = renderHook(() => useCatalogSearch({ ...baseOptions, query: 'pika' }), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toEqual([
      { name: 'pikachu', origin: 'pokeapi' },
      { name: 'Pikablu', origin: 'custom', id: 3 },
    ])
  })

  it('exposes an error when the request fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 500 }))

    const { result } = renderHook(() => useCatalogSearch({ ...baseOptions, query: 'pika' }), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isError).toBe(true))

    expect(result.current.error?.message).toContain('500')
  })

  it('can be disabled explicitly', () => {
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)

    const { result } = renderHook(
      () => useCatalogSearch({ ...baseOptions, query: 'pika', enabled: false }),
      { wrapper: createWrapper() },
    )

    expect(result.current.fetchStatus).toBe('idle')
    expect(fetchMock).not.toHaveBeenCalled()
  })
})
