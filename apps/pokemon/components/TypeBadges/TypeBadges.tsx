import { TypeBadge, cn } from '@poke/ui'

export type TypeBadgesProps = {
  types: string[]
  className?: string
}

export function TypeBadges({ types, className }: TypeBadgesProps) {
  return (
    <div className={cn('flex flex-wrap gap-1', className)}>
      {types.map((type) => (
        <TypeBadge key={type} type={type} />
      ))}
    </div>
  )
}
