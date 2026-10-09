import { DEFAULT_PAGE_SIZE, parsePage } from '@poke/core'
import { listBerryCatalog } from '@poke/core/services'
import { Container, EmptyState } from '@poke/ui'

import { BerryGrid } from '../../components/BerryGrid/BerryGrid'
import { BerryPagination } from '../../components/BerryPagination/BerryPagination'
import { BerrySearch } from '../../components/BerrySearch/BerrySearch'

export const metadata = { title: 'Berries' }

type BerryListSearchParams = Promise<{ page?: string; q?: string }>

export default async function BerryListPage({
  searchParams,
}: {
  searchParams: BerryListSearchParams
}) {
  const { page: rawPage, q } = await searchParams
  const query = typeof q === 'string' && q.trim() !== '' ? q.trim() : undefined
  const page = parsePage(rawPage)

  const result = await listBerryCatalog({ page, query, pageSize: DEFAULT_PAGE_SIZE })

  return (
    <Container className="py-10">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-2xl">
          <h1 className="text-2xl font-bold sm:text-3xl">Berries</h1>
          <p className="mt-2 text-sm text-content-muted">
            Explore berry firmness, flavours and effects from PokeAPI.
          </p>
        </div>
      </header>

      <BerrySearch initialQuery={query ?? ''} />

      {result.total === 0 ? (
        <EmptyState
          className="mt-8"
          title="No berries found"
          description={
            query ? `Nothing matches "${query}". Try a different name.` : 'Nothing to show yet.'
          }
        />
      ) : (
        <>
          <BerryGrid items={result.items} />
          <BerryPagination page={result.page} totalPages={result.totalPages} query={query} />
        </>
      )}
    </Container>
  )
}
