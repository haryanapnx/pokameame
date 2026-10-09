import { fireEvent, render, screen, within } from '@testing-library/react'

import { SiteHeader } from './SiteHeader'

describe('SiteHeader', () => {
  it('links to every section', () => {
    render(<SiteHeader />)

    expect(screen.getByRole('link', { name: /Pokemon Explorer/ })).toHaveAttribute('href', '/')
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/')
    expect(screen.getByRole('link', { name: 'Pokemon' })).toHaveAttribute('href', '/pokemon')
    expect(screen.getByRole('link', { name: 'Berries' })).toHaveAttribute('href', '/berries')
  })

  it('highlights the active section', () => {
    render(<SiteHeader activeHref="/pokemon" />)

    expect(screen.getByRole('link', { name: 'Pokemon' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('link', { name: 'Home' })).not.toHaveAttribute('aria-current')
    expect(screen.getByRole('link', { name: 'Berries' })).not.toHaveAttribute('aria-current')
  })

  it('marks nothing active when no section is given', () => {
    render(<SiteHeader />)

    expect(screen.getByRole('link', { name: 'Home' })).not.toHaveAttribute('aria-current')
    expect(screen.getByRole('link', { name: 'Berries' })).not.toHaveAttribute('aria-current')
  })

  it('reveals the same sections through the mobile disclosure', () => {
    render(<SiteHeader activeHref="/pokemon" />)

    const toggle = screen.getByRole('button', { name: 'Open sections menu' })
    expect(toggle).toHaveAttribute('aria-expanded', 'false')

    fireEvent.click(toggle)
    expect(toggle).toHaveAttribute('aria-expanded', 'true')

    const panel = document.getElementById('poke-mobile-menu') as HTMLElement
    expect(panel).not.toHaveAttribute('hidden')
    expect(within(panel).getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/')
    expect(within(panel).getByRole('link', { name: 'Pokemon' })).toHaveAttribute(
      'aria-current',
      'page',
    )
  })
})
