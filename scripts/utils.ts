import { join } from 'node:path'
import fs from 'fs-extra'
import type { PackageIndexes } from '../packages/metadata/types'

export async function updateImport({ packages, functions }: PackageIndexes) {
  for (const { name, dir, manualImport } of Object.values(packages)) {
    if (manualImport)
      continue

    const imports = functions.filter(i => i.package === name)
      .map(f => f.name)
      .sort()
      .map(name => `export * from './${name}'`)

    await fs.writeFile(join(dir, 'index.ts'), `${imports.join('\n')}\n`)
  }
}
