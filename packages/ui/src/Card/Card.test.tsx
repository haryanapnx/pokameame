import { render, screen } from '@testing-library/react'

import { Card } from './Card'

describe('Card', () => {
  it('renders its content', () => {
    render(<Card>Pikachu</Card>)

    expect(screen.getByText('Pikachu')).toBeInTheDocument()
  })

  it('merges className overrides', () => {
    render(<Card className="p-8" data-testid="card" />)

    expect(screen.getByTestId('card')).toHaveClass('p-8')
  })
})
