import type { PokemonStat } from '@poke/core'
import { StatBar } from '@poke/ui'

export type StatListProps = {
  stats: PokemonStat[]
}

export function StatList({ stats }: StatListProps) {
  if (stats.length === 0) {
    return <p className="text-sm text-content-muted">No stats recorded.</p>
  }

  return (
    <div className="flex flex-col gap-2">
      {stats.map((stat) => (
        <StatBar key={stat.name} label={stat.name.replace(/-/g, ' ')} value={stat.value} />
      ))}
    </div>
  )
}
