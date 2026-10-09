import Link from 'next/link'

import { Container } from '@poke/ui'

import { AddBerryForm } from '../../../components/AddBerryForm/AddBerryForm'

export const metadata = { title: 'Add a berry' }

export default function NewBerryPage() {
  return (
    <Container className="py-10">
      <Link
        prefetch={false}
        href="/berries"
        className="text-sm text-content-muted hover:text-content"
      >
        ← Back to berries
      </Link>

      <header className="mt-6 max-w-2xl">
        <h1 className="text-2xl font-bold sm:text-3xl">Add a custom berry</h1>
        <p className="mt-2 text-sm text-content-muted">
          Your berry is stored alongside the PokeAPI entries and shown with a Custom badge.
        </p>
      </header>

      <div className="mt-8 max-w-2xl">
        <AddBerryForm />
      </div>
    </Container>
  )
}
