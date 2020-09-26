import { Publications } from "./publications"

/**
 * All configuration values that are provided to the application
 * after analyzing the configuration provided via CLI,
 * the configuration provided via config file,
 * and backfilling with default settings.
 */
export interface Data {
  regionMarker: string // the name of the attribute that denotes active regions
  defaultFile: string // the name of the default filename, set to '' if none is given
  emptyWorkspace: boolean // whether to empty the workspace before executing tests
  exclude: string | string[] // list of names or regexes of files to exclude
  files: string // glob of the files to test
  publications: Publications // folder mappings
  online: boolean // whether to skip built-in tests that require a network connection
  scaffoldLanguage: "js" | "ts" // language in which to scaffold new steps
  sourceDir: string // the root directory of the source code to test
  systemTmp: boolean // whether to create the workspace in the system temp directory or locally
  workspace: string // the root directory of the workspace
}

export type PartialData = Partial<Data>
