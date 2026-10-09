import { render, screen } from '@testing-library/react'

import HomePage from './page'

type ForwardedImageProps = {
  src: unknown
  alt: string
  sizes?: string
  priority?: boolean
  fill?: boolean
  className?: string
}

const { forwarded } = vi.hoisted(() => ({ forwarded: vi.fn() }))

vi.mock('next/image', () => ({
  default: (props: ForwardedImageProps) => {
    forwarded(props)
    return null
  },
}))

function forwardedImages(): ForwardedImageProps[] {
  return forwarded.mock.calls.map(([props]) => props as ForwardedImageProps)
}

describe('HomePage', () => {
  beforeEach(() => {
    forwarded.mockClear()
  })

  it('introduces the explorer with hero copy', () => {
    render(<HomePage />)

    expect(
      screen.getByRole('heading', { level: 1, name: 'Explore the Pokemon universe' }),
    ).toBeInTheDocument()
    expect(screen.getByText('Pokemon Explorer')).toBeInTheDocument()
  })

  it('renders both library cards with a CTA into their zone', () => {
    render(<HomePage />)

    expect(screen.getByRole('heading', { level: 2, name: 'Pokemon Library' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: 'Berries Library' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /^Explore Pokemon/ })).toHaveAttribute(
      'href',
      '/pokemon',
    )
    expect(screen.getByRole('link', { name: /^Browse Berries/ })).toHaveAttribute(
      'href',
      '/berries',
    )
  })

  it('uses the hero artwork as an eager, cover-filled background', () => {
    render(<HomePage />)

    const hero = forwardedImages().find((image) => image.alt === 'Hero')

    expect(hero).toMatchObject({ fill: true, priority: true })
    expect(hero?.className).toContain('object-cover')
  })

  it('renders the library thumbnails full-width on mobile and square from sm up', () => {
    render(<HomePage />)

    const thumbnails = forwardedImages().filter((image) => image.alt === '')

    expect(thumbnails).toHaveLength(2)
    for (const thumbnail of thumbnails) {
      expect(thumbnail.sizes).toBe('(min-width: 640px) 128px, 100vw')
      expect(thumbnail.className).toContain('aspect-video')
      expect(thumbnail.className).toContain('w-full')
      expect(thumbnail.className).toContain('object-cover')
      expect(thumbnail.className).toContain('sm:size-32')
    }
  })
})
