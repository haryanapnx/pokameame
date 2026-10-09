import type { TextareaHTMLAttributes } from 'react'

import { cn } from '../cn'

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  /** Renders the invalid styling and sets `aria-invalid`. */
  invalid?: boolean
}

export function Textarea({ invalid, rows = 4, className, ...props }: TextareaProps) {
  return (
    <textarea
      rows={rows}
      aria-invalid={invalid || undefined}
      className={cn(
        'w-full rounded-control border border-border-subtle bg-surface px-3 py-2 text-sm text-content placeholder:text-content-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 disabled:cursor-not-allowed disabled:opacity-50',
        invalid && 'border-danger focus-visible:outline-danger',
        className,
      )}
      {...props}
    />
  )
}
