import { displayName, type PokemonAbilityInfo } from '@poke/core'
import { Badge } from '@poke/ui'

export function formatGeneration(generation: string): string {
  return `Gen ${generation.replace(/^generation-/, '').toUpperCase()}`
}

export type AbilityListProps = {
  abilities: PokemonAbilityInfo[]
}

export function AbilityList({ abilities }: AbilityListProps) {
  if (abilities.length === 0) {
    return <p className="text-sm text-content-muted">No abilities recorded.</p>
  }

  return (
    <ul className="flex flex-col gap-3">
      {abilities.map((ability) => (
        <li key={ability.name}>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium">{displayName(ability.name)}</span>
            {ability.isHidden ? <Badge>Hidden</Badge> : null}
            {ability.generation ? (
              <span className="text-2xs text-content-muted">
                {formatGeneration(ability.generation)}
              </span>
            ) : null}
          </div>

          {ability.effect ? (
            <p className="mt-1 text-xs leading-relaxed text-content-muted">{ability.effect}</p>
          ) : null}
        </li>
      ))}
    </ul>
  )
}
