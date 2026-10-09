import { act, renderHook, waitFor } from '@testing-library/react'

import { useAsyncAction } from './use-async-action'

describe('useAsyncAction', () => {
  it('starts idle', () => {
    const { result } = renderHook(() => useAsyncAction(async () => undefined))

    expect(result.current.isPending).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it('reports pending while the action runs', async () => {
    let resolveAction: () => void = () => {}
    const action = vi.fn(
      () =>
        new Promise<void>((resolve) => {
          resolveAction = resolve
        }),
    )
    const { result } = renderHook(() => useAsyncAction(action))

    let pendingRun: Promise<void> = Promise.resolve()
    act(() => {
      pendingRun = result.current.run()
    })
    expect(result.current.isPending).toBe(true)

    await act(async () => {
      resolveAction()
      await pendingRun
    })
    expect(result.current.isPending).toBe(false)
  })

  it('captures the error message instead of rejecting', async () => {
    const action = vi.fn(async () => {
      throw new Error('database is down')
    })
    const { result } = renderHook(() => useAsyncAction(action))

    await act(async () => {
      await result.current.run()
    })

    expect(result.current.error).toBe('database is down')
    expect(result.current.isPending).toBe(false)
  })

  it('falls back to a generic message for non-Error rejections', async () => {
    const action = vi.fn(async () => {
      throw 'nope'
    })
    const { result } = renderHook(() => useAsyncAction(action))

    await act(async () => {
      await result.current.run()
    })

    expect(result.current.error).toBe('Something went wrong')
  })

  it('passes arguments through to the action', async () => {
    const action = vi.fn(async (value: number) => value)
    const { result } = renderHook(() => useAsyncAction(action))

    await act(async () => {
      await result.current.run(42)
    })

    expect(action).toHaveBeenCalledWith(42)
    await waitFor(() => expect(result.current.isPending).toBe(false))
  })

  it('clears the error on reset and on a new run', async () => {
    const action = vi.fn(async () => {
      throw new Error('boom')
    })
    const { result } = renderHook(() => useAsyncAction(action))

    await act(async () => {
      await result.current.run()
    })
    expect(result.current.error).toBe('boom')

    act(() => {
      result.current.reset()
    })
    expect(result.current.error).toBeNull()
  })
})
