import { render, screen } from '@testing-library/react'

function Hello({ name }: { name: string }) {
  return <p>hello {name}</p>
}

describe('@poke/vitest-config react preset', () => {
  it('renders JSX in jsdom and registers jest-dom matchers', () => {
    render(<Hello name="world" />)

    expect(screen.getByText('hello world')).toBeInTheDocument()
  })

  it('cleans up the DOM between tests', () => {
    expect(screen.queryByText(/hello/)).not.toBeInTheDocument()
  })
})
