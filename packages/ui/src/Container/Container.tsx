import type { HTMLAttributes } from 'react'

import { cn } from '../cn'

export type ContainerSize = 'sm' | 'md' | 'lg' | 'full'

const sizeClasses: Record<ContainerSize, string> = {
  sm: 'max-w-3xl',
  md: 'max-w-5xl',
  lg: 'max-w-7xl',
  full: 'max-w-none',
}

export type ContainerProps = HTMLAttributes<HTMLDivElement> & {
  size?: ContainerSize
}

export function Container({ size = 'lg', className, ...props }: ContainerProps) {
  return (
    <div
      className={cn('mx-auto w-full px-4 sm:px-6 lg:px-8', sizeClasses[size], className)}
      {...props}
    />
  )
}
