import { render, screen } from '@testing-library/react'

import { Container } from './Container'

describe('Container', () => {
  it('applies the default large max width and padding', () => {
    render(<Container data-testid="c" />)

    expect(screen.getByTestId('c')).toHaveClass('max-w-7xl', 'mx-auto')
  })

  it('supports other sizes', () => {
    render(<Container data-testid="c" size="sm" />)

    expect(screen.getByTestId('c')).toHaveClass('max-w-3xl')
  })
})
