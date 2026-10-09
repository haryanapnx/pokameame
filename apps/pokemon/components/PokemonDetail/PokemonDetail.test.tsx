import { render, screen } from '@testing-library/react'

import type {
  DefensiveMatchups,
  PokemonAbilityInfo,
  PokemonDetail as PokemonDetailModel,
} from '@poke/core'

import { PokemonDetail } from './PokemonDetail'

vi.mock('next/image', () => ({ default: () => null }))

const pikachu: PokemonDetailModel = {
  id: 25,
  name: 'pikachu',
  spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/pikachu.png',
  artworkUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/pikachu-art.png',
  types: ['electric'],
  origin: 'pokeapi',
  height: 4,
  weight: 60,
  baseExperience: 112,
  abilities: [
    { name: 'static', isHidden: false },
    { name: 'lightning-rod', isHidden: true },
  ],
  stats: [
    { name: 'hp', value: 35 },
    { name: 'attack', value: 55 },
  ],
}

const abilities: PokemonAbilityInfo[] = [
  {
    name: 'static',
    isHidden: false,
    effect: 'Contact with the Pokemon may paralyze.',
    generation: 'generation-iii',
  },
  { name: 'lightning-rod', isHidden: true, effect: null, generation: null },
]

const matchups: DefensiveMatchups = {
  weakTo: [{ type: 'ground', multiplier: 2 }],
  resistantTo: [{ type: 'grass', multiplier: 0.5 }],
  immuneTo: [],
}

describe('PokemonDetail', () => {
  it('renders the identity, types, abilities and stats', () => {
    render(<PokemonDetail pokemon={pikachu} abilities={abilities} matchups={matchups} />)

    expect(screen.getByRole('heading', { name: 'Pikachu' })).toBeInTheDocument()
    expect(screen.getByText('#025')).toBeInTheDocument()
    expect(screen.getByText('electric')).toBeInTheDocument()
    expect(screen.getByText('Static')).toBeInTheDocument()
    expect(screen.getByText('Hidden')).toBeInTheDocument()
    expect(screen.getByRole('progressbar', { name: 'hp' })).toHaveAttribute('aria-valuenow', '35')
  })

  it('enriches abilities with their effect and generation', () => {
    render(<PokemonDetail pokemon={pikachu} abilities={abilities} matchups={matchups} />)

    expect(screen.getByText('Contact with the Pokemon may paralyze.')).toBeInTheDocument()
    expect(screen.getByText('Gen III')).toBeInTheDocument()
  })

  it('renders the defensive type matchups', () => {
    render(<PokemonDetail pokemon={pikachu} abilities={abilities} matchups={matchups} />)

    expect(screen.getByText('Type matchups')).toBeInTheDocument()
    expect(screen.getByText('Weak to')).toBeInTheDocument()
    expect(screen.getByText('ground')).toBeInTheDocument()
    expect(screen.getByText('Resistant to')).toBeInTheDocument()
  })

  it('renders physical attributes and base experience', () => {
    render(<PokemonDetail pokemon={pikachu} abilities={abilities} matchups={matchups} />)

    expect(screen.getByText('0.4 m')).toBeInTheDocument()
    expect(screen.getByText('6.0 kg')).toBeInTheDocument()
    expect(screen.getByText('112')).toBeInTheDocument()
  })

  it('badges custom entries and hides unknown measurements', () => {
    render(
      <PokemonDetail
        pokemon={{
          ...pikachu,
          id: 9001,
          origin: 'custom',
          height: 0,
          weight: 0,
          baseExperience: null,
        }}
        abilities={[]}
        matchups={{ weakTo: [], resistantTo: [], immuneTo: [] }}
      />,
    )

    expect(screen.getByText('Custom')).toBeInTheDocument()
    expect(screen.getByText('No abilities recorded.')).toBeInTheDocument()
    expect(screen.getAllByText('—')).toHaveLength(3)
  })
})
