import { render, screen } from '@testing-library/react'

import { FlavorList } from './FlavorList'

describe('FlavorList', () => {
  it('renders a bounded bar per flavour', () => {
    render(<FlavorList flavors={[{ name: 'spicy', potency: 20 }]} />)

    const bar = screen.getByRole('progressbar', { name: 'spicy' })
    expect(bar).toHaveAttribute('aria-valuenow', '20')
    expect(bar).toHaveAttribute('aria-valuemax', '40')
  })

  it('explains when there are no flavours', () => {
    render(<FlavorList flavors={[]} />)

    expect(screen.getByText('No flavours recorded.')).toBeInTheDocument()
  })
})
