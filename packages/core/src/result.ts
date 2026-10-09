import type { ValidationIssue } from './domain/validation'

export type CreateErrorCode = 'validation' | 'duplicate' | 'unexpected'

export type CreateError = {
  code: CreateErrorCode
  message: string
  /** Field name → message, for rendering inline form errors. */
  fieldErrors?: Record<string, string>
}

export type CreateResult<T> = { ok: true; data: T } | { ok: false; error: CreateError }

/** Collapses validation issues into one message per field (first wins). */
export function fieldErrorsFromIssues(issues: ValidationIssue[]): Record<string, string> {
  const fieldErrors: Record<string, string> = {}

  for (const issue of issues) {
    if (fieldErrors[issue.field] === undefined) fieldErrors[issue.field] = issue.message
  }

  return fieldErrors
}
