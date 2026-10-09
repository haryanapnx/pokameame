import { fireEvent, render, screen } from '@testing-library/react'

import { Tabs, type TabItem } from './Tabs'

const items: TabItem[] = [
  { id: 'stats', label: 'Stats', content: <p>stats content</p> },
  { id: 'abilities', label: 'Abilities', content: <p>abilities content</p> },
]

describe('Tabs', () => {
  it('renders a tablist with the first tab selected', () => {
    render(<Tabs items={items} />)

    expect(screen.getByRole('tab', { name: 'Stats' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tab', { name: 'Abilities' })).toHaveAttribute('aria-selected', 'false')
    expect(screen.getByRole('tabpanel')).toHaveTextContent('stats content')
  })

  it('uses a roving tabindex', () => {
    render(<Tabs items={items} />)

    expect(screen.getByRole('tab', { name: 'Stats' })).toHaveAttribute('tabindex', '0')
    expect(screen.getByRole('tab', { name: 'Abilities' })).toHaveAttribute('tabindex', '-1')
  })

  it('switches tabs on click', () => {
    render(<Tabs items={items} />)

    fireEvent.click(screen.getByRole('tab', { name: 'Abilities' }))

    expect(screen.getByRole('tab', { name: 'Abilities' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tabpanel')).toHaveTextContent('abilities content')
  })

  it('moves the selection with arrow keys', () => {
    render(<Tabs items={items} />)

    fireEvent.keyDown(screen.getByRole('tab', { name: 'Stats' }), { key: 'ArrowRight' })

    expect(screen.getByRole('tab', { name: 'Abilities' })).toHaveAttribute('aria-selected', 'true')
  })

  it('wraps around backwards from the first tab', () => {
    render(<Tabs items={items} />)

    fireEvent.keyDown(screen.getByRole('tab', { name: 'Stats' }), { key: 'ArrowLeft' })

    expect(screen.getByRole('tab', { name: 'Abilities' })).toHaveAttribute('aria-selected', 'true')
  })
})
