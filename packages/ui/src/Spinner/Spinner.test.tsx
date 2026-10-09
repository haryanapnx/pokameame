import { render, screen } from '@testing-library/react'

import { Spinner } from './Spinner'

describe('Spinner', () => {
  it('exposes a status role with an accessible name', () => {
    render(<Spinner />)

    expect(screen.getByRole('status', { name: 'Loading' })).toBeInTheDocument()
  })

  it('accepts a custom label', () => {
    render(<Spinner label="Loading Pokemon" />)

    expect(screen.getByRole('status', { name: 'Loading Pokemon' })).toBeInTheDocument()
  })
})
