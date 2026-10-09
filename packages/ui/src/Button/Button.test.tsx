import { render, screen } from '@testing-library/react'

import { Button, buttonClasses } from '../Button/Button'

describe('Button', () => {
  it('renders its label with type=button by default', () => {
    render(<Button>Save</Button>)

    expect(screen.getByRole('button', { name: 'Save' })).toHaveAttribute('type', 'button')
  })

  it('applies the requested variant and size', () => {
    render(
      <Button variant="danger" size="sm">
        Delete
      </Button>,
    )

    const button = screen.getByRole('button', { name: 'Delete' })
    expect(button).toHaveClass('bg-danger')
    expect(button).toHaveClass('h-8')
  })

  it('lets a className override a conflicting variant utility', () => {
    render(
      <Button variant="primary" className="bg-red-500">
        Go
      </Button>,
    )

    const button = screen.getByRole('button', { name: 'Go' })
    expect(button).toHaveClass('bg-red-500')
    expect(button.className).not.toContain('bg-brand-600')
  })

  it('supports the disabled state', () => {
    render(<Button disabled>Wait</Button>)

    expect(screen.getByRole('button', { name: 'Wait' })).toBeDisabled()
  })
})

describe('buttonClasses', () => {
  it('defaults to the primary, medium button', () => {
    const classes = buttonClasses()

    expect(classes).toContain('bg-brand-600')
    expect(classes).toContain('h-10')
  })

  it('returns the requested variant and size', () => {
    const classes = buttonClasses({ variant: 'danger', size: 'sm' })

    expect(classes).toContain('bg-danger')
    expect(classes).toContain('h-8')
  })

  it('merges extra class names and resolves conflicts', () => {
    const classes = buttonClasses({ variant: 'primary', className: 'w-full bg-red-500' })

    expect(classes).toContain('w-full')
    expect(classes).toContain('bg-red-500')
    expect(classes).not.toContain('bg-brand-600')
  })
})
