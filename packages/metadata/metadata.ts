import _metadata, { functions as _functions } from './index.json'
import type { PackageIndexes } from './types'

export const metadata = _metadata as PackageIndexes
export const functions = _functions as PackageIndexes['functions']

export const functionNames = functions.map(f => f.name)
