'use client'

import { useState, type ReactNode } from 'react'

import { cn } from '../cn'
import { IconButton } from '../IconButton/IconButton'

export type MobileMenuProps = {
  children: ReactNode
  label?: string
  panelId?: string
  className?: string
  /** Extra classes for the disclosure panel — e.g. to make it a full-width overlay. */
  panelClassName?: string
  /** Controlled open state; omit to let the menu manage its own. */
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function MobileMenu({
  children,
  label = 'Menu',
  panelId = 'poke-mobile-menu',
  className,
  panelClassName,
  open: controlledOpen,
  onOpenChange,
}: MobileMenuProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false)
  const open = controlledOpen ?? uncontrolledOpen

  const toggle = () => {
    const next = !open
    if (controlledOpen === undefined) setUncontrolledOpen(next)
    onOpenChange?.(next)
  }

  return (
    <div className={cn('md:hidden', className)}>
      <IconButton aria-label={label} aria-expanded={open} aria-controls={panelId} onClick={toggle}>
        <span aria-hidden="true">≡</span>
      </IconButton>
      <div
        id={panelId}
        hidden={!open}
        className={cn('border-t border-border-subtle bg-surface p-4', panelClassName)}
      >
        {children}
      </div>
    </div>
  )
}
