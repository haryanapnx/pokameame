import { BERRY_FLAVORS, toCreateBerryPayload } from './berry-form'

describe('toCreateBerryPayload', () => {
  it('reads the name, firmness, growth time and flavour potencies', () => {
    const formData = new FormData()
    formData.set('name', 'mystery-berry')
    formData.set('firmness', 'very-soft')
    formData.set('growthTime', '12')
    formData.set('flavor-spicy', '20')
    formData.set('flavor-bitter', '5')

    expect(toCreateBerryPayload(formData)).toMatchObject({
      name: 'mystery-berry',
      firmness: 'very-soft',
      growthTime: 12,
      flavors: [
        { name: 'spicy', potency: 20 },
        { name: 'dry', potency: 0 },
        { name: 'sweet', potency: 0 },
        { name: 'bitter', potency: 5 },
        { name: 'sour', potency: 0 },
      ],
    })
  })

  it('sends every flavour name so the validator sees a full profile', () => {
    const payload = toCreateBerryPayload(new FormData()) as { flavors: { name: string }[] }

    expect(payload.flavors.map((flavor) => flavor.name)).toEqual([...BERRY_FLAVORS])
  })

  it('defaults optional numbers and blank strings for core to handle', () => {
    expect(toCreateBerryPayload(new FormData())).toMatchObject({
      maxHarvest: 0,
      naturalGiftPower: 0,
      size: 0,
      smoothness: 0,
      soilDryness: 0,
      naturalGiftType: '',
      itemName: '',
    })
  })
})
