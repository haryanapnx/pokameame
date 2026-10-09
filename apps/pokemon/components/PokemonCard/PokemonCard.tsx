import Image from 'next/image'
import Link from 'next/link'

import { displayName, formatId, type PokemonSummary } from '@poke/core'
import { Badge, Card } from '@poke/ui'

import { TypeBadges } from '../TypeBadges/TypeBadges'

export type PokemonCardProps = {
  pokemon: PokemonSummary
}

export function PokemonCard({ pokemon }: PokemonCardProps) {
  return (
    <Link prefetch={false} href={`/pokemon/${pokemon.name}`} className="group block h-full">
      <Card className="relative flex h-full flex-col items-center gap-3 text-center transition group-hover:-translate-y-0.5 group-hover:border-brand-300 group-hover:shadow-md">
        {pokemon.origin === 'custom' ? (
          <Badge tone="brand" className="absolute right-3 top-3">
            Custom
          </Badge>
        ) : null}

        <div className="flex size-24 items-center justify-center">
          {pokemon.spriteUrl ? (
            <Image
              src={pokemon.spriteUrl}
              alt={pokemon.name}
              width={96}
              height={96}
              className="size-24 object-contain transition group-hover:scale-110"
            />
          ) : (
            <span aria-hidden="true" className="text-lg font-semibold text-brand-300">
              {pokemon.id}
            </span>
          )}
        </div>

        <div className="w-full">
          <p className="text-2xs text-content-muted tabular-nums">{formatId(pokemon.id)}</p>
          <p className="truncate text-sm font-semibold">{displayName(pokemon.name)}</p>
        </div>

        <TypeBadges types={pokemon.types} className="justify-center" />
      </Card>
    </Link>
  )
}
