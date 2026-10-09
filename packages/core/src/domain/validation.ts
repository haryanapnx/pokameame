export type ValidationIssue = {
  field: string
  message: string
}

export type ValidationResult<T> = { ok: true; value: T } | { ok: false; issues: ValidationIssue[] }

export const NAME_MAX_LENGTH = 50

/** Letters, digits and single hyphens — keeps names URL-safe for /[name] routes. */
export const ENTITY_NAME_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

/** Trims, lowercases and converts whitespace to hyphens. */
export function normalizeEntityName(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, '-')
}

export function readName(value: unknown, issues: ValidationIssue[], field = 'name'): string {
  if (typeof value !== 'string' || value.trim() === '') {
    issues.push({ field, message: 'Name is required' })
    return ''
  }

  const normalized = normalizeEntityName(value)

  if (normalized.length > NAME_MAX_LENGTH) {
    issues.push({ field, message: `Name must be at most ${NAME_MAX_LENGTH} characters` })
    return normalized
  }

  if (!ENTITY_NAME_PATTERN.test(normalized)) {
    issues.push({ field, message: 'Use lowercase letters, numbers and hyphens only' })
  }

  return normalized
}

export function readString(
  value: unknown,
  issues: ValidationIssue[],
  field: string,
  label: string,
): string {
  if (typeof value !== 'string' || value.trim() === '') {
    issues.push({ field, message: `${label} is required` })
    return ''
  }

  return value.trim()
}

export type NumberRules = {
  min?: number
  max?: number
  integer?: boolean
}

export function readNumber(
  value: unknown,
  issues: ValidationIssue[],
  field: string,
  label: string,
  rules: NumberRules = {},
): number {
  const parsed =
    typeof value === 'number'
      ? value
      : typeof value === 'string' && value.trim() !== ''
        ? Number(value)
        : Number.NaN

  if (!Number.isFinite(parsed)) {
    issues.push({ field, message: `${label} must be a number` })
    return 0
  }

  if (rules.integer && !Number.isInteger(parsed)) {
    issues.push({ field, message: `${label} must be a whole number` })
  }

  if (rules.min !== undefined && parsed < rules.min) {
    issues.push({ field, message: `${label} must be at least ${rules.min}` })
  }

  if (rules.max !== undefined && parsed > rules.max) {
    issues.push({ field, message: `${label} must be at most ${rules.max}` })
  }

  return parsed
}

export function readOptionalNumber(
  value: unknown,
  issues: ValidationIssue[],
  field: string,
  label: string,
  rules: NumberRules = {},
): number | undefined {
  if (value === undefined || value === null || value === '') return undefined
  return readNumber(value, issues, field, label, rules)
}

export function readOptionalString(
  value: unknown,
  issues: ValidationIssue[],
  field: string,
  label: string,
): string | undefined {
  if (value === undefined || value === null || value === '') return undefined
  if (typeof value !== 'string') {
    issues.push({ field, message: `${label} must be text` })
    return undefined
  }
  return value.trim()
}

export function slugify(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, '-')
}
