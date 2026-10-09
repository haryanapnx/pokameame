'use client'

import { useCallback, useState } from 'react'

export type AsyncActionController<Args extends unknown[]> = {
  run: (...args: Args) => Promise<void>
  isPending: boolean
  error: string | null
  reset: () => void
}

/**
 * Wraps an async action with pending/error state. `run` resolves once the action settles, so
 * callers can await it; failures are captured as `error` instead of rejecting.
 */
export function useAsyncAction<Args extends unknown[]>(
  action: (...args: Args) => Promise<unknown>,
): AsyncActionController<Args> {
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const run = useCallback(
    async (...args: Args) => {
      setError(null)
      setIsPending(true)

      try {
        await action(...args)
      } catch (cause) {
        setError(cause instanceof Error ? cause.message : 'Something went wrong')
      } finally {
        setIsPending(false)
      }
    },
    [action],
  )

  const reset = useCallback(() => {
    setError(null)
  }, [])

  return { run, isPending, error, reset }
}
