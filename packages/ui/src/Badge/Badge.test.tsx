import { render, screen } from '@testing-library/react'

import { Badge } from './Badge'

describe('Badge', () => {
  it('renders neutral by default', () => {
    render(<Badge>Custom</Badge>)

    expect(screen.getByText('Custom')).toHaveClass('bg-slate-100')
  })

  it('applies the requested tone', () => {
    render(<Badge tone="danger">Error</Badge>)

    expect(screen.getByText('Error')).toHaveClass('bg-red-100')
  })
})
