import { defineConfig } from 'vitest/config'

export default defineConfig({

  test: {
    environment: 'happy-dom',
    coverage: {
      include: ['packages/core/**/*.ts', 'packages/shared/**/*.ts', 'packages/vue-composables/**/*.ts'],
      exclude: ['packages/**/type.ts', 'packages/**/ignore'],
    },
  },

})
