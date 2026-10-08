import { baseTestConfig } from './base.js'

export function nodeConfig(overrides = {}) {
  return { test: { ...baseTestConfig, environment: 'node', ...overrides } }
}
