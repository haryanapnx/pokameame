import { baseResolveConfig, baseTestConfig } from './base.js'

export function nodeConfig(overrides = {}) {
  return {
    resolve: { ...baseResolveConfig },
    test: { ...baseTestConfig, environment: 'node', ...overrides },
  }
}
