export const BERRY_FLAVORS = ['spicy', 'dry', 'sweet', 'bitter', 'sour'] as const
export const BERRY_FIRMNESS = ['very-soft', 'soft', 'hard', 'very-hard'] as const
export const MAX_FLAVOR_POTENCY = 40

export type BerryFlavorName = (typeof BERRY_FLAVORS)[number]

export const OPTIONAL_NUMBER_FIELDS = [
  { key: 'maxHarvest', label: 'Max harvest' },
  { key: 'naturalGiftPower', label: 'Natural gift power' },
  { key: 'size', label: 'Size' },
  { key: 'smoothness', label: 'Smoothness' },
  { key: 'soilDryness', label: 'Soil dryness' },
] as const

function numberField(formData: FormData, key: string, fallback = 0): number {
  const raw = String(formData.get(key) ?? '').trim()
  return raw === '' ? fallback : Number(raw)
}

/** Builds the payload the Server Action hands to `saveCustomBerry`. */
export function toCreateBerryPayload(formData: FormData): unknown {
  const payload: Record<string, unknown> = {
    name: formData.get('name') ?? '',
    firmness: String(formData.get('firmness') ?? ''),
    growthTime: numberField(formData, 'growthTime'),
    flavors: BERRY_FLAVORS.map((flavor) => ({
      name: flavor,
      potency: numberField(formData, `flavor-${flavor}`),
    })),
    naturalGiftType: String(formData.get('naturalGiftType') ?? ''),
    itemName: String(formData.get('itemName') ?? ''),
  }

  for (const field of OPTIONAL_NUMBER_FIELDS) {
    payload[field.key] = numberField(formData, field.key)
  }

  return payload
}
