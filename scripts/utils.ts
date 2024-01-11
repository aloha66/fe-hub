import { join } from 'node:path'
import fs from 'fs-extra'
import pico from 'picocolors'
import minimist from 'minimist'
import { execa } from 'execa'
import type { Options } from 'execa'
import type { PackageIndexes } from '../packages/metadata'

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

export function getRunIfNotDry() {
  const args = minimist(process.argv.slice(2))
  const isDryRun = args.dryrun

  async function run(bin: string, args: string[] = [], opts: Options = {}) {
    return execa(bin, args, { stdio: 'inherit', ...opts })
  }

  async function dryRun(bin: string, args: string[] = [], opts: Options = {}) {
    return console.log(pico.blue(`[dryrun] ${bin} ${args.join(' ')}`), opts)
  }

  return isDryRun ? dryRun : run
}
