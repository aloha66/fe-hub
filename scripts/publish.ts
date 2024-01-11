import { join } from 'node:path'
import pico from 'picocolors'
import { version } from '../package.json'
import { packages } from '../packages/metadata/packages'
import { getRunIfNotDry } from './utils'

const runIfNotDry = getRunIfNotDry()

await runIfNotDry('npm run build')

let command = 'npm publish --access public'

if (version.includes('beta'))
  command += ' --tag beta'

for (const { name } of packages) {
  await runIfNotDry(command, [], { cwd: join('packages', name, 'dist') })
  console.log(pico.bgGreen(`[Published] @fe-hub/${name}`))
}
