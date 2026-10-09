import { render, screen } from '@testing-library/react'

import { Input } from '../Input/Input'
import { FormField } from './FormField'

describe('FormField', () => {
  it('associates the label with the control and injects the id', () => {
    render(
      <FormField id="name" label="Name">
        <Input />
      </FormField>,
    )

    expect(screen.getByLabelText('Name')).toHaveAttribute('id', 'name')
  })

  it('renders an error with role=alert and wires aria-describedby', () => {
    render(
      <FormField id="name" label="Name" error="Name is required">
        <Input />
      </FormField>,
    )

    expect(screen.getByRole('alert')).toHaveTextContent('Name is required')
    const input = screen.getByLabelText('Name')
    expect(input).toHaveAttribute('aria-describedby', 'name-error')
    expect(input).toHaveAttribute('aria-invalid', 'true')
  })

  it('renders a hint and describes the control with it', () => {
    render(
      <FormField id="name" label="Name" hint="Lowercase only">
        <Input />
      </FormField>,
    )

    expect(screen.getByText('Lowercase only')).toHaveAttribute('id', 'name-hint')
    expect(screen.getByLabelText('Name')).toHaveAttribute('aria-describedby', 'name-hint')
  })

  it('hides the hint while an error is shown', () => {
    render(
      <FormField id="name" label="Name" hint="Lowercase only" error="Name is required">
        <Input />
      </FormField>,
    )

    expect(screen.queryByText('Lowercase only')).not.toBeInTheDocument()
  })

  it('marks required fields visually without leaking into the accessible name', () => {
    render(
      <FormField id="name" label="Name" required>
        <Input />
      </FormField>,
    )

    expect(screen.getByText('*')).toHaveAttribute('aria-hidden', 'true')
    expect(screen.getByLabelText(/Name/)).toBeInTheDocument()
  })
})
