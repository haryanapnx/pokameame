import { render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'

import type { BerrySummary } from '@poke/core'

import { BerryGrid } from './BerryGrid'

vi.mock('next/link', () => ({
  default: ({ href, children, ...rest }: { href: string; children: ReactNode }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}))

function makeBerry(id: number, name: string): BerrySummary {
  return { id, name, firmness: 'soft', growthTime: 3, origin: 'pokeapi' }
}

describe('BerryGrid', () => {
  it('renders a card per berry', () => {
    render(<BerryGrid items={[makeBerry(1, 'cheri'), makeBerry(2, 'chesto')]} />)

    expect(screen.getAllByRole('link')).toHaveLength(2)
    expect(screen.getByRole('link', { name: /Cheri/ })).toHaveAttribute('href', '/berries/cheri')
  })

  it('renders nothing for an empty list', () => {
    const { container } = render(<BerryGrid items={[]} />)

    expect(container.querySelectorAll('a')).toHaveLength(0)
  })
})
