import { fireEvent, render, screen } from '@testing-library/react'

import { createBerryAction } from '../../app/berries/actions'
import { AddBerryForm } from './AddBerryForm'

vi.mock('../../app/berries/actions', () => ({ createBerryAction: vi.fn() }))

const createBerryActionMock = vi.mocked(createBerryAction)

describe('AddBerryForm', () => {
  beforeEach(() => {
    createBerryActionMock.mockReset()
    createBerryActionMock.mockResolvedValue(null)
  })

  it('renders the name, firmness, growth, flavour and property fields', () => {
    render(<AddBerryForm />)

    expect(screen.getByLabelText(/Name/)).toBeInTheDocument()
    expect(screen.getByLabelText(/Firmness/)).toBeInTheDocument()
    expect(screen.getByLabelText(/Growth time/)).toBeInTheDocument()
    expect(screen.getByLabelText('Spicy')).toBeInTheDocument()
    expect(screen.getByLabelText('Soil dryness')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Add berry/ })).toBeInTheDocument()
  })

  it('surfaces a duplicate-name error returned by the Server Action', async () => {
    createBerryActionMock.mockResolvedValue({
      ok: false,
      error: {
        code: 'duplicate',
        message: 'Berry "cheri" already exists',
        fieldErrors: { name: 'That name is already taken' },
      },
    })

    render(<AddBerryForm />)

    fireEvent.change(screen.getByLabelText(/Name/), { target: { value: 'cheri' } })
    fireEvent.click(screen.getByRole('button', { name: /Add berry/ }))

    expect(await screen.findByText('Berry "cheri" already exists')).toBeInTheDocument()
    expect(screen.getByText('That name is already taken')).toBeInTheDocument()
  })

  it('keeps what the user entered when validation fails', async () => {
    createBerryActionMock.mockResolvedValue({
      ok: false,
      error: {
        code: 'validation',
        message: 'Please fix the highlighted fields',
        fieldErrors: { name: 'Name is required' },
      },
    })

    render(<AddBerryForm />)

    fireEvent.change(screen.getByLabelText(/Name/), { target: { value: 'mystery-berry' } })
    fireEvent.change(screen.getByLabelText(/Growth time/), { target: { value: '12' } })
    fireEvent.change(screen.getByLabelText('Natural gift type'), { target: { value: 'fire' } })

    fireEvent.click(screen.getByRole('button', { name: /Add berry/ }))

    expect(await screen.findByText('Please fix the highlighted fields')).toBeInTheDocument()
    expect(screen.getByLabelText(/Name/)).toHaveValue('mystery-berry')
    expect(screen.getByLabelText(/Growth time/)).toHaveValue(12)
    expect(screen.getByLabelText('Natural gift type')).toHaveValue('fire')
  })
})
