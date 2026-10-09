import { render, screen } from '@testing-library/react'

import { StatList } from './StatList'

describe('StatList', () => {
  it('renders a labelled bar per stat', () => {
    render(
      <StatList
        stats={[
          { name: 'hp', value: 35 },
          { name: 'special-attack', value: 50 },
        ]}
      />,
    )

    expect(screen.getByRole('progressbar', { name: 'hp' })).toHaveAttribute('aria-valuenow', '35')
    expect(screen.getByRole('progressbar', { name: 'special attack' })).toHaveAttribute(
      'aria-valuenow',
      '50',
    )
  })

  it('explains when there are no stats', () => {
    render(<StatList stats={[]} />)

    expect(screen.getByText('No stats recorded.')).toBeInTheDocument()
  })
})
