import { render, screen } from '@testing-library/react'

import { AbilityList, formatGeneration } from './AbilityList'

describe('AbilityList', () => {
  it('renders the effect text, hidden flag and generation', () => {
    render(
      <AbilityList
        abilities={[
          {
            name: 'static',
            isHidden: false,
            effect: 'Contact with the Pokemon may paralyze.',
            generation: 'generation-iii',
          },
          { name: 'lightning-rod', isHidden: true, effect: null, generation: null },
        ]}
      />,
    )

    expect(screen.getByText('Static')).toBeInTheDocument()
    expect(screen.getByText('Contact with the Pokemon may paralyze.')).toBeInTheDocument()
    expect(screen.getByText('Gen III')).toBeInTheDocument()
    expect(screen.getByText('Lightning Rod')).toBeInTheDocument()
    expect(screen.getByText('Hidden')).toBeInTheDocument()
  })

  it('explains when there are no abilities', () => {
    render(<AbilityList abilities={[]} />)

    expect(screen.getByText('No abilities recorded.')).toBeInTheDocument()
  })
})

describe('formatGeneration', () => {
  it('turns a generation slug into a short label', () => {
    expect(formatGeneration('generation-iii')).toBe('Gen III')
    expect(formatGeneration('generation-i')).toBe('Gen I')
  })
})
