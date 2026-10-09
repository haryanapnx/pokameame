import { fileURLToPath } from 'node:url'

import react from '@vitejs/plugin-react'

import { baseResolveConfig, baseTestConfig } from './base.js'

const setupFile = fileURLToPath(new URL('./setup.js', import.meta.url))

export function reactConfig(overrides = {}) {
  return {
    plugins: [react()],
    resolve: { ...baseResolveConfig },
    test: {
      ...baseTestConfig,
      environment: 'jsdom',
      setupFiles: [setupFile],
      ...overrides,
    },
  }
}
