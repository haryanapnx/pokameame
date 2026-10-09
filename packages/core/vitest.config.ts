import { nodeConfig } from '@poke/vitest-config/node'
import { reactConfig } from '@poke/vitest-config/react'
import { defineConfig } from 'vitest/config'

const node = nodeConfig()
const react = reactConfig()

export default defineConfig({
  test: {
    projects: [
      {
        ...node,
        test: {
          ...node.test,
          name: 'core-node',
          include: ['src/**/*.test.ts'],
          exclude: ['src/hooks/**', 'src/queries/**'],
        },
      },
      {
        ...react,
        test: {
          ...react.test,
          name: 'core-client',
          include: ['src/hooks/**/*.test.tsx', 'src/queries/**/*.test.tsx'],
        },
      },
    ],
  },
})
