import esbuild from 'rollup-plugin-esbuild'
import dts from 'rollup-plugin-dts'
import json from '@rollup/plugin-json'
import { PluginPure as pure } from 'rollup-plugin-pure'
import type { OutputOptions, RollupOptions } from 'rollup'
import { packages } from './packages/metadata/packages'

// packages/vue-composables/useDraggable/index.ts(4,10): error TS2305: Module '"vue"' has no exported member 'onMounted'.
// https://github.com/Swatinem/rollup-plugin-dts/issues/143#issuecomment-1098692883
const pluginDts = dts({
  compilerOptions: {
    preserveSymlinks: false,
  },
})
const pluginPure = pure({
  functions: ['defineComponent'],
})

const configs: RollupOptions[] = []

const externals = [
  '@fe-hub/shared',
  '@fe-hub/core',
  '@fe-hub/metadata',
]

// const args = minimist(process.argv.slice(2))

// const isDryRun = args.dryrun
// async function run(bin,  args, opts = {}) {
//   return execa(bin, args, { stdio: 'inherit', ...opts })
// }
// async function dryRun(bin, /** @type {ReadonlyArray<string>} */ args, /** @type {import('execa').Options} */ opts = {}) {
//   return console.log(pico.blue(`[dryrun] ${bin} ${args.join(' ')}`), opts)
// }
// const runIfNotDry = isDryRun ? dryRun : run

for (const { name, external } of packages) {
  const functionNames = ['index']

  for (const fn of functionNames) {
    // 处理子文件 暂时用不上
    const input = fn === 'index'
      ? `packages/${name}/index.ts`
      : `packages/${name}/${fn}/index.ts`

    const output: OutputOptions[] = []

    output.push({
      file: `packages/${name}/dist/${fn}.mjs`,
      format: 'es',
    })

    configs.push({
      input,
      output,
      plugins: [
        esbuild({ target: 'es2018' }),
        json(),
        pluginPure,
      ],
      external: [
        ...externals,
        ...(external || []),
      ],
    })

    configs.push({
      input,
      output: [
        { file: `packages/${name}/dist/${fn}.d.cts` },
        { file: `packages/${name}/dist/${fn}.d.mts` },
        { file: `packages/${name}/dist/${fn}.d.ts` }, // for node10 compatibility
      ],
      plugins: [
        pluginDts,
      ],
      external: [
        ...externals,
        ...(external || []),
      ],
    })
  }
}

export default configs
