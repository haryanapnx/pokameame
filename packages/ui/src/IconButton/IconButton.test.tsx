import { render, screen } from '@testing-library/react'

import { IconButton } from '../IconButton/IconButton'

describe('IconButton', () => {
  it('is exposed by its accessible name', () => {
    render(
      <IconButton aria-label="Close">
        <span aria-hidden="true">x</span>
      </IconButton>,
    )

    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument()
  })

  it('merges className overrides', () => {
    render(<IconButton aria-label="Menu" className="size-12" />)

    expect(screen.getByRole('button', { name: 'Menu' })).toHaveClass('size-12')
  })
})
