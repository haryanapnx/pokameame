import { render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'

import type { PokemonSummary } from '@poke/core'

import { PokemonCard } from './PokemonCard'

vi.mock('next/link', () => ({
  default: ({ href, children, ...rest }: { href: string; children: ReactNode }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}))

vi.mock('next/image', () => ({ default: () => null }))

const pikachu: PokemonSummary = {
  id: 25,
  name: 'pikachu',
  spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/pikachu.png',
  types: ['electric'],
  origin: 'pokeapi',
}

describe('PokemonCard', () => {
  it('links to the detail page', () => {
    render(<PokemonCard pokemon={pikachu} />)

    expect(screen.getByRole('link')).toHaveAttribute('href', '/pokemon/pikachu')
  })

  it('shows the padded id, name and types', () => {
    render(<PokemonCard pokemon={pikachu} />)

    expect(screen.getByText('#025')).toBeInTheDocument()
    expect(screen.getByText('Pikachu')).toBeInTheDocument()
    expect(screen.getByText('electric')).toBeInTheDocument()
  })

  it('badges custom entries', () => {
    render(<PokemonCard pokemon={{ ...pikachu, origin: 'custom' }} />)

    expect(screen.getByText('Custom')).toBeInTheDocument()
  })

  it('falls back to the numeric id when there is no sprite', () => {
    render(<PokemonCard pokemon={{ ...pikachu, spriteUrl: null }} />)

    expect(screen.getByText('25')).toBeInTheDocument()
  })
})
