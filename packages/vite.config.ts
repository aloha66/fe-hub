import mkcert from 'vite-plugin-mkcert'
import { defineConfig } from 'vite'
import { MarkdownTransform } from './.vitepress/plugins/markdownTransform'

export default defineConfig({
  plugins: [
    mkcert(),
    MarkdownTransform(),
  ],

})
