import { render, screen } from '@testing-library/react'

import { TypeBadge, typeBadgeClass } from './TypeBadge'

describe('TypeBadge', () => {
  it('renders the type name', () => {
    render(<TypeBadge type="fire" />)

    expect(screen.getByText('fire')).toBeInTheDocument()
  })

  it('maps a known type to its token class', () => {
    expect(typeBadgeClass('fire')).toContain('bg-type-fire')
    expect(typeBadgeClass('WATER')).toContain('bg-type-water')
  })

  it('falls back to a neutral style for unknown types', () => {
    expect(typeBadgeClass('cosmic')).toContain('bg-slate-200')
  })
})
