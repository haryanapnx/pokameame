import { fireEvent, render, screen } from '@testing-library/react'

import { RouteLoadingIndicator } from './RouteLoadingIndicator'

function setup() {
  render(
    <>
      <RouteLoadingIndicator />
      <a href="/pokemon">to pokemon</a>
      <a href="https://example.com/pokemon">external</a>
      <a href="/pokemon" onClick={(event) => event.preventDefault()}>
        handled by the router
      </a>
    </>,
  )
}

describe('RouteLoadingIndicator', () => {
  it('stays hidden until something is clicked', () => {
    setup()

    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  it('shows a spinner for a same-origin document navigation', () => {
    setup()

    fireEvent.click(screen.getByRole('link', { name: 'to pokemon' }))

    expect(screen.getByRole('status')).toHaveAccessibleName('Memuat halaman…')
    expect(screen.getByText('Memuat halaman…')).toBeInTheDocument()
  })

  it('ignores clicks the router already handled', () => {
    setup()

    fireEvent.click(screen.getByRole('link', { name: 'handled by the router' }))

    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  it('ignores external links and clicks with modifier keys', () => {
    setup()

    fireEvent.click(screen.getByRole('link', { name: 'external' }))
    expect(screen.queryByRole('status')).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('link', { name: 'to pokemon' }), { metaKey: true })
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  it('clears the spinner when the page is restored from the bfcache', () => {
    setup()

    fireEvent.click(screen.getByRole('link', { name: 'to pokemon' }))
    expect(screen.getByRole('status')).toBeInTheDocument()

    fireEvent(window, new Event('pageshow'))

    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })
})
