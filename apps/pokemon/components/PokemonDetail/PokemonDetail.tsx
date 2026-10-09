import Image from 'next/image'

import {
  displayName,
  formatId,
  type DefensiveMatchups,
  type PokemonAbilityInfo,
  type PokemonDetail as PokemonDetailModel,
} from '@poke/core'
import { Badge, Card } from '@poke/ui'

import { formatHeight, formatWeight } from '../../lib/pokemon-format'
import { AbilityList } from '../AbilityList/AbilityList'
import { StatList } from '../StatList/StatList'
import { TypeBadges } from '../TypeBadges/TypeBadges'
import { TypeMatchups } from '../TypeMatchups/TypeMatchups'

export type PokemonDetailProps = {
  pokemon: PokemonDetailModel
  abilities: PokemonAbilityInfo[]
  matchups: DefensiveMatchups
}

export function PokemonDetail({ pokemon, abilities, matchups }: PokemonDetailProps) {
  const image = pokemon.artworkUrl ?? pokemon.spriteUrl

  const facts = [
    { label: 'Height', value: pokemon.height > 0 ? formatHeight(pokemon.height) : '—' },
    { label: 'Weight', value: pokemon.weight > 0 ? formatWeight(pokemon.weight) : '—' },
    { label: 'Base experience', value: pokemon.baseExperience ?? '—' },
  ]

  return (
    <article className="grid gap-8 lg:grid-cols-12 lg:gap-10">
      <div className="lg:col-span-7">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-bold sm:text-4xl">{displayName(pokemon.name)}</h1>
          <span className="text-sm text-content-muted tabular-nums">{formatId(pokemon.id)}</span>
          {pokemon.origin === 'custom' ? <Badge tone="brand">Custom</Badge> : null}
        </div>

        <TypeBadges types={pokemon.types} className="mt-3" />

        <div className="mt-6 flex min-h-64 items-center justify-center rounded-card bg-[radial-gradient(circle,rgba(148,187,233,1)_0%,rgba(148,187,233,0)_55%)] px-6 md:py-10">
          {image ? (
            <Image
              src={image}
              alt={pokemon.name}
              width={384}
              height={384}
              className="size-64 object-contain drop-shadow-xl sm:size-80 lg:size-96"
              priority
            />
          ) : (
            <span className="text-2xs text-content-muted">No artwork</span>
          )}
        </div>

        <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {facts.map((fact) => (
            <div
              key={fact.label}
              className="rounded-card border border-border-subtle bg-surface p-3"
            >
              <dt className="text-2xs uppercase text-content-muted">{fact.label}</dt>
              <dd className="mt-1 text-sm font-medium">{fact.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="flex flex-col gap-6 lg:col-span-5">
        <Card>
          <h2 className="text-sm font-semibold">Type matchups</h2>
          <div className="mt-3">
            <TypeMatchups matchups={matchups} />
          </div>
        </Card>

        <Card>
          <h2 className="text-sm font-semibold">Abilities</h2>
          <div className="mt-3">
            <AbilityList abilities={abilities} />
          </div>
        </Card>

        <Card>
          <h2 className="text-sm font-semibold">Base stats</h2>
          <div className="mt-3">
            <StatList stats={pokemon.stats} />
          </div>
        </Card>
      </div>
    </article>
  )
}
