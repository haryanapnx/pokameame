import { render, screen } from '@testing-library/react'

import { ErrorState } from './ErrorState'

describe('ErrorState', () => {
  it('announces the failure with role=alert', () => {
    render(<ErrorState description="PokeAPI is unavailable" />)

    const alert = screen.getByRole('alert')
    expect(alert).toHaveTextContent('Something went wrong')
    expect(alert).toHaveTextContent('PokeAPI is unavailable')
  })

  it('renders a retry action', () => {
    render(<ErrorState action={<button type="button">Retry</button>} />)

    expect(screen.getByRole('button', { name: 'Retry' })).toBeInTheDocument()
  })
})
