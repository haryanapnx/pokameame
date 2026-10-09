import Link from 'next/link'

import { displayName, formatId, type BerrySummary } from '@poke/core'
import { Badge, Card } from '@poke/ui'

export type BerryCardProps = {
  berry: BerrySummary
}

export function BerryCard({ berry }: BerryCardProps) {
  return (
    <Link href={`/berries/${berry.name}`} prefetch className="group block h-full">
      <Card className="relative flex h-full flex-col items-center gap-2 text-center transition group-hover:-translate-y-0.5 group-hover:border-brand-300 group-hover:shadow-md">
        <span className="text-2xs text-content-muted tabular-nums">{formatId(berry.id)}</span>

        {berry.origin === 'custom' ? (
          <Badge tone="brand" className="absolute right-3 top-3">
            Custom
          </Badge>
        ) : null}

        <div className="flex size-16 items-center justify-center rounded-full bg-brand-50 ring-1 ring-brand-100">
          <span
            aria-hidden="true"
            className="size-6 rounded-full bg-brand-400 transition group-hover:scale-125"
          />
        </div>

        <p className="w-full truncate text-sm font-semibold">{displayName(berry.name)}</p>

        <dl className="mt-auto flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-content-muted">
          <div className="inline-flex gap-1">
            <dt>Firmness</dt>
            <dd className="font-medium text-content">{displayName(berry.firmness)}</dd>
          </div>
          <div className="inline-flex gap-1">
            <dt>Growth</dt>
            <dd className="font-medium text-content">{berry.growthTime} h</dd>
          </div>
        </dl>
      </Card>
    </Link>
  )
}
