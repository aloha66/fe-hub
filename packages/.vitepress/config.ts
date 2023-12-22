import { defineConfig } from 'vitepress'
import mkcert from 'vite-plugin-mkcert'

export default defineConfig({
  // ...
  vite: {
    plugins: [
      mkcert(),
    ],
  },
})
