import { join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import fs from 'fs-extra'
import fg from 'fast-glob'
import type { PackageIndexes, VueUseFunction, VueUsePackage } from '..'
import { packages } from '../packages'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

export const DOCS_URL = 'https://vueuse.org'
export const DIR_PACKAGE = resolve(__dirname, '..')
export const DIR_ROOT = resolve(__dirname, '../../..')
export const DIR_SRC = resolve(DIR_ROOT, 'packages')
export const DIR_TYPES = resolve(DIR_ROOT, 'types/packages')

interface ListFunctionsOptions {
  ignore?: string[]
  onlyDirectories?: boolean
}

export async function listFunctions(dir: string, options: ListFunctionsOptions = { }) {
  const { ignore = [], onlyDirectories = true } = options
  const files = await fg('*', {
    onlyDirectories,
    cwd: dir,
    ignore: [
      '_*',
      'dist',
      '**/test/**',
      'node_modules',
      '**/index.ts',
      ...ignore,
    ],
  })
  files.sort()
  return files
}

export async function readMetadata() {
  const indexes: PackageIndexes = {
    packages: {},
    categories: [],
    functions: [],
  }

  for (const info of packages) {
    if (info.utils)
      continue

    const dir = join(DIR_SRC, info.name)
    const functions = await listFunctions(dir, { onlyDirectories: info.onlyDirectories })

    const pkg: VueUsePackage = {
      ...info,
      dir: relative(DIR_ROOT, dir).replace(/\\/g, '/'),
      // docs: info.addon ? `${DOCS_URL}/${info.name}/README.html` : undefined,
    }

    indexes.packages[info.name] = pkg

    await Promise.all(functions.map(async (fnName) => {
      const mdPath = join(dir, fnName, 'index.md')
      const hasDoc = fs.existsSync(join(dir, fnName, 'doc'))

      const fn: VueUseFunction = {
        name: fnName,
        package: pkg.name,
      }

      // TODO 修改规则
      if (!fs.existsSync(mdPath) && !hasDoc)
        fn.internal = true
        // indexes.functions.push(fn)

      indexes.functions.push(fn)
    }))
  }
  indexes.functions.sort((a, b) => a.name.localeCompare(b.name))

  return indexes
}

const indexes = await readMetadata()
await fs.writeJSON(join(DIR_PACKAGE, 'index.json'), indexes, { spaces: 2 })
