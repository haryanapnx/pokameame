import type { BerryFlavor } from '@poke/core'
import { StatBar } from '@poke/ui'

import { MAX_FLAVOR_POTENCY } from '../../lib/berry-form'

export type FlavorListProps = {
  flavors: BerryFlavor[]
}

export function FlavorList({ flavors }: FlavorListProps) {
  if (flavors.length === 0) {
    return <p className="text-sm text-content-muted">No flavours recorded.</p>
  }

  return (
    <div className="flex flex-col gap-2">
      {flavors.map((flavor) => (
        <StatBar
          key={flavor.name}
          label={flavor.name}
          value={flavor.potency}
          max={MAX_FLAVOR_POTENCY}
        />
      ))}
    </div>
  )
}
