import * as tr from "text-runner-core"

/** expected file structure of "package.json" files */
export interface PackageJson {
  main: string
}

/** expected file structure of "index.js" files */
export interface IndexFile {
  textrunActions: tr.export.TextrunActions
}
