import type { HTMLAttributes } from 'react'

import { cn } from '../cn'

export type BadgeTone = 'neutral' | 'brand' | 'success' | 'danger'

const toneClasses: Record<BadgeTone, string> = {
  neutral: 'bg-slate-100 text-content-muted',
  brand: 'bg-brand-100 text-brand-800',
  success: 'bg-green-100 text-green-800',
  danger: 'bg-red-100 text-red-800',
}

export type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: BadgeTone
}

export function Badge({ tone = 'neutral', className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-2xs font-semibold',
        toneClasses[tone],
        className,
      )}
      {...props}
    />
  )
}
