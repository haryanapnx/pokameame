import { updateTag } from 'next/cache'
import { redirect } from 'next/navigation'

import { saveCustomBerry } from '@poke/core/services'

import { createBerryAction } from './actions'

vi.mock('next/cache', () => ({ updateTag: vi.fn() }))
vi.mock('next/navigation', () => ({
  redirect: vi.fn(() => {
    throw new Error('NEXT_REDIRECT')
  }),
}))
vi.mock('@poke/core/services', () => ({ saveCustomBerry: vi.fn() }))

const saveCustomBerryMock = vi.mocked(saveCustomBerry)
const updateTagMock = vi.mocked(updateTag)
const redirectMock = vi.mocked(redirect)

const mysteryBerry = {
  id: 9001,
  name: 'mystery-berry',
  firmness: 'soft',
  growthTime: 12,
  origin: 'custom' as const,
  flavors: [],
  maxHarvest: 0,
  naturalGiftPower: 0,
  naturalGiftType: null,
  size: 0,
  smoothness: 0,
  soilDryness: 0,
  itemName: null,
}

function formData() {
  const data = new FormData()
  data.set('name', 'mystery-berry')
  data.set('firmness', 'soft')
  data.set('growthTime', '12')
  return data
}

describe('createBerryAction', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('passes the parsed payload to core', async () => {
    saveCustomBerryMock.mockResolvedValue({ ok: true, data: mysteryBerry })

    await expect(createBerryAction(null, formData())).rejects.toThrow('NEXT_REDIRECT')

    expect(saveCustomBerryMock).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'mystery-berry', firmness: 'soft', growthTime: 12 }),
    )
  })

  it('returns the typed error without touching caches or redirecting', async () => {
    saveCustomBerryMock.mockResolvedValue({
      ok: false,
      error: { code: 'validation', message: 'invalid', fieldErrors: { flavors: 'required' } },
    })

    const result = await createBerryAction(null, formData())

    expect(result).toMatchObject({ ok: false })
    expect(updateTagMock).not.toHaveBeenCalled()
    expect(redirectMock).not.toHaveBeenCalled()
  })

  it('refreshes the list and detail tags, then redirects to the new entry', async () => {
    saveCustomBerryMock.mockResolvedValue({ ok: true, data: mysteryBerry })

    await expect(createBerryAction(null, formData())).rejects.toThrow('NEXT_REDIRECT')

    expect(updateTagMock).toHaveBeenCalledWith('berries')
    expect(updateTagMock).toHaveBeenCalledWith('berries:mystery-berry')
    expect(redirectMock).toHaveBeenCalledWith('/berries/mystery-berry')
  })
})
