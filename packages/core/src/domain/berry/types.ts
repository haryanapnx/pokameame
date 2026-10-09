import type { EntityOrigin } from '../types'

export type BerryFlavor = {
  name: string
  potency: number
}

export type BerrySummary = {
  id: number
  name: string
  firmness: string
  /** Hours until the berry regrows. */
  growthTime: number
  origin: EntityOrigin
}

export type BerryDetail = BerrySummary & {
  flavors: BerryFlavor[]
  maxHarvest: number
  naturalGiftPower: number
  naturalGiftType: string | null
  size: number
  smoothness: number
  soilDryness: number
  itemName: string | null
}

/** Payload accepted when creating a custom berry. */
export type CustomBerryInput = {
  name: string
  firmness: string
  growthTime: number
  flavors: BerryFlavor[]
  maxHarvest?: number
  naturalGiftPower?: number
  naturalGiftType?: string | null
  size?: number
  smoothness?: number
  soilDryness?: number
  itemName?: string | null
}
