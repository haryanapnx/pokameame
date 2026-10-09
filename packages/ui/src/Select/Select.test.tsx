import { render, screen } from '@testing-library/react'

import { Select } from './Select'

describe('Select', () => {
  it('renders its options', () => {
    render(
      <Select aria-label="Type" defaultValue="fire">
        <option value="fire">Fire</option>
        <option value="water">Water</option>
      </Select>,
    )

    expect(screen.getByRole('combobox', { name: 'Type' })).toHaveValue('fire')
    expect(screen.getByRole('option', { name: 'Water' })).toBeInTheDocument()
  })

  it('marks invalid selects', () => {
    render(
      <Select aria-label="Type" invalid>
        <option value="fire">Fire</option>
      </Select>,
    )

    expect(screen.getByRole('combobox', { name: 'Type' })).toHaveAttribute('aria-invalid', 'true')
  })
})
