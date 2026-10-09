'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState, type ReactNode } from 'react'

export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60_000,
        gcTime: 5 * 60_000,
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  })
}

export type QueryProviderProps = {
  children: ReactNode
  /** Inject a client (used by tests); otherwise one is created per mount. */
  client?: QueryClient
}

/**
 * Client cache provider for browser-fetched data only. The server cache stays the source of
 * truth; each zone wraps its layout in this provider.
 */
export function QueryProvider({ children, client }: QueryProviderProps) {
  const [queryClient] = useState(() => client ?? createQueryClient())

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
