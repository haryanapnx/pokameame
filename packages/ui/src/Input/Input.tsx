import type { InputHTMLAttributes } from 'react'

import { cn } from '../cn'

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  /** Renders the invalid styling and sets `aria-invalid`. */
  invalid?: boolean
}

export function Input({ invalid, className, ...props }: InputProps) {
  return (
    <input
      aria-invalid={invalid || undefined}
      className={cn(
        'h-10 w-full rounded-control border border-border-subtle bg-surface px-3 text-sm text-content placeholder:text-content-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 disabled:cursor-not-allowed disabled:opacity-50',
        invalid && 'border-danger focus-visible:outline-danger',
        className,
      )}
      {...props}
    />
  )
}
