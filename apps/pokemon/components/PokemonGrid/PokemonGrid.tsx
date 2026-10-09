import type { PokemonSummary } from '@poke/core'
import { Grid } from '@poke/ui'

import { PokemonCard } from '../PokemonCard/PokemonCard'

export type PokemonGridProps = {
  items: PokemonSummary[]
}

export function PokemonGrid({ items }: PokemonGridProps) {
  return (
    <Grid columns={4} className="mt-6">
      {items.map((pokemon) => (
        <PokemonCard key={`${pokemon.origin}-${pokemon.id}`} pokemon={pokemon} />
      ))}
    </Grid>
  )
}
