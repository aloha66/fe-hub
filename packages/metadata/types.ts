export interface PackageManifest {
  name: string
  display: string
  description?: string
  manualImport?: boolean
  deprecated?: boolean
  utils?: boolean
  onlyDirectories?: boolean
  external?: string[]
}

export interface VueUseFunction {
  name: string
  package: string
  importPath?: string
  lastUpdated?: number
  category?: string
  description?: string
  docs?: string
  deprecated?: boolean
  internal?: boolean
  component?: boolean
  directive?: boolean
  external?: string
  alias?: string[]
  related?: string[]
}

export interface PackageIndexes {
  packages: Record<string, VueUsePackage>
  categories: string[]
  functions: VueUseFunction[]
}

export interface VueUsePackage extends PackageManifest {
  dir: string
  docs?: string
}
