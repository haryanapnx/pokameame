import { useQueryClient } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'

import { QueryProvider, createQueryClient } from './query-provider'

function Probe() {
  const client = useQueryClient()

  return <span data-testid="probe">{client === undefined ? 'missing' : 'ready'}</span>
}

describe('QueryProvider', () => {
  it('provides a query client to its children', () => {
    render(
      <QueryProvider>
        <Probe />
      </QueryProvider>,
    )

    expect(screen.getByTestId('probe').textContent).toBe('ready')
  })

  it('accepts an injected client', () => {
    render(
      <QueryProvider client={createQueryClient()}>
        <Probe />
      </QueryProvider>,
    )

    expect(screen.getByTestId('probe').textContent).toBe('ready')
  })

  it('uses client-cache defaults suited to the hybrid model', () => {
    const options = createQueryClient().getDefaultOptions()

    expect(options.queries?.staleTime).toBe(60_000)
    expect(options.queries?.retry).toBe(1)
    expect(options.queries?.refetchOnWindowFocus).toBe(false)
  })
})
