import { notFound } from 'next/navigation'

import { getBerryDetail } from '@poke/core/services'

import BerryDetailPage, { generateMetadata } from './page'

vi.mock('next/navigation', () => ({
  notFound: vi.fn(() => {
    throw new Error('NEXT_NOT_FOUND')
  }),
}))

vi.mock('next/link', () => ({ default: () => null }))

vi.mock('@poke/core/services', () => ({ getBerryDetail: vi.fn() }))

const getBerryDetailMock = vi.mocked(getBerryDetail)

const cheri = {
  id: 1,
  name: 'cheri',
  firmness: 'soft',
  growthTime: 3,
  origin: 'pokeapi' as const,
  flavors: [],
  maxHarvest: 5,
  naturalGiftPower: 60,
  naturalGiftType: null,
  size: 20,
  smoothness: 25,
  soilDryness: 15,
  itemName: null,
}

function params(name: string) {
  return Promise.resolve({ name })
}

describe('BerryDetailPage', () => {
  beforeEach(() => {
    getBerryDetailMock.mockReset()
  })

  it('looks up the requested berry', async () => {
    getBerryDetailMock.mockResolvedValue(cheri)

    await BerryDetailPage({ params: params('cheri') })

    expect(getBerryDetailMock).toHaveBeenCalledWith('cheri')
  })

  it('calls notFound for an unknown name', async () => {
    getBerryDetailMock.mockResolvedValue(null)

    await expect(BerryDetailPage({ params: params('missingno') })).rejects.toThrow('NEXT_NOT_FOUND')
    expect(notFound).toHaveBeenCalled()
  })

  it('builds metadata for a known berry', async () => {
    getBerryDetailMock.mockResolvedValue(cheri)

    const metadata = await generateMetadata({ params: params('cheri') })

    expect(metadata.title).toBe('Cheri')
    expect(metadata.description).toContain('Cheri')
  })

  it('falls back to a not-found title', async () => {
    getBerryDetailMock.mockResolvedValue(null)

    await expect(generateMetadata({ params: params('missingno') })).resolves.toEqual({
      title: 'Berry not found',
    })
  })
})
