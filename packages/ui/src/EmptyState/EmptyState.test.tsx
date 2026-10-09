import { render, screen } from '@testing-library/react'

import { EmptyState } from './EmptyState'

describe('EmptyState', () => {
  it('renders a title and optional description', () => {
    render(<EmptyState title="No results" description="Try another search" />)

    expect(screen.getByText('No results')).toBeInTheDocument()
    expect(screen.getByText('Try another search')).toBeInTheDocument()
  })

  it('renders an action slot', () => {
    render(<EmptyState title="No results" action={<button type="button">Reset</button>} />)

    expect(screen.getByRole('button', { name: 'Reset' })).toBeInTheDocument()
  })
})
