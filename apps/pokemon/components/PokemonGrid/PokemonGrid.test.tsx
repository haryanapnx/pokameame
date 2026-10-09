import { render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'

import type { PokemonSummary } from '@poke/core'

import { PokemonGrid } from './PokemonGrid'

vi.mock('next/link', () => ({
  default: ({ href, children, ...rest }: { href: string; children: ReactNode }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}))

vi.mock('next/image', () => ({ default: () => null }))

function makePokemon(id: number, name: string): PokemonSummary {
  return { id, name, spriteUrl: null, types: ['normal'], origin: 'pokeapi' }
}

describe('PokemonGrid', () => {
  it('renders a card per Pokemon', () => {
    render(<PokemonGrid items={[makePokemon(1, 'bulbasaur'), makePokemon(4, 'charmander')]} />)

    expect(screen.getAllByRole('link')).toHaveLength(2)
    expect(screen.getByRole('link', { name: /Bulbasaur/ })).toHaveAttribute(
      'href',
      '/pokemon/bulbasaur',
    )
  })

  it('renders nothing for an empty list', () => {
    const { container } = render(<PokemonGrid items={[]} />)

    expect(container.querySelectorAll('a')).toHaveLength(0)
  })
})
