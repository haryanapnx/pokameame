import { render, screen } from '@testing-library/react'

import { Checkbox } from './Checkbox'

describe('Checkbox', () => {
  it('renders an unchecked checkbox by default', () => {
    render(<Checkbox aria-label="Hidden ability" />)

    expect(screen.getByRole('checkbox', { name: 'Hidden ability' })).not.toBeChecked()
  })

  it('supports the checked and disabled states', () => {
    render(<Checkbox aria-label="Hidden ability" checked disabled readOnly />)

    const checkbox = screen.getByRole('checkbox', { name: 'Hidden ability' })
    expect(checkbox).toBeChecked()
    expect(checkbox).toBeDisabled()
  })
})
