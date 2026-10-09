import { redirect } from 'next/navigation'

import BerriesZoneRootPage from './page'

vi.mock('next/navigation', () => ({ redirect: vi.fn() }))

describe('BerriesZoneRootPage', () => {
  it('sends visitors of the zone origin to the berries library', () => {
    BerriesZoneRootPage()

    expect(vi.mocked(redirect)).toHaveBeenCalledWith('/berries')
  })
})
