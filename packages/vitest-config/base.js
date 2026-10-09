import { fileURLToPath } from 'node:url'

// Vitest normally sets NODE_ENV=test, but if the shell exports NODE_ENV=production
// it is left untouched — React then loads its production build, which omits `act`,
// breaking Testing Library. Force the correct test environment here, before workers spawn.
process.env.NODE_ENV = 'test'

const serverOnlyStub = fileURLToPath(new URL('./empty.js', import.meta.url))

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

/**
 * `server-only` throws when imported outside a React Server environment; tests run in
 * plain Node, so alias it to an empty module. The guard still applies in Next builds.
 */
export const baseResolveConfig = {
  alias: { 'server-only': serverOnlyStub },
}

export function baseConfig(overrides = {}) {
  return { resolve: { ...baseResolveConfig }, test: { ...baseTestConfig, ...overrides } }
}
