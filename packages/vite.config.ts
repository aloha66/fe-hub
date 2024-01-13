import mkcert from 'vite-plugin-mkcert'
import { defineConfig } from 'vite'
import UnoCSS from 'unocss/vite'
import { MarkdownTransform } from './.vitepress/plugins/markdownTransform'

export default defineConfig({
  // server: {
  //   headers: {
  //     'Cache-Control': 'public,max-age=31536000,immutable'
  //   },
  // },
  plugins: [
    mkcert(),
    UnoCSS(),
    MarkdownTransform(),
  ],

})
