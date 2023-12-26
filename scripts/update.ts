import { metadata } from '../packages/metadata/metadata'
import { updateImport } from './utils'

await Promise.all([
  updateImport(metadata),
])

export { }
