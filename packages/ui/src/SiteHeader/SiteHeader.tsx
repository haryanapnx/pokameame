import { cn } from '../cn'
import { Container } from '../Container/Container'
import { MobileMenu } from '../MobileMenu/MobileMenu'

const LINKS = [
  { href: '/', label: 'Home' },
  { href: '/pokemon', label: 'Pokemon' },
  { href: '/berries', label: 'Berries' },
] as const

export type SiteHeaderProps = {
  /** `href` of the section this page belongs to, so it can be highlighted. */
  activeHref?: string
  className?: string
}

function linkClasses(isActive: boolean, fullWidth: boolean): string {
  return cn(
    'inline-flex items-center rounded-control px-3 text-sm font-medium transition',
    fullWidth ? 'h-10 w-full' : 'h-9',
    isActive
      ? 'bg-brand-100 text-brand-800'
      : 'text-content-muted hover:bg-surface-muted hover:text-content',
  )
}

/**
 * Shared site header used by the shell and every zone.
 *
 * Links are plain anchors on purpose: destinations live in different zones, and `next/link`
 * cannot soft-navigate across zone boundaries. The bar itself is server-safe (no hooks); only the
 * mobile disclosure is a client island. The panel is absolutely positioned against the header so
 * it can span the full width while the trigger stays in the row.
 */
export function SiteHeader({ activeHref, className }: SiteHeaderProps) {
  return (
    <header
      className={cn(
        'sticky top-0 z-40 border-b border-border-subtle bg-surface/95 backdrop-blur',
        'relative',
        className,
      )}
    >
      <Container className="flex items-center justify-between gap-4 py-3">
        <a href="/" className="inline-flex items-center gap-2 text-sm font-semibold tracking-tight">
          <span aria-hidden="true" className="inline-block size-2.5 rounded-full bg-brand-600" />
          Pokemon Explorer
        </a>

        <nav aria-label="Sections" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {LINKS.map((link) => {
              const isActive = link.href === activeHref

              return (
                <li key={link.href}>
                  <a
                    href={link.href}
                    aria-current={isActive ? 'page' : undefined}
                    className={linkClasses(isActive, false)}
                  >
                    {link.label}
                  </a>
                </li>
              )
            })}
          </ul>
        </nav>

        <MobileMenu
          label="Open sections menu"
          panelClassName="absolute inset-x-0 top-full border-b border-border-subtle bg-surface px-4 py-3 shadow-lg sm:px-6"
        >
          <ul className="flex flex-col gap-1">
            {LINKS.map((link) => {
              const isActive = link.href === activeHref

              return (
                <li key={link.href}>
                  <a
                    href={link.href}
                    aria-current={isActive ? 'page' : undefined}
                    className={linkClasses(isActive, true)}
                  >
                    {link.label}
                  </a>
                </li>
              )
            })}
          </ul>
        </MobileMenu>
      </Container>
    </header>
  )
}
