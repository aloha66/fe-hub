import mkcert from 'vite-plugin-mkcert'
import { defineConfig } from 'vite'
import { MarkdownTransform } from './.vitepress/plugins/markdownTransform'

export default defineConfig({
  // server: {
  //   headers: {
  //     'Cache-Control': 'public,max-age=31536000,immutable'
  //   },
  // },
  plugins: [
    mkcert(),
    MarkdownTransform(),
  ],

})
