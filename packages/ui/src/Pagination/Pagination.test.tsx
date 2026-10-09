import { render, screen } from '@testing-library/react'

import { Pagination, buildPageRange, type PaginationLinkProps } from './Pagination'

describe('buildPageRange', () => {
  it('lists every page when they fit', () => {
    expect(buildPageRange(1, 5)).toEqual([1, 2, 3, 4, 5])
  })

  it('adds a trailing ellipsis near the start', () => {
    expect(buildPageRange(1, 10)).toEqual([1, 2, 'ellipsis', 10])
  })

  it('adds ellipses on both sides in the middle', () => {
    expect(buildPageRange(5, 10)).toEqual([1, 'ellipsis', 4, 5, 6, 'ellipsis', 10])
  })

  it('returns an empty range for an empty result set', () => {
    expect(buildPageRange(1, 0)).toEqual([])
  })
})

describe('Pagination', () => {
  const getHref = (page: number) => `/pokemon?page=${page}`

  it('renders a labelled navigation with page links', () => {
    render(<Pagination page={2} totalPages={5} getHref={getHref} />)

    expect(screen.getByRole('navigation', { name: 'Pagination' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '3' })).toHaveAttribute('href', '/pokemon?page=3')
  })

  it('marks the current page', () => {
    render(<Pagination page={2} totalPages={5} getHref={getHref} />)

    expect(screen.getByRole('link', { name: '2' })).toHaveAttribute('aria-current', 'page')
  })

  it('disables previous on the first page', () => {
    render(<Pagination page={1} totalPages={5} getHref={getHref} />)

    expect(screen.queryByRole('link', { name: 'Previous page' })).not.toBeInTheDocument()
    expect(screen.getByText('Previous')).toHaveAttribute('aria-disabled', 'true')
  })

  it('renders nothing for a single page', () => {
    const { container } = render(<Pagination page={1} totalPages={1} getHref={getHref} />)

    expect(container).toBeEmptyDOMElement()
  })

  it('renders links through the supplied link component', () => {
    function TestLink({ href, children, ...rest }: PaginationLinkProps) {
      return (
        <a data-testid="custom-link" href={href} {...rest}>
          {children}
        </a>
      )
    }

    render(<Pagination page={1} totalPages={3} getHref={getHref} linkComponent={TestLink} />)

    expect(screen.getAllByTestId('custom-link').length).toBeGreaterThan(0)
  })
})
