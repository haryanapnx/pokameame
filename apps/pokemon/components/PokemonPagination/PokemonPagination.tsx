import Link from 'next/link'

import { Pagination } from '@poke/ui'

import { buildPokemonListHref } from '../../lib/pokemon-links'

export type PokemonPaginationProps = {
  page: number
  totalPages: number
  query?: string
}

/** Server Component: hands Next's `Link` to the ui Pagination so nav stays client-side. */
export function PokemonPagination({ page, totalPages, query }: PokemonPaginationProps) {
  return (
    <Pagination
      page={page}
      totalPages={totalPages}
      getHref={(target) => buildPokemonListHref(target, query)}
      linkComponent={Link}
      className="mt-8"
    />
  )
}
