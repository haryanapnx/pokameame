import { render, screen } from '@testing-library/react'

import { Input } from './Input'

describe('Input', () => {
  it('renders a textbox and forwards native props', () => {
    render(<Input placeholder="Search" name="q" />)

    const input = screen.getByPlaceholderText('Search')
    expect(input).toHaveAttribute('name', 'q')
    expect(input).not.toHaveAttribute('aria-invalid')
  })

  it('marks invalid inputs for assistive technology', () => {
    render(<Input invalid placeholder="Search" />)

    expect(screen.getByPlaceholderText('Search')).toHaveAttribute('aria-invalid', 'true')
  })

  it('merges className overrides', () => {
    render(<Input placeholder="Search" className="max-w-xs" />)

    expect(screen.getByPlaceholderText('Search')).toHaveClass('max-w-xs')
  })
})
