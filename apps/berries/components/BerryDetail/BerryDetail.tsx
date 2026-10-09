import { displayName, formatId, type BerryDetail as BerryDetailModel } from '@poke/core'
import { Badge, Card } from '@poke/ui'

import { FlavorList } from '../FlavorList/FlavorList'

export type BerryDetailProps = {
  berry: BerryDetailModel
}

export function BerryDetail({ berry }: BerryDetailProps) {
  const properties = [
    { label: 'Max harvest', value: String(berry.maxHarvest) },
    {
      label: 'Natural gift',
      value: berry.naturalGiftType
        ? `${berry.naturalGiftPower} · ${displayName(berry.naturalGiftType)}`
        : String(berry.naturalGiftPower),
    },
    { label: 'Size', value: String(berry.size) },
    { label: 'Smoothness', value: String(berry.smoothness) },
    { label: 'Soil dryness', value: String(berry.soilDryness) },
    { label: 'Item', value: berry.itemName ? displayName(berry.itemName) : '—' },
  ]

  return (
    <article className="flex flex-col gap-8">
      <header>
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-2xl font-bold sm:text-3xl">{displayName(berry.name)}</h1>
          <span className="text-sm text-content-muted tabular-nums">{formatId(berry.id)}</span>
          {berry.origin === 'custom' ? <Badge tone="brand">Custom</Badge> : null}
        </div>

        <p className="mt-2 text-sm text-content-muted">
          {displayName(berry.firmness)} · grows in {berry.growthTime} h
        </p>
      </header>

      <dl className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {properties.map((property) => (
          <div key={property.label}>
            <dt className="text-2xs uppercase text-content-muted">{property.label}</dt>
            <dd className="text-sm font-medium">{property.value}</dd>
          </div>
        ))}
      </dl>

      <Card>
        <h2 className="text-sm font-semibold">Flavours</h2>
        <div className="mt-3">
          <FlavorList flavors={berry.flavors} />
        </div>
      </Card>
    </article>
  )
}
