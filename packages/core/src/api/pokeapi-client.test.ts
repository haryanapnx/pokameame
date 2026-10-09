import { PokeApiRequestError, PokeApiTimeoutError } from '../errors'

import { createPokeApiClient } from './pokeapi-client'

function jsonResponse(body: unknown, init: { ok?: boolean; status?: number } = {}): Response {
  return {
    ok: init.ok ?? true,
    status: init.status ?? 200,
    json: async () => body,
  } as unknown as Response
}

describe('createPokeApiClient', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    vi.unstubAllEnvs()
    vi.useRealTimers()
  })

  it('requests the given path against the base URL', async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse({ ok: true }))
    vi.stubGlobal('fetch', fetchMock)

    const client = createPokeApiClient({ baseUrl: 'https://example.test/api/v2/' })

    await expect(client.get('pokemon/25')).resolves.toEqual({ ok: true })
    expect(fetchMock).toHaveBeenCalledWith(
      'https://example.test/api/v2/pokemon/25',
      expect.objectContaining({ headers: { accept: 'application/json' } }),
    )
  })

  it('falls back to POKEAPI_BASE_URL from the environment', async () => {
    vi.stubEnv('POKEAPI_BASE_URL', 'https://env.example.test/v2')
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse({}))
    vi.stubGlobal('fetch', fetchMock)

    await createPokeApiClient().get('berry/1')

    expect(fetchMock.mock.calls[0]?.[0]).toBe('https://env.example.test/v2/berry/1')
  })

  it('throws a typed error on a non-2xx response', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse({}, { ok: false, status: 404 })))

    await expect(createPokeApiClient().get('pokemon/missing')).rejects.toMatchObject({
      name: 'PokeApiRequestError',
      status: 404,
    })
  })

  it('throws a typed error when the body is not valid JSON', async () => {
    const badJson = {
      ok: true,
      status: 200,
      json: async () => {
        throw new SyntaxError('bad json')
      },
    } as unknown as Response
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(badJson))

    await expect(createPokeApiClient().get('pokemon/25')).rejects.toBeInstanceOf(
      PokeApiRequestError,
    )
  })

  it('aborts and reports a timeout when the request is too slow', async () => {
    vi.useFakeTimers()
    const hangingFetch = vi.fn(
      (_url: string, init?: RequestInit) =>
        new Promise((_resolve, reject) => {
          init?.signal?.addEventListener('abort', () =>
            reject(new DOMException('Aborted', 'AbortError')),
          )
        }),
    )
    vi.stubGlobal('fetch', hangingFetch)

    const client = createPokeApiClient({ timeoutMs: 50 })
    const pending = client.get('pokemon/25')
    const expectation = expect(pending).rejects.toBeInstanceOf(PokeApiTimeoutError)

    await vi.advanceTimersByTimeAsync(50)

    await expectation
  })

  it('wraps network failures with status 0', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('network down')))

    await expect(createPokeApiClient().get('pokemon/25')).rejects.toMatchObject({
      name: 'PokeApiRequestError',
      status: 0,
    })
  })
})
