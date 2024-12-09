import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['src/**/*.spec.ts'],
    setupFiles: 'setup-vitest.js'
  },
})
