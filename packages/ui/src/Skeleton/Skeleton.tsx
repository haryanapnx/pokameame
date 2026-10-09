import type { HTMLAttributes } from 'react'

import { cn } from '../cn'

export type SkeletonProps = HTMLAttributes<HTMLDivElement>

/** Layout-stable loading placeholder. Hidden from assistive technology. */
export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={cn('animate-pulse rounded-control bg-slate-200', className)}
      {...props}
    />
  )
}
