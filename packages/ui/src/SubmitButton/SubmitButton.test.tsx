import { render, screen } from '@testing-library/react'
import type * as ReactDOM from 'react-dom'

import { SubmitButton } from './SubmitButton'

const formStatus = vi.hoisted(() => ({ pending: false }))

vi.mock('react-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof ReactDOM>()
  return { ...actual, useFormStatus: () => ({ pending: formStatus.pending }) }
})

describe('SubmitButton', () => {
  it('renders an enabled submit button when idle', () => {
    formStatus.pending = false
    render(<SubmitButton>Save</SubmitButton>)

    expect(screen.getByRole('button', { name: /Save/ })).toBeEnabled()
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  it('disables and shows a spinner while the form is pending', () => {
    formStatus.pending = true
    render(<SubmitButton>Save</SubmitButton>)

    expect(screen.getByRole('button', { name: /Save/ })).toBeDisabled()
    expect(screen.getByRole('status', { name: 'Saving' })).toBeInTheDocument()
  })
})
