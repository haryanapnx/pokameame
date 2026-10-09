import Link from 'next/link'

import { getAbilityIndex } from '@poke/core/services'
import { Container } from '@poke/ui'

import { AddPokemonForm } from '../../../components/AddPokemonForm/AddPokemonForm'

export const metadata = { title: 'Add a Pokemon' }

async function loadAbilityNames(): Promise<string[]> {
  try {
    const index = await getAbilityIndex()
    return index.results.map((ability) => ability.name)
  } catch {
    return []
  }
}

export default async function NewPokemonPage() {
  const abilityNames = await loadAbilityNames()

  return (
    <Container className="py-10">
      <Link href="/pokemon" className="text-sm text-content-muted hover:text-content">
        ← Back to Pokemon
      </Link>

      <header className="mt-6 max-w-2xl">
        <h1 className="text-2xl font-bold sm:text-3xl">Add a custom Pokemon</h1>
        <p className="mt-2 text-sm text-content-muted">
          Your Pokemon is stored alongside the PokeAPI entries and shown with a Custom badge.
        </p>
      </header>

      <div className="mt-8 max-w-2xl">
        <AddPokemonForm abilityNames={abilityNames} />
      </div>
    </Container>
  )
}
