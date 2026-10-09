import { render, screen } from '@testing-library/react'

import { Grid } from './Grid'

describe('Grid', () => {
  it('is responsive for the given column count', () => {
    render(<Grid data-testid="g" columns={3} />)

    expect(screen.getByTestId('g')).toHaveClass('grid', 'grid-cols-1', 'lg:grid-cols-3')
  })

  it('defaults to three columns', () => {
    render(<Grid data-testid="g" />)

    expect(screen.getByTestId('g')).toHaveClass('lg:grid-cols-3')
  })
})
