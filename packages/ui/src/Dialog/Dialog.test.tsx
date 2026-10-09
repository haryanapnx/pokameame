import { fireEvent, render, screen } from '@testing-library/react'

import { Dialog } from './Dialog'

describe('Dialog', () => {
  it('renders nothing while closed', () => {
    render(
      <Dialog open={false} onClose={() => {}} title="Add Pokemon">
        body
      </Dialog>,
    )

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('renders a labelled modal dialog when open', () => {
    render(
      <Dialog open onClose={() => {}} title="Add Pokemon">
        body
      </Dialog>,
    )

    const dialog = screen.getByRole('dialog', { name: 'Add Pokemon' })
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    expect(dialog).toHaveFocus()
  })

  it('closes on Escape', () => {
    const onClose = vi.fn()
    render(
      <Dialog open onClose={onClose} title="Add Pokemon">
        body
      </Dialog>,
    )

    fireEvent.keyDown(document, { key: 'Escape' })

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('closes from the close button', () => {
    const onClose = vi.fn()
    render(
      <Dialog open onClose={onClose} title="Add Pokemon">
        body
      </Dialog>,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Close dialog' }))

    expect(onClose).toHaveBeenCalledTimes(1)
  })
})
