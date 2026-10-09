'use client'

import { useEffect, useState } from 'react'

import { cn } from '../cn'
import { Spinner } from '../Spinner/Spinner'

export type RouteLoadingIndicatorProps = {
  /** Shown next to the spinner and announced to screen readers. */
  label?: string
  className?: string
}

/** Stops the overlay from sticking if a click never turns into a navigation. */
const SAFETY_TIMEOUT_MS = 15_000

/**
 * Cross-zone destinations must be plain anchors, so moving between the shell and a zone is a full page load: the
 * browser keeps the old page on screen until the next response starts streaming. This island fills that gap with a
 * spinner.
 *
 * It deliberately ignores clicks the router already handled — `next/link` calls `preventDefault()`, and those
 * navigations have their own `loading.tsx` skeletons — so the overlay only appears for real document loads
 * (the header nav, the home page CTAs, the mobile menu).
 */
export function RouteLoadingIndicator({
  label = 'Memuat halaman…',
  className,
}: RouteLoadingIndicatorProps) {
  const [pending, setPending] = useState(false)

  useEffect(() => {
    if (!pending) return

    const timer = setTimeout(() => setPending(false), SAFETY_TIMEOUT_MS)
    return () => clearTimeout(timer)
  }, [pending])

  useEffect(() => {
    function onClick(event: MouseEvent) {
      if (event.defaultPrevented || event.button !== 0) return
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return

      const anchor = event.target instanceof Element ? event.target.closest('a') : null
      if (!anchor) return
      if (anchor.target && anchor.target !== '_self') return
      if (anchor.hasAttribute('download')) return

      const url = new URL(anchor.href, window.location.href)
      if (url.origin !== window.location.origin) return
      if (url.pathname === window.location.pathname && url.search === window.location.search) return

      setPending(true)
    }

    function reset() {
      setPending(false)
    }

    document.addEventListener('click', onClick)
    // Coming back through the bfcache must not leave the overlay behind.
    window.addEventListener('pageshow', reset)

    return () => {
      document.removeEventListener('click', onClick)
      window.removeEventListener('pageshow', reset)
    }
  }, [])

  if (!pending) return null

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-start justify-center bg-surface/60 pt-24 backdrop-blur-sm',
        className,
      )}
    >
      <span className="inline-flex items-center gap-3 rounded-card border border-border-subtle bg-surface px-4 py-3 text-sm font-medium text-content shadow-md">
        <Spinner label={label} />
        {label}
      </span>
    </div>
  )
}
