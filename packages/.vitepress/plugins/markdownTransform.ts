import { join, resolve } from 'node:path'
import type { Plugin } from 'vite'
import fs from 'fs-extra'
import { functionNames } from '../../metadata'

export function MarkdownTransform(): Plugin {
  return {
    name: 'md-transform',
    enforce: 'pre',
    /**
     * 运行时代码,打开某个页面才执行
     * @param code
     * @param id
     * @returns
     */
    async transform(code, id) {
      if (!id.match(/\.md\b/))
        return null

      const [pkg, _name, i] = id.split('/').slice(-3)

      const name = functionNames.find(n => n.toLowerCase() === _name.toLowerCase()) || _name

      if (functionNames.includes(name) && i === 'index.md') {
        const frontmatterEnds = code.indexOf('---\n\n')
        const firstHeader = code.search(/\n#{2,6}\s.+/)
        const sliceIndex = firstHeader < 0 ? frontmatterEnds < 0 ? 0 : frontmatterEnds + 4 : firstHeader
        const { header } = await getFunctionMarkdown(pkg, name)
        code = code.slice(0, sliceIndex) + header + code.slice(sliceIndex)

        return code
      }
    },
  }
}

const DIR_SRC = resolve(__dirname, '../..')

export async function getFunctionMarkdown(pkg: string, name: string) {
  const dirname = join(DIR_SRC, pkg, name)
  const demoPath = ['demo.vue', 'demo.client.vue'].find(i => fs.existsSync(join(dirname, i)))

  const demoSection = `
  <script setup>
  import { defineAsyncComponent } from 'vue'
  const Demo = defineAsyncComponent(() => import('./${demoPath}'))
  </script>
  
  ## Demo
  
  <div>
  <ClientOnly>
    <Suspense>
      <Demo/>
      <template #fallback>
        Loading demo...
      </template>
    </Suspense>
  </ClientOnly>
  </div>
  
  `

  return {
    header: demoSection,
  }
}
