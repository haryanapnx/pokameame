import type { ReactNode } from 'react'

import { cn } from '../cn'

export type ErrorStateProps = {
  title?: string
  description?: string
  action?: ReactNode
  className?: string
}

export function ErrorState({
  title = 'Something went wrong',
  description,
  action,
  className,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn(
        'flex flex-col items-center gap-2 rounded-card border border-danger/30 bg-red-50 px-6 py-12 text-center',
        className,
      )}
    >
      <p className="text-sm font-medium text-danger">{title}</p>
      {description ? <p className="text-xs text-content-muted">{description}</p> : null}
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  )
}
