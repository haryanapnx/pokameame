import { cn } from '../cn'

export type StatBarProps = {
  label: string
  value: number
  /** Upper bound of the scale; defaults to Pokemon's max base stat (255). */
  max?: number
  className?: string
}

export function StatBar({ label, value, max = 255, className }: StatBarProps) {
  const clamped = Math.max(0, Math.min(value, max))
  const percent = max > 0 ? Math.round((clamped / max) * 100) : 0

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <span className="w-20 shrink-0 text-xs uppercase text-content-muted">{label}</span>
      <span className="w-10 shrink-0 text-right text-xs font-semibold tabular-nums text-content">
        {value}
      </span>
      <span
        role="progressbar"
        aria-label={label}
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={max}
        className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200"
      >
        <span className="block h-full rounded-full bg-brand-500" style={{ width: `${percent}%` }} />
      </span>
    </div>
  )
}
