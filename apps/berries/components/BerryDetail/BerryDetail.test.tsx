import { render, screen } from '@testing-library/react'

import type { BerryDetail as BerryDetailModel } from '@poke/core'

import { BerryDetail } from './BerryDetail'

const cheri: BerryDetailModel = {
  id: 1,
  name: 'cheri',
  firmness: 'soft',
  growthTime: 3,
  origin: 'pokeapi',
  flavors: [
    { name: 'spicy', potency: 10 },
    { name: 'sweet', potency: 0 },
  ],
  maxHarvest: 5,
  naturalGiftPower: 60,
  naturalGiftType: 'fire',
  size: 20,
  smoothness: 25,
  soilDryness: 15,
  itemName: 'cheri-berry',
}

describe('BerryDetail', () => {
  it('renders the identity and firmness/growth line', () => {
    render(<BerryDetail berry={cheri} />)

    expect(screen.getByRole('heading', { name: 'Cheri' })).toBeInTheDocument()
    expect(screen.getByText('#001')).toBeInTheDocument()
    expect(screen.getByText('Soft · grows in 3 h')).toBeInTheDocument()
  })

  it('renders every property', () => {
    render(<BerryDetail berry={cheri} />)

    expect(screen.getByText('5')).toBeInTheDocument()
    expect(screen.getByText('60 · Fire')).toBeInTheDocument()
    expect(screen.getByText('20')).toBeInTheDocument()
    expect(screen.getByText('25')).toBeInTheDocument()
    expect(screen.getByText('15')).toBeInTheDocument()
    expect(screen.getByText('Cheri Berry')).toBeInTheDocument()
  })

  it('renders flavour potency bars', () => {
    render(<BerryDetail berry={cheri} />)

    expect(screen.getByRole('progressbar', { name: 'spicy' })).toHaveAttribute(
      'aria-valuenow',
      '10',
    )
  })

  it('badges custom entries and hides a missing item', () => {
    render(
      <BerryDetail berry={{ ...cheri, origin: 'custom', itemName: null, naturalGiftType: null }} />,
    )

    expect(screen.getByText('Custom')).toBeInTheDocument()
    expect(screen.getByText('—')).toBeInTheDocument()
  })
})
