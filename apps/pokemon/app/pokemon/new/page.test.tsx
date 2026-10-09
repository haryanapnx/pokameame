import { render, screen } from '@testing-library/react'

import { getAbilityIndex } from '@poke/core/services'

import NewPokemonPage from './page'

vi.mock('@poke/core/services', () => ({ getAbilityIndex: vi.fn() }))
vi.mock('next/link', () => ({ default: () => null }))
vi.mock('../../../app/pokemon/actions', () => ({ createPokemonAction: vi.fn() }))

const getAbilityIndexMock = vi.mocked(getAbilityIndex)

function index(names: string[]) {
  return {
    count: names.length,
    next: null,
    previous: null,
    results: names.map((name) => ({
      name,
      url: `https://pokeapi.co/api/v2/ability/${name}/`,
    })),
  }
}

describe('NewPokemonPage', () => {
  beforeEach(() => {
    getAbilityIndexMock.mockReset()
  })

  it('feeds the ability multi-select from the cached PokeAPI index', async () => {
    getAbilityIndexMock.mockResolvedValue(index(['static', 'lightning-rod']))

    render(await NewPokemonPage())

    expect(screen.getByLabelText(/Abilities/)).toHaveAttribute('multiple')
    expect(screen.getByRole('option', { name: 'Static' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Lightning Rod' })).toBeInTheDocument()
  })

  it('still renders the form when the ability index is unavailable', async () => {
    getAbilityIndexMock.mockRejectedValue(new Error('upstream down'))

    render(await NewPokemonPage())

    expect(screen.getByText(/unavailable right now/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Name/)).toBeInTheDocument()
  })
})
