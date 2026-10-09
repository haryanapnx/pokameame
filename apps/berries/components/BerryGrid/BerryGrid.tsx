import type { BerrySummary } from '@poke/core'
import { Grid } from '@poke/ui'

import { BerryCard } from '../BerryCard/BerryCard'

export type BerryGridProps = {
  items: BerrySummary[]
}

export function BerryGrid({ items }: BerryGridProps) {
  return (
    <Grid columns={4} className="mt-6">
      {items.map((berry) => (
        <BerryCard key={`${berry.origin}-${berry.id}`} berry={berry} />
      ))}
    </Grid>
  )
}
