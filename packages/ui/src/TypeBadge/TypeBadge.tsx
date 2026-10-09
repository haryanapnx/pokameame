import { cn } from '../cn'

const typeClasses: Record<string, string> = {
  normal: 'bg-type-normal text-slate-900',
  fire: 'bg-type-fire text-white',
  water: 'bg-type-water text-white',
  electric: 'bg-type-electric text-slate-900',
  grass: 'bg-type-grass text-slate-900',
  ice: 'bg-type-ice text-slate-900',
  fighting: 'bg-type-fighting text-white',
  poison: 'bg-type-poison text-white',
  ground: 'bg-type-ground text-slate-900',
  flying: 'bg-type-flying text-slate-900',
  psychic: 'bg-type-psychic text-white',
  bug: 'bg-type-bug text-slate-900',
  rock: 'bg-type-rock text-white',
  ghost: 'bg-type-ghost text-white',
  dragon: 'bg-type-dragon text-white',
  dark: 'bg-type-dark text-white',
  steel: 'bg-type-steel text-slate-900',
  fairy: 'bg-type-fairy text-slate-900',
}

const fallbackClass = 'bg-slate-200 text-slate-900'

/** Canonical Pokemon type names — used by type pickers as well as badges. */
export const POKEMON_TYPES: string[] = Object.keys(typeClasses)

/** Resolves a Pokemon type name to its token-based badge classes (unknown → neutral). */
export function typeBadgeClass(type: string): string {
  return typeClasses[type.toLowerCase()] ?? fallbackClass
}

export type TypeBadgeProps = {
  type: string
  className?: string
}

export function TypeBadge({ type, className }: TypeBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-2xs font-semibold uppercase tracking-wide',
        typeBadgeClass(type),
        className,
      )}
    >
      {type}
    </span>
  )
}
