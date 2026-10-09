import { redirect } from 'next/navigation'

import PokemonZoneRootPage from './page'

vi.mock('next/navigation', () => ({ redirect: vi.fn() }))

describe('PokemonZoneRootPage', () => {
  it('sends visitors of the zone origin to the pokemon library', () => {
    PokemonZoneRootPage()

    expect(vi.mocked(redirect)).toHaveBeenCalledWith('/pokemon')
  })
})
