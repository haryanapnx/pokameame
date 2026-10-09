import type { DefensiveMatchups } from '@poke/core'
import { TypeBadge } from '@poke/ui'

export type TypeMatchupsProps = {
  matchups: DefensiveMatchups
}

/** `0.25` → `1/4`, `2` → `2`. */
export function formatTypeMultiplier(multiplier: number): string {
  if (multiplier === 0.5) return '1/2' 
  if (multiplier === 0.25) return '1/4'
  if (multiplier === 0.125) return '1/8'
  return String(multiplier)
}

export function TypeMatchups({ matchups }: TypeMatchupsProps) {
  const groups = [
    {
      label: 'Weak to',
      entries: matchups.weakTo.map((entry) => ({
        type: entry.type,
        note: `x${formatTypeMultiplier(entry.multiplier)}`,
      })),
    },
    {
      label: 'Resistant to',
      entries: matchups.resistantTo.map((entry) => ({
        type: entry.type,
        note: `x${formatTypeMultiplier(entry.multiplier)}`,
      })),
    },
    {
      label: 'Immune to',
      entries: matchups.immuneTo.map((type) => ({ type, note: 'x0' })),
    },
  ].filter((group) => group.entries.length > 0)

  if (groups.length === 0) {
    return <p className="text-sm text-content-muted">No type data available.</p>
  }

  return (
    <div className="flex flex-col gap-4">
      {groups.map((group) => (
        <div key={group.label}>
          <p className="text-2xs uppercase tracking-wide text-content-muted">{group.label}</p>

          <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1.5">
            {group.entries.map((entry) => (
              <span key={entry.type} className="inline-flex items-center gap-1.5">
                <TypeBadge type={entry.type} />
                <span className="text-2xs font-medium tabular-nums text-content-muted">
                  {entry.note}
                </span>
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
