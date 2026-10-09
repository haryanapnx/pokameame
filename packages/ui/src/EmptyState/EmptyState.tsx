import type { ReactNode } from 'react'

import { cn } from '../cn'

export type EmptyStateProps = {
  title: string
  description?: string
  action?: ReactNode
  className?: string
}

export function EmptyState({ title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center gap-2 rounded-card border border-dashed border-border-subtle bg-surface-muted px-6 py-12 text-center',
        className,
      )}
    >
      <p className="text-sm font-medium text-content">{title}</p>
      {description ? <p className="text-xs text-content-muted">{description}</p> : null}
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  )
}
