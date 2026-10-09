import { fireEvent, render, screen } from '@testing-library/react'

import { MobileMenu } from './MobileMenu'

describe('MobileMenu', () => {
  it('starts collapsed', () => {
    render(<MobileMenu>links</MobileMenu>)

    expect(screen.getByRole('button', { name: 'Menu' })).toHaveAttribute('aria-expanded', 'false')
  })

  it('toggles the panel open and closed', () => {
    render(<MobileMenu>links</MobileMenu>)
    const button = screen.getByRole('button', { name: 'Menu' })

    fireEvent.click(button)
    expect(button).toHaveAttribute('aria-expanded', 'true')

    fireEvent.click(button)
    expect(button).toHaveAttribute('aria-expanded', 'false')
  })

  it('associates the button with the panel', () => {
    render(<MobileMenu panelId="nav-panel">links</MobileMenu>)

    expect(screen.getByRole('button', { name: 'Menu' })).toHaveAttribute(
      'aria-controls',
      'nav-panel',
    )
    expect(document.getElementById('nav-panel')).toHaveAttribute('hidden')
  })

  it('forwards extra classes to the panel', () => {
    render(
      <MobileMenu panelId="nav-panel" panelClassName="absolute inset-x-0">
        links
      </MobileMenu>,
    )

    expect(document.getElementById('nav-panel')).toHaveClass('absolute', 'inset-x-0')
  })

  it('supports a controlled open state', () => {
    const onOpenChange = vi.fn()
    const { rerender } = render(
      <MobileMenu open={false} onOpenChange={onOpenChange}>
        links
      </MobileMenu>,
    )

    const button = screen.getByRole('button', { name: 'Menu' })
    expect(button).toHaveAttribute('aria-expanded', 'false')

    fireEvent.click(button)
    expect(onOpenChange).toHaveBeenCalledWith(true)
    // Still collapsed: the parent owns the state.
    expect(button).toHaveAttribute('aria-expanded', 'false')

    rerender(
      <MobileMenu open onOpenChange={onOpenChange}>
        links
      </MobileMenu>,
    )
    expect(screen.getByRole('button', { name: 'Menu' })).toHaveAttribute('aria-expanded', 'true')
  })
})
