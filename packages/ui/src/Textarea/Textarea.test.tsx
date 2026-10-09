import { render, screen } from '@testing-library/react'

import { Textarea } from './Textarea'

describe('Textarea', () => {
  it('renders with a default row count and forwards props', () => {
    render(<Textarea aria-label="Notes" />)

    expect(screen.getByLabelText('Notes')).toHaveAttribute('rows', '4')
  })

  it('honours an explicit row count', () => {
    render(<Textarea aria-label="Notes" rows={8} />)

    expect(screen.getByLabelText('Notes')).toHaveAttribute('rows', '8')
  })

  it('marks invalid textareas', () => {
    render(<Textarea aria-label="Notes" invalid />)

    expect(screen.getByLabelText('Notes')).toHaveAttribute('aria-invalid', 'true')
  })
})
