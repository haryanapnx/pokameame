'use client'

import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'

import { cn } from '../cn'

export type TabItem = {
  id: string
  label: string
  content: ReactNode
}

export type TabsProps = {
  items: TabItem[]
  defaultTabId?: string
  className?: string
}

export function Tabs({ items, defaultTabId, className }: TabsProps) {
  const baseId = useId()
  const [activeId, setActiveId] = useState(defaultTabId ?? items[0]?.id ?? '')
  const buttons = useRef<Record<string, HTMLButtonElement | null>>({})

  const activeIndex = items.findIndex((item) => item.id === activeId)
  const active = items.find((item) => item.id === activeId)

  const moveTo = (index: number) => {
    const item = items[index]
    if (!item) return
    setActiveId(item.id)
    buttons.current[item.id]?.focus()
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (activeIndex < 0) return
    switch (event.key) {
      case 'ArrowRight':
        event.preventDefault()
        moveTo((activeIndex + 1) % items.length)
        break
      case 'ArrowLeft':
        event.preventDefault()
        moveTo((activeIndex - 1 + items.length) % items.length)
        break
      case 'Home':
        event.preventDefault()
        moveTo(0)
        break
      case 'End':
        event.preventDefault()
        moveTo(items.length - 1)
        break
      default:
        break
    }
  }

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      <div
        role="tablist"
        className="flex gap-1 border-b border-border-subtle"
        onKeyDown={handleKeyDown}
      >
        {items.map((item) => {
          const selected = item.id === activeId
          return (
            <button
              key={item.id}
              ref={(element) => {
                buttons.current[item.id] = element
              }}
              id={`${baseId}-tab-${item.id}`}
              role="tab"
              type="button"
              aria-selected={selected}
              aria-controls={`${baseId}-panel-${item.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActiveId(item.id)}
              className={cn(
                '-mb-px border-b-2 px-3 py-2 text-sm font-medium transition',
                selected
                  ? 'border-brand-600 text-brand-700'
                  : 'border-transparent text-content-muted hover:text-content',
              )}
            >
              {item.label}
            </button>
          )
        })}
      </div>
      {active ? (
        <div
          id={`${baseId}-panel-${active.id}`}
          role="tabpanel"
          aria-labelledby={`${baseId}-tab-${active.id}`}
        >
          {active.content}
        </div>
      ) : null}
    </div>
  )
}
