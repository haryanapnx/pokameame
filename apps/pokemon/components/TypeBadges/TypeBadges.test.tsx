import { render, screen } from '@testing-library/react'

import { TypeBadges } from './TypeBadges'

describe('TypeBadges', () => {
  it('renders one badge per type', () => {
    render(<TypeBadges types={['grass', 'poison']} />)

    expect(screen.getByText('grass')).toBeInTheDocument()
    expect(screen.getByText('poison')).toBeInTheDocument()
  })

  it('merges className overrides', () => {
    const { container } = render(<TypeBadges types={['water']} className="mt-4" />)

    expect(container.firstElementChild).toHaveClass('mt-4')
  })

  it('renders nothing when there are no types', () => {
    const { container } = render(<TypeBadges types={[]} />)

    expect(container.firstElementChild?.childElementCount).toBe(0)
  })
})
