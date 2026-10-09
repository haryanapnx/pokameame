import { render, screen } from '@testing-library/react'

import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from './Table'

describe('Table', () => {
  it('renders an accessible table with headers and cells', () => {
    render(
      <Table>
        <TableHead>
          <TableRow>
            <TableHeaderCell>Stat</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>hp</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    )

    expect(screen.getByRole('table')).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: 'Stat' })).toBeInTheDocument()
    expect(screen.getByRole('cell', { name: 'hp' })).toBeInTheDocument()
  })

  it('wraps the table in a horizontal scroll container', () => {
    render(<Table data-testid="t" />)

    const wrapper = screen.getByTestId('t').parentElement
    expect(wrapper).toHaveClass('overflow-x-auto')
  })
})
