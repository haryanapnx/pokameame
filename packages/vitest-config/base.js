// Vitest normally sets NODE_ENV=test, but if the shell exports NODE_ENV=production
// it is left untouched — React then loads its production build, which omits `act`,
// breaking Testing Library. Force the correct test environment here, before workers spawn.
process.env.NODE_ENV = 'test'

export const baseTestConfig = {
  globals: true,
  clearMocks: true,
  restoreMocks: true,
  include: [
    'src/**/*.{test,spec}.{ts,tsx}',
    'app/**/*.{test,spec}.{ts,tsx}',
    'components/**/*.{test,spec}.{ts,tsx}',
    'lib/**/*.{test,spec}.{ts,tsx}',
    'test/**/*.{test,spec}.{ts,tsx}',
  ],
  exclude: ['**/node_modules/**', '**/.next/**', '**/dist/**', '**/build/**', '**/coverage/**'],
  coverage: {
    provider: 'v8',
    reporter: ['text', 'html'],
    exclude: [
      '**/*.config.*',
      '**/*.d.ts',
      '**/.next/**',
      '**/dist/**',
      '**/*.{test,spec}.{ts,tsx}',
    ],
  },
}

export function baseConfig(overrides = {}) {
  return { test: { ...baseTestConfig, ...overrides } }
}
