import { STAT_KEYS, readAbilities, toCreatePokemonPayload } from './pokemon-form'

describe('readAbilities', () => {
  it('reads the picked abilities as non-hidden', () => {
    const formData = new FormData()
    formData.append('abilities', 'static')
    formData.append('abilities', 'lightning-rod')

    expect(readAbilities(formData)).toEqual([
      { name: 'static', isHidden: false },
      { name: 'lightning-rod', isHidden: false },
    ])
  })

  it('marks an ability picked in the hidden list as hidden', () => {
    const formData = new FormData()
    formData.append('abilities', 'static')
    formData.append('abilities', 'lightning-rod')
    formData.append('hidden-abilities', 'lightning-rod')

    expect(readAbilities(formData)).toEqual([
      { name: 'static', isHidden: false },
      { name: 'lightning-rod', isHidden: true },
    ])
  })

  it('ignores blank values and empty selections', () => {
    const formData = new FormData()
    formData.append('abilities', '  ')

    expect(readAbilities(formData)).toEqual([])
    expect(readAbilities(new FormData())).toEqual([])
  })
})

describe('toCreatePokemonPayload', () => {
  it('reads the name, selected types, abilities and stats', () => {
    const formData = new FormData()
    formData.set('name', 'pikablu')
    formData.append('types', 'water')
    formData.append('types', 'fairy')
    formData.append('abilities', 'torrent')
    formData.append('hidden-abilities', 'drizzle')
    for (const key of STAT_KEYS) formData.set(`stat-${key}`, '60')

    formData.append('abilities', 'drizzle')

    expect(toCreatePokemonPayload(formData)).toEqual({
      name: 'pikablu',
      types: ['water', 'fairy'],
      abilities: [
        { name: 'torrent', isHidden: false },
        { name: 'drizzle', isHidden: true },
      ],
      stats: [
        { name: 'hp', value: 60 },
        { name: 'attack', value: 60 },
        { name: 'defense', value: 60 },
        { name: 'special-attack', value: 60 },
        { name: 'special-defense', value: 60 },
        { name: 'speed', value: 60 },
      ],
    })
  })

  it('leaves missing values for the core validator to reject', () => {
    const payload = toCreatePokemonPayload(new FormData())

    expect(payload).toMatchObject({ name: '', types: [], abilities: [] })
  })

  it('converts metric details into the units PokeAPI stores', () => {
    const formData = new FormData()
    formData.set('name', 'pikablu')
    formData.append('types', 'water')
    formData.set('height', '0.7')
    formData.set('weight', '6.9')
    formData.set('base-experience', '64')
    for (const key of STAT_KEYS) formData.set(`stat-${key}`, '60')

    expect(toCreatePokemonPayload(formData)).toMatchObject({
      height: 7,
      weight: 69,
      baseExperience: 64,
    })
  })

  it('omits the optional details when the inputs are left empty', () => {
    const formData = new FormData()
    formData.set('name', 'pikablu')
    formData.append('types', 'water')
    for (const key of STAT_KEYS) formData.set(`stat-${key}`, '60')

    expect(toCreatePokemonPayload(formData)).toMatchObject({
      height: undefined,
      weight: undefined,
      baseExperience: undefined,
    })
  })

  it('passes unparseable details through for the core validator', () => {
    const formData = new FormData()
    formData.set('name', 'pikablu')
    formData.append('types', 'water')
    formData.set('height', 'tall')
    for (const key of STAT_KEYS) formData.set(`stat-${key}`, '60')

    expect(toCreatePokemonPayload(formData)).toMatchObject({ height: 'tall' })
  })
})
