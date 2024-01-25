/// <reference types="vitest" />
// 声明该文件使用 @types/vitest/index.d.ts 中声明的名称；因此，这个包需要与声明文件一起包含在编译中。
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
