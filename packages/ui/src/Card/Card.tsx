import type { HTMLAttributes } from 'react'

import { cn } from '../cn'

export type CardProps = HTMLAttributes<HTMLDivElement>

export function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-card border border-border-subtle bg-surface p-4 shadow-sm transition',
        className,
      )}
      {...props}
    />
  )
}
