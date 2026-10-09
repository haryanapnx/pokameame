import { PokeApiParseError } from '../errors'
import { isRecord } from './validation'

export { isRecord }

export function fail(what: string): never {
  throw new PokeApiParseError(`Unexpected PokeAPI payload at ${what}`)
}

export function asString(value: unknown, what: string): string {
  if (typeof value !== 'string') fail(what)
  return value
}

export function asNumber(value: unknown, what: string): number {
  if (typeof value !== 'number' || Number.isNaN(value)) fail(what)
  return value
}

export function asArray(value: unknown, what: string): unknown[] {
  if (!Array.isArray(value)) fail(what)
  return value
}

export function asNullableString(value: unknown): string | null {
  return typeof value === 'string' ? value : null
}
