'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

import { useDebouncedValue, useQueryParams } from '@poke/core/hooks'
import { useCatalogSearch } from '@poke/core/queries'
import { Badge, Input, Spinner } from '@poke/ui'

const MIN_QUERY_LENGTH = 2
const DEBOUNCE_MS = 300

export type PokemonSearchProps = {
  initialQuery?: string
}

/**
 * Client island: debounced input that (a) pushes `?q=` so the server-rendered list refilters and
 * (b) shows React Query suggestions straight from the zone's Route Handler.
 */
export function PokemonSearch({ initialQuery = '' }: PokemonSearchProps) {
  const [value, setValue] = useState(initialQuery)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const { setParams, isPending } = useQueryParams()

  const debounced = useDebouncedValue(value, DEBOUNCE_MS)
  const term = debounced.trim()
  const lastPushed = useRef(initialQuery.trim())

  useEffect(() => {
    if (term === lastPushed.current) return
    lastPushed.current = term
    setParams({ q: term === '' ? null : term, page: null })
  }, [term, setParams])

  const suggestions = useCatalogSearch({
    endpoint: '/api/pokemon/search',
    kind: 'pokemon',
    query: term,
    limit: 6,
    enabled: showSuggestions && term.length >= MIN_QUERY_LENGTH,
  })

  const items = suggestions.data ?? []

  return (
    <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-start">
      <div className="relative min-w-0 flex-1">
        <label htmlFor="pokemon-search" className="sr-only">
          Search Pokemon
        </label>

        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="pointer-events-none absolute left-4 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-indigo-400"
        >
          <circle cx="11" cy="11" r="6.5" />
          <path d="m16 16 4 4" />
        </svg>

        <Input
          id="pokemon-search"
          type="search"
          value={value}
          autoComplete="off"
          placeholder="Search Pokemon by name…"
          className="h-11 w-full rounded-xl border border-indigo-100 bg-white pl-11 pr-11 text-sm text-content placeholder:text-content-muted shadow-sm transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
          onChange={(event) => {
            setValue(event.target.value)
            setShowSuggestions(true)
          }}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => {
            window.setTimeout(() => setShowSuggestions(false), 120)
          }}
        />

        {isPending || suggestions.isFetching ? (
          <span className="absolute inset-y-0 right-4 flex items-center">
            <Spinner label="Searching" />
          </span>
        ) : null}

        {showSuggestions && term.length >= MIN_QUERY_LENGTH ? (
          <ul className="absolute left-0 z-20 mt-2 w-full overflow-hidden rounded-xl border border-border-subtle bg-surface p-1 shadow-xl">
            {suggestions.isLoading ? (
              <li className="px-3 py-2 text-xs text-content-muted">Searching…</li>
            ) : null}

            {suggestions.isError ? (
              <li className="px-3 py-2 text-xs text-danger">Search failed. Try again.</li>
            ) : null}

            {!suggestions.isLoading && !suggestions.isError && items.length === 0 ? (
              <li className="px-3 py-2 text-xs text-content-muted">No matches</li>
            ) : null}

            {items.map((suggestion) => (
              <li key={`${suggestion.origin}-${suggestion.name}`}>
                <Link
                  href={`/pokemon/${suggestion.name}`}
                  className="flex items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-sm capitalize transition hover:bg-indigo-50"
                >
                  <span className="truncate">{suggestion.name}</span>
                  {suggestion.origin === 'custom' ? <Badge tone="brand">Custom</Badge> : null}
                </Link>
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      <Link
        href="/pokemon/new"
        className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 text-sm font-semibold text-white shadow-[0_8px_18px_rgba(79,70,229,0.22)] transition hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-200 active:translate-y-px"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="h-4 w-4"
        >
          <path d="M12 5v14M5 12h14" />
        </svg>
        Add Pokemon
      </Link>
    </div>
  )
}
