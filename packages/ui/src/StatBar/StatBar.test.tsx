import { render, screen } from '@testing-library/react'

import { StatBar } from './StatBar'

describe('StatBar', () => {
  it('exposes a labelled progressbar with the value', () => {
    render(<StatBar label="hp" value={45} />)

    const bar = screen.getByRole('progressbar', { name: 'hp' })
    expect(bar).toHaveAttribute('aria-valuenow', '45')
    expect(bar).toHaveAttribute('aria-valuemax', '255')
  })

  it('renders the numeric value and label', () => {
    render(<StatBar label="attack" value={52} />)

    expect(screen.getByText('attack')).toBeInTheDocument()
    expect(screen.getByText('52')).toBeInTheDocument()
  })

  it('clamps out-of-range values', () => {
    render(<StatBar label="speed" value={999} max={255} />)

    expect(screen.getByRole('progressbar', { name: 'speed' })).toHaveAttribute(
      'aria-valuenow',
      '255',
    )
  })
})
