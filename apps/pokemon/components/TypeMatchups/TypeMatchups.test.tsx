import { render, screen } from '@testing-library/react'

import type { DefensiveMatchups } from '@poke/core'

import { TypeMatchups, formatTypeMultiplier } from './TypeMatchups'

const matchups: DefensiveMatchups = {
  weakTo: [
    { type: 'fire', multiplier: 4 },
    { type: 'ice', multiplier: 2 },
  ],
  resistantTo: [{ type: 'water', multiplier: 0.25 }],
  immuneTo: ['ground'],
}

describe('formatTypeMultiplier', () => {
  it('renders common fractions', () => {
    expect(formatTypeMultiplier(0.5)).toBe('½')
    expect(formatTypeMultiplier(0.25)).toBe('¼')
    expect(formatTypeMultiplier(0.125)).toBe('⅛')
  })

  it('renders whole numbers as-is', () => {
    expect(formatTypeMultiplier(2)).toBe('2')
    expect(formatTypeMultiplier(4)).toBe('4')
  })
})

describe('TypeMatchups', () => {
  it('groups weaknesses, resistances and immunities with multipliers', () => {
    render(<TypeMatchups matchups={matchups} />)

    expect(screen.getByText('Weak to')).toBeInTheDocument()
    expect(screen.getByText('Resistant to')).toBeInTheDocument()
    expect(screen.getByText('Immune to')).toBeInTheDocument()

    expect(screen.getByText('fire')).toBeInTheDocument()
    expect(screen.getByText('×4')).toBeInTheDocument()
    expect(screen.queryByText('×½')).not.toBeInTheDocument()
    expect(screen.getByText('×¼')).toBeInTheDocument()
    expect(screen.getByText('×0')).toBeInTheDocument()
  })

  it('omits empty groups', () => {
    render(
      <TypeMatchups
        matchups={{ weakTo: [{ type: 'fire', multiplier: 2 }], resistantTo: [], immuneTo: [] }}
      />,
    )

    expect(screen.getByText('Weak to')).toBeInTheDocument()
    expect(screen.queryByText('Resistant to')).not.toBeInTheDocument()
    expect(screen.queryByText('Immune to')).not.toBeInTheDocument()
  })

  it('explains when there is no type data', () => {
    render(<TypeMatchups matchups={{ weakTo: [], resistantTo: [], immuneTo: [] }} />)

    expect(screen.getByText('No type data available.')).toBeInTheDocument()
  })
})
