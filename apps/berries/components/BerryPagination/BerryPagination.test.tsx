import { render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'

import { BerryPagination } from './BerryPagination'

vi.mock('next/link', () => ({
  default: ({ href, children, ...rest }: { href: string; children: ReactNode }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}))

describe('BerryPagination', () => {
  it('builds list hrefs that keep the current query', () => {
    render(<BerryPagination page={1} totalPages={4} query="cheri" />)

    expect(screen.getByRole('link', { name: '2' })).toHaveAttribute(
      'href',
      '/berries?q=cheri&page=2',
    )
  })

  it('drops the query when there is none', () => {
    render(<BerryPagination page={1} totalPages={4} />)

    expect(screen.getByRole('link', { name: '2' })).toHaveAttribute('href', '/berries?page=2')
  })

  it('renders nothing for a single page', () => {
    const { container } = render(<BerryPagination page={1} totalPages={1} />)

    expect(container).toBeEmptyDOMElement()
  })
})
