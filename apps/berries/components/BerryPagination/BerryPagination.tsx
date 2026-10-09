import Link from 'next/link'

import { Pagination } from '@poke/ui'

import { buildBerryListHref } from '../../lib/berry-links'

export type BerryPaginationProps = {
  page: number
  totalPages: number
  query?: string
}

export function BerryPagination({ page, totalPages, query }: BerryPaginationProps) {
  return (
    <Pagination
      page={page}
      totalPages={totalPages}
      getHref={(target) => buildBerryListHref(target, query)}
      linkComponent={Link}
      className="mt-8"
    />
  )
}
