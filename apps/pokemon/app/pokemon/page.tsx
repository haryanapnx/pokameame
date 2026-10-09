import { DEFAULT_PAGE_SIZE, parsePage } from '@poke/core'
import { listPokemonCatalog } from '@poke/core/services'
import { Container, EmptyState } from '@poke/ui'

import { PokemonGrid } from '../../components/PokemonGrid/PokemonGrid'
import { PokemonPagination } from '../../components/PokemonPagination/PokemonPagination'
import { PokemonSearch } from '../../components/PokemonSearch/PokemonSearch'

export const metadata = { title: 'Pokemon' }

type PokemonListSearchParams = Promise<{ page?: string; q?: string }>

export default async function PokemonListPage({
  searchParams,
}: {
  searchParams: PokemonListSearchParams
}) {
  const { page: rawPage, q } = await searchParams
  const query = typeof q === 'string' && q.trim() !== '' ? q.trim() : undefined
  const page = parsePage(rawPage)

  const result = await listPokemonCatalog({ page, query, pageSize: DEFAULT_PAGE_SIZE })

  return (
    <Container className="py-10">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-2xl">
          <h1 className="text-2xl font-bold sm:text-3xl">Pokemon</h1>
          <p className="mt-2 text-sm text-content-muted">
            Browse Pokemon from PokeAPI, search by name, and add your own alongside them.
          </p>
        </div>
      </header>

      <PokemonSearch initialQuery={query ?? ''} />

      {result.total === 0 ? (
        <EmptyState
          className="mt-8"
          title="No Pokemon found"
          description={
            query ? `Nothing matches "${query}". Try a different name.` : 'Nothing to show yet.'
          }
        />
      ) : (
        <>
          <PokemonGrid items={result.items} />
          <PokemonPagination page={result.page} totalPages={result.totalPages} query={query} />
        </>
      )}
    </Container>
  )
}
