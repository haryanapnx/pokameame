import { render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'

import type { BerrySummary } from '@poke/core'

import { BerryCard } from './BerryCard'

vi.mock('next/link', () => ({
  default: ({ href, children, ...rest }: { href: string; children: ReactNode }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}))

const cheri: BerrySummary = {
  id: 1,
  name: 'cheri',
  firmness: 'soft',
  growthTime: 3,
  origin: 'pokeapi',
}

describe('BerryCard', () => {
  it('links to the detail page', () => {
    render(<BerryCard berry={cheri} />)

    expect(screen.getByRole('link')).toHaveAttribute('href', '/berries/cheri')
  })

  it('shows the id, name, firmness and growth time', () => {
    render(<BerryCard berry={cheri} />)

    expect(screen.getByText('#001')).toBeInTheDocument()
    expect(screen.getByText('Cheri')).toBeInTheDocument()
    expect(screen.getByText('Soft')).toBeInTheDocument()
    expect(screen.getByText('3 h')).toBeInTheDocument()
  })

  it('badges custom entries', () => {
    render(<BerryCard berry={{ ...cheri, origin: 'custom' }} />)

    expect(screen.getByText('Custom')).toBeInTheDocument()
  })
})
