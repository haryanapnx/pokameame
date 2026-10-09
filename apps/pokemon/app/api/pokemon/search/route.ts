import { NextResponse } from 'next/server'

import { searchPokemonNames } from '@poke/core/services'

const DEFAULT_LIMIT = 8
const MAX_LIMIT = 20

function parseLimit(value: string | null): number {
  const parsed = Number.parseInt(value ?? '', 10)
  if (!Number.isFinite(parsed)) return DEFAULT_LIMIT
  return Math.min(Math.max(parsed, 1), MAX_LIMIT)
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)

  const suggestions = await searchPokemonNames(
    searchParams.get('q') ?? '',
    parseLimit(searchParams.get('limit')),
  )

  return NextResponse.json(suggestions)
}
