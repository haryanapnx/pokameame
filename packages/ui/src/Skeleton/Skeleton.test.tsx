import { render, screen } from '@testing-library/react'

import { Skeleton } from './Skeleton'

describe('Skeleton', () => {
  it('is hidden from assistive technology', () => {
    render(<Skeleton data-testid="s" />)

    expect(screen.getByTestId('s')).toHaveAttribute('aria-hidden', 'true')
  })

  it('accepts sizing classes for layout stability', () => {
    render(<Skeleton data-testid="s" className="h-24 w-full" />)

    expect(screen.getByTestId('s')).toHaveClass('h-24', 'w-full')
  })
})
