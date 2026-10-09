import type { HTMLAttributes } from 'react'

import { cn } from '../cn'

export type GridColumns = 1 | 2 | 3 | 4

const columnClasses: Record<GridColumns, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4',
}

export type GridProps = HTMLAttributes<HTMLDivElement> & {
  columns?: GridColumns
}

export function Grid({ columns = 3, className, ...props }: GridProps) {
  return <div className={cn('grid gap-4', columnClasses[columns], className)} {...props} />
}
