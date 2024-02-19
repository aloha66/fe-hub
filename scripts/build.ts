import pico from 'picocolors'
import { getRunIfNotDry } from './utils'

const runIfNotDry = getRunIfNotDry()

const watch = process.argv.includes('--watch')

export async function build() {
  await runIfNotDry('pnpm run clean')

  await runIfNotDry(`pnpm run build:rollup${watch ? ' --watch' : ''}`)

  console.log(pico.bgGreen(`${pico.white('✓')} [build] successful.\n`))
}
