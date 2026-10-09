import { updateTag } from 'next/cache'
import { redirect } from 'next/navigation'

import { saveCustomPokemon } from '@poke/core/services'

import { createPokemonAction } from './actions'

vi.mock('next/cache', () => ({ updateTag: vi.fn() }))
vi.mock('next/navigation', () => ({
  redirect: vi.fn(() => {
    throw new Error('NEXT_REDIRECT')
  }),
}))
vi.mock('@poke/core/services', () => ({ saveCustomPokemon: vi.fn() }))

const saveCustomPokemonMock = vi.mocked(saveCustomPokemon)
const updateTagMock = vi.mocked(updateTag)
const redirectMock = vi.mocked(redirect)

const pikablu = {
  id: 9001,
  name: 'pikablu',
  spriteUrl: null,
  artworkUrl: null,
  types: ['water'],
  origin: 'custom' as const,
  height: 0,
  weight: 0,
  baseExperience: null,
  abilities: [],
  stats: [],
}

function formData() {
  const data = new FormData()
  data.set('name', 'pikablu')
  data.append('types', 'water')
  data.set('abilities', 'torrent')
  return data
}

describe('createPokemonAction', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('passes the parsed payload to core', async () => {
    saveCustomPokemonMock.mockResolvedValue({ ok: true, data: pikablu })

    await expect(createPokemonAction(null, formData())).rejects.toThrow('NEXT_REDIRECT')

    expect(saveCustomPokemonMock).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'pikablu', types: ['water'] }),
    )
  })

  it('returns the typed error without touching caches or redirecting', async () => {
    saveCustomPokemonMock.mockResolvedValue({
      ok: false,
      error: { code: 'duplicate', message: 'taken', fieldErrors: { name: 'taken' } },
    })

    const result = await createPokemonAction(null, formData())

    expect(result).toMatchObject({ ok: false })
    expect(updateTagMock).not.toHaveBeenCalled()
    expect(redirectMock).not.toHaveBeenCalled()
  })

  it('refreshes the list and detail tags, then redirects to the new entry', async () => {
    saveCustomPokemonMock.mockResolvedValue({ ok: true, data: pikablu })

    await expect(createPokemonAction(null, formData())).rejects.toThrow('NEXT_REDIRECT')

    expect(updateTagMock).toHaveBeenCalledWith('pokemon')
    expect(updateTagMock).toHaveBeenCalledWith('pokemon:pikablu')
    expect(redirectMock).toHaveBeenCalledWith('/pokemon/pikablu')
  })
})
