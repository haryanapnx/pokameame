'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useTransition } from 'react'

import { buildQueryHref, type QueryParamUpdates } from './query-href'

export type UseQueryParamsResult = {
  get: (key: string) => string | null
  /** Replaces the URL, wrapped in a transition so the current UI stays responsive. */
  setParams: (updates: QueryParamUpdates) => void
  isPending: boolean
}

/** Keeps list state (page, query) in the URL — the single source of truth for server rendering. */
export function useQueryParams(): UseQueryParamsResult {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const get = useCallback((key: string) => searchParams.get(key), [searchParams])

  const setParams = useCallback(
    (updates: QueryParamUpdates) => {
      const href = buildQueryHref(pathname, searchParams.toString(), updates)

      startTransition(() => {
        router.replace(href, { scroll: false })
      })
    },
    [pathname, router, searchParams],
  )

  return { get, setParams, isPending }
}
