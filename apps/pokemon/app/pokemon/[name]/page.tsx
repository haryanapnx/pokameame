import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { displayName } from '@poke/core'
import { getPokemonAbilities, getPokemonDetail, getPokemonTypeMatchups } from '@poke/core/services'
import { Container } from '@poke/ui'

import { PokemonDetail } from '../../../components/PokemonDetail/PokemonDetail'

type PokemonDetailParams = Promise<{ name: string }>

type PokemonDetailPageProps = {
  params: PokemonDetailParams
}

export async function generateMetadata({ params }: PokemonDetailPageProps): Promise<Metadata> {
  const { name } = await params
  const pokemon = await getPokemonDetail(name)

  if (!pokemon) return { title: 'Pokemon not found' }

  const title = displayName(pokemon.name)

  return {
    title,
    description: `Types, abilities and base stats for ${title}.`,
  }
}

export default async function PokemonDetailPage({ params }: PokemonDetailPageProps) {
  const { name } = await params
  const pokemon = await getPokemonDetail(name)

  if (!pokemon) notFound()

  const [abilities, matchups] = await Promise.all([
    getPokemonAbilities(pokemon.abilities),
    getPokemonTypeMatchups(pokemon.types),
  ])

  return (
    <Container className="py-10">
      <Link href="/pokemon" className="text-sm text-content-muted hover:text-content">
        ← Back to Pokemon
      </Link>

      <div className="mt-6">
        <PokemonDetail pokemon={pokemon} abilities={abilities} matchups={matchups} />
      </div>
    </Container>
  )
}
