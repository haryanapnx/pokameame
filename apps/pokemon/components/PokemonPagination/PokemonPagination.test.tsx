import { render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'

import { PokemonPagination } from './PokemonPagination'

vi.mock('next/link', () => ({
  default: ({ href, children, ...rest }: { href: string; children: ReactNode }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}))

describe('PokemonPagination', () => {
  it('builds list hrefs that keep the current query', () => {
    render(<PokemonPagination page={2} totalPages={5} query="pika" />)

    expect(screen.getByRole('link', { name: '3' })).toHaveAttribute(
      'href',
      '/pokemon?q=pika&page=3',
    )
  })

  it('drops the query when navigating to the first page', () => {
    render(<PokemonPagination page={3} totalPages={5} />)

    expect(screen.getByRole('link', { name: '2' })).toHaveAttribute('href', '/pokemon?page=2')
  })

  it('marks the current page', () => {
    render(<PokemonPagination page={2} totalPages={5} />)

    expect(screen.getByRole('link', { name: '2' })).toHaveAttribute('aria-current', 'page')
  })

  it('renders nothing for a single page', () => {
    const { container } = render(<PokemonPagination page={1} totalPages={1} />)

    expect(container).toBeEmptyDOMElement()
  })
})
