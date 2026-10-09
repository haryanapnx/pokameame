import { normalizeConnectionString, resolveConnectionString } from './connection'

describe('normalizeConnectionString', () => {
  it('pins the weaker libpq aliases to verify-full', () => {
    expect(normalizeConnectionString('postgres://u:p@h/db?sslmode=require')).toBe(
      'postgres://u:p@h/db?sslmode=verify-full',
    )
    expect(normalizeConnectionString('postgres://u:p@h/db?sslmode=prefer')).toContain(
      'sslmode=verify-full',
    )
    expect(normalizeConnectionString('postgres://u:p@h/db?sslmode=verify-ca')).toContain(
      'sslmode=verify-full',
    )
  })

  it('keeps other query parameters untouched', () => {
    expect(
      normalizeConnectionString('postgres://u:p@h/db?sslmode=require&channel_binding=require'),
    ).toBe('postgres://u:p@h/db?sslmode=verify-full&channel_binding=require')
  })

  it('handles sslmode as the last parameter', () => {
    expect(
      normalizeConnectionString('postgres://u:p@h/db?application_name=x&sslmode=require'),
    ).toBe('postgres://u:p@h/db?application_name=x&sslmode=verify-full')
  })

  it('leaves explicit and non-TLS modes alone', () => {
    expect(normalizeConnectionString('postgres://u:p@h/db?sslmode=verify-full')).toBe(
      'postgres://u:p@h/db?sslmode=verify-full',
    )
    expect(normalizeConnectionString('postgres://u:p@h/db?sslmode=disable')).toBe(
      'postgres://u:p@h/db?sslmode=disable',
    )
    expect(normalizeConnectionString('postgres://u:p@h/db')).toBe('postgres://u:p@h/db')
  })
})

describe('resolveConnectionString', () => {
  it('prefers an explicit value and normalises it', () => {
    expect(resolveConnectionString('postgres://u:p@h/db?sslmode=require', {})).toBe(
      'postgres://u:p@h/db?sslmode=verify-full',
    )
  })

  it('falls back to DATABASE_URL', () => {
    expect(
      resolveConnectionString(undefined, { DATABASE_URL: 'postgres://u:p@h/db?sslmode=require' }),
    ).toBe('postgres://u:p@h/db?sslmode=verify-full')
  })

  it('fails loudly when nothing is configured', () => {
    expect(() => resolveConnectionString(undefined, {})).toThrow(/DATABASE_URL is not set/)
  })
})
