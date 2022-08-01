/** data structure of the package.json file as needed by this codebase */
export interface PackageJson {
  bin: Record<string, string>
  name: string
}
