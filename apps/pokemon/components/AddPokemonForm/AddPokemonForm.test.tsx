import { fireEvent, render, screen } from '@testing-library/react'

import { createPokemonAction } from '../../app/pokemon/actions'
import { AddPokemonForm } from './AddPokemonForm'

vi.mock('../../app/pokemon/actions', () => ({ createPokemonAction: vi.fn() }))

const createPokemonActionMock = vi.mocked(createPokemonAction)

const ABILITY_NAMES = ['static', 'lightning-rod', 'levitate']

function renderForm(abilityNames: string[] = ABILITY_NAMES) {
  return render(<AddPokemonForm abilityNames={abilityNames} />)
}

function abilitySelect(): HTMLSelectElement {
  return screen.getByLabelText('Abilities') as HTMLSelectElement
}

function pick(select: HTMLSelectElement, ...names: string[]) {
  for (const option of Array.from(select.options)) {
    option.selected = names.includes(option.value)
  }
  fireEvent.change(select)
}

describe('AddPokemonForm', () => {
  beforeEach(() => {
    createPokemonActionMock.mockReset()
    createPokemonActionMock.mockResolvedValue(null)
  })

  it('renders the name, type, ability and stat fields', () => {
    renderForm()

    expect(screen.getByLabelText(/Name/)).toBeInTheDocument()
    expect(screen.getByRole('checkbox', { name: 'water' })).toBeInTheDocument()
    expect(screen.getByLabelText('Abilities')).toBeInTheDocument()
    expect(screen.getByLabelText('Height (m)')).toBeInTheDocument()
    expect(screen.getByLabelText('Weight (kg)')).toBeInTheDocument()
    expect(screen.getByLabelText('Base experience')).toBeInTheDocument()
    expect(screen.getByLabelText('HP')).toBeInTheDocument()
    expect(screen.getByLabelText('Speed')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Add Pokemon/ })).toBeInTheDocument()
  })

  it('lets the user pick at most two types', () => {
    renderForm()

    fireEvent.click(screen.getByRole('checkbox', { name: 'water' }))
    fireEvent.click(screen.getByRole('checkbox', { name: 'fire' }))

    expect(screen.getByRole('checkbox', { name: 'grass' })).toBeDisabled()
  })

  it('lists the ability names as multi-select options', () => {
    renderForm()

    expect(abilitySelect()).toHaveAttribute('multiple')
    expect(Array.from(abilitySelect().options, (option) => option.value)).toEqual(ABILITY_NAMES)
    expect(screen.getByRole('option', { name: 'Lightning Rod' })).toBeInTheDocument()
  })

  it('offers only the picked abilities to mark as hidden', () => {
    renderForm()

    expect(screen.queryByLabelText('Hidden abilities')).not.toBeInTheDocument()

    pick(abilitySelect(), 'static', 'levitate')

    const hidden = screen.getByLabelText('Hidden abilities') as HTMLSelectElement
    expect(Array.from(hidden.options, (option) => option.value)).toEqual(['static', 'levitate'])
  })

  it('drops an ability from the hidden list when it is unpicked', () => {
    renderForm()

    pick(abilitySelect(), 'static')
    pick(screen.getByLabelText('Hidden abilities') as HTMLSelectElement, 'static')

    pick(abilitySelect())

    expect(screen.queryByLabelText('Hidden abilities')).not.toBeInTheDocument()
  })

  it('explains when the ability list is unavailable', () => {
    renderForm([])

    expect(screen.getByText(/unavailable right now/i)).toBeInTheDocument()
    expect(abilitySelect()).toBeDisabled()
  })

  it('surfaces a duplicate-name error returned by the Server Action', async () => {
    createPokemonActionMock.mockResolvedValue({
      ok: false,
      error: {
        code: 'duplicate',
        message: 'Pokemon "pikablu" already exists',
        fieldErrors: { name: 'That name is already taken' },
      },
    })

    renderForm()

    fireEvent.change(screen.getByLabelText(/Name/), { target: { value: 'pikablu' } })
    fireEvent.click(screen.getByRole('button', { name: /Add Pokemon/ }))

    expect(await screen.findByText('Pokemon "pikablu" already exists')).toBeInTheDocument()
    expect(screen.getByText('That name is already taken')).toBeInTheDocument()
  })

  it('keeps what the user entered when validation fails', async () => {
    createPokemonActionMock.mockResolvedValue({
      ok: false,
      error: {
        code: 'validation',
        message: 'Please fix the highlighted fields',
        fieldErrors: { name: 'Name is required' },
      },
    })

    renderForm()

    fireEvent.click(screen.getByRole('checkbox', { name: 'water' }))
    pick(abilitySelect(), 'static')
    fireEvent.change(screen.getByLabelText('Height (m)'), { target: { value: '0.7' } })
    fireEvent.change(screen.getByLabelText('Weight (kg)'), { target: { value: '6.9' } })
    fireEvent.change(screen.getByLabelText('Base experience'), { target: { value: '64' } })

    fireEvent.click(screen.getByRole('button', { name: /Add Pokemon/ }))

    expect(await screen.findByText('Please fix the highlighted fields')).toBeInTheDocument()
    expect(screen.getByRole('checkbox', { name: 'water' })).toBeChecked()
    expect(screen.getByLabelText('Height (m)')).toHaveValue(0.7)
    expect(screen.getByLabelText('Weight (kg)')).toHaveValue(6.9)
    expect(screen.getByLabelText('Base experience')).toHaveValue(64)
    expect(abilitySelect()).toHaveValue(['static'])
  })
})
