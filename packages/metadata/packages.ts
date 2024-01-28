import type { PackageManifest } from './types'

export const packages: PackageManifest[] = [
  {
    name: 'metadata',
    display: 'Metadata for VueUse functions',
    manualImport: true,
    utils: true,
  },
  {
    name: 'shared',
    display: 'Shared utilities',
    utils: true,
  },
  {
    name: 'core',
    display: 'VueUse',
    description: 'Collection of essential Vue Composition Utilities',
  },
  {
    name: 'vue-composables',
    display: 'vue-composables',
    description: 'vue composables',

  },
  {
    name: 'vue-components',
    display: 'vue-components',
    description: 'vue-components',

  },
  {
    name: 'react-hooks',
    display: 'react-hooks',
    description: 'react-hooks',

  },
]
