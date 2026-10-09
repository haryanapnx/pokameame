import { mapWithConcurrency } from './concurrency'

describe('mapWithConcurrency', () => {
  it('preserves input order even when work finishes out of order', async () => {
    const result = await mapWithConcurrency([3, 1, 2], 2, async (value) => {
      await new Promise((resolve) => setTimeout(resolve, value * 5))
      return value * 10
    })

    expect(result).toEqual([30, 10, 20])
  })

  it('never exceeds the concurrency limit', async () => {
    let inFlight = 0
    let peak = 0
    const items = Array.from({ length: 12 }, (_, index) => index)

    await mapWithConcurrency(items, 3, async () => {
      inFlight += 1
      peak = Math.max(peak, inFlight)
      await new Promise((resolve) => setTimeout(resolve, 1))
      inFlight -= 1
      return null
    })

    expect(peak).toBeLessThanOrEqual(3)
    expect(peak).toBeGreaterThan(1)
  })

  it('returns an empty array when there is nothing to map', async () => {
    await expect(mapWithConcurrency([], 4, async () => 1)).resolves.toEqual([])
  })

  it('treats a non-positive limit as one', async () => {
    await expect(mapWithConcurrency([1, 2, 3], 0, async (value) => value * 2)).resolves.toEqual([
      2, 4, 6,
    ])
  })
})
