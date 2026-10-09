import { notFound } from 'next/navigation'

import { getPokemonAbilities, getPokemonDetail, getPokemonTypeMatchups } from '@poke/core/services'

import PokemonDetailPage, { generateMetadata } from './page'

vi.mock('next/navigation', () => ({
  notFound: vi.fn(() => {
    throw new Error('NEXT_NOT_FOUND')
  }),
}))

vi.mock('next/link', () => ({ default: () => null }))
vi.mock('next/image', () => ({ default: () => null }))

vi.mock('@poke/core/services', () => ({
  getPokemonDetail: vi.fn(),
  getPokemonAbilities: vi.fn(),
  getPokemonTypeMatchups: vi.fn(),
}))

const getPokemonDetailMock = vi.mocked(getPokemonDetail)
const getPokemonAbilitiesMock = vi.mocked(getPokemonAbilities)
const getPokemonTypeMatchupsMock = vi.mocked(getPokemonTypeMatchups)

const pikachu = {
  id: 25,
  name: 'pikachu',
  spriteUrl: null,
  artworkUrl: null,
  types: ['electric'],
  origin: 'pokeapi' as const,
  height: 4,
  weight: 60,
  baseExperience: 112,
  abilities: [{ name: 'static', isHidden: false }],
  stats: [{ name: 'hp', value: 35 }],
}

function params(name: string) {
  return Promise.resolve({ name })
}

describe('PokemonDetailPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    getPokemonAbilitiesMock.mockResolvedValue([])
    getPokemonTypeMatchupsMock.mockResolvedValue({
      weakTo: [],
      resistantTo: [],
      immuneTo: [],
    })
  })

  it('looks up the requested Pokemon', async () => {
    getPokemonDetailMock.mockResolvedValue(pikachu)

    await PokemonDetailPage({ params: params('pikachu') })

    expect(getPokemonDetailMock).toHaveBeenCalledWith('pikachu')
  })

  it('enriches abilities and type matchups from the ability/type endpoints', async () => {
    getPokemonDetailMock.mockResolvedValue(pikachu)

    await PokemonDetailPage({ params: params('pikachu') })

    expect(getPokemonAbilitiesMock).toHaveBeenCalledWith(pikachu.abilities)
    expect(getPokemonTypeMatchupsMock).toHaveBeenCalledWith(pikachu.types)
  })

  it('calls notFound for an unknown name', async () => {
    getPokemonDetailMock.mockResolvedValue(null)

    await expect(PokemonDetailPage({ params: params('missingno') })).rejects.toThrow(
      'NEXT_NOT_FOUND',
    )
    expect(notFound).toHaveBeenCalled()
  })

  it('builds metadata for a known Pokemon', async () => {
    getPokemonDetailMock.mockResolvedValue(pikachu)

    const metadata = await generateMetadata({ params: params('pikachu') })

    expect(metadata.title).toBe('Pikachu')
    expect(metadata.description).toContain('Pikachu')
  })

  it('falls back to a not-found title', async () => {
    getPokemonDetailMock.mockResolvedValue(null)

    await expect(generateMetadata({ params: params('missingno') })).resolves.toEqual({
      title: 'Pokemon not found',
    })
  })
})
