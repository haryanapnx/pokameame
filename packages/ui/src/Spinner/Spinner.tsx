import type { HTMLAttributes } from 'react'

import { cn } from '../cn'

export type SpinnerProps = HTMLAttributes<HTMLSpanElement> & {
  /** Accessible label announced by screen readers. */
  label?: string
}

export function Spinner({ label = 'Loading', className, ...props }: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label={label}
      className={cn(
        'inline-block size-5 animate-spin rounded-full border-2 border-current border-t-transparent text-brand-600',
        className,
      )}
      {...props}
    />
  )
}
