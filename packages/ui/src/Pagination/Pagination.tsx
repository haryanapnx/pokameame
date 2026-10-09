import type { ComponentType, ReactNode } from 'react'

import { cn } from '../cn'

export type PaginationLinkProps = {
  href: string
  className?: string
  'aria-current'?: 'page'
  'aria-label'?: string
  children: ReactNode
}

export type PaginationProps = {
  page: number
  totalPages: number
  getHref: (page: number) => string
  /**
   * Link element used for navigation. Apps pass Next.js `Link` so pagination
   * stays client-side and prefetchable; defaults to a plain anchor.
   */
  linkComponent?: ComponentType<PaginationLinkProps>
  className?: string
}

function DefaultLink({ children, ...props }: PaginationLinkProps) {
  return <a {...props}>{children}</a>
}

/** Builds the visible page list, inserting `'ellipsis'` markers as needed. */
export function buildPageRange(
  current: number,
  total: number,
  siblings = 1,
): Array<number | 'ellipsis'> {
  if (total <= 0) return []
  if (total <= siblings * 2 + 5) {
    return Array.from({ length: total }, (_, index) => index + 1)
  }

  const left = Math.max(current - siblings, 1)
  const right = Math.min(current + siblings, total)
  const pages: Array<number | 'ellipsis'> = [1]

  if (left > 2) pages.push('ellipsis')
  for (let candidate = Math.max(left, 2); candidate <= Math.min(right, total - 1); candidate += 1) {
    pages.push(candidate)
  }
  if (right < total - 1) pages.push('ellipsis')
  pages.push(total)

  return pages
}

const itemClass =
  'inline-flex h-9 min-w-9 items-center justify-center rounded-control px-2 text-sm transition'

export function Pagination({
  page,
  totalPages,
  getHref,
  linkComponent: LinkComponent = DefaultLink,
  className,
}: PaginationProps) {
  if (totalPages <= 1) return null

  const range = buildPageRange(page, totalPages)
  const hasPrevious = page > 1
  const hasNext = page < totalPages

  return (
    <nav
      aria-label="Pagination"
      className={cn('flex items-center gap-1 justify-center', className)}
    >
      {hasPrevious ? (
        <LinkComponent
          href={getHref(page - 1)}
          aria-label="Previous page"
          className={cn(itemClass, 'text-content hover:bg-surface-muted')}
        >
          Previous
        </LinkComponent>
      ) : (
        <span aria-disabled="true" className={cn(itemClass, 'text-content-muted opacity-50')}>
          Previous
        </span>
      )}

      {range.map((entry, index) =>
        entry === 'ellipsis' ? (
          <span
            key={`ellipsis-${index}`}
            aria-hidden="true"
            className={cn(itemClass, 'text-content-muted')}
          >
            …
          </span>
        ) : (
          <LinkComponent
            key={entry}
            href={getHref(entry)}
            aria-current={entry === page ? 'page' : undefined}
            className={cn(
              itemClass,
              entry === page ? 'bg-brand-600 text-white' : 'text-content hover:bg-surface-muted',
            )}
          >
            {entry}
          </LinkComponent>
        ),
      )}

      {hasNext ? (
        <LinkComponent
          href={getHref(page + 1)}
          aria-label="Next page"
          className={cn(itemClass, 'text-content hover:bg-surface-muted')}
        >
          Next
        </LinkComponent>
      ) : (
        <span aria-disabled="true" className={cn(itemClass, 'text-content-muted opacity-50')}>
          Next
        </span>
      )}
    </nav>
  )
}
