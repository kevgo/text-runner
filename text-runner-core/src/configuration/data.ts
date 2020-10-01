import { Publications } from "./publications"

/**
 * All configuration values that are provided to the application
 * after analyzing the configuration provided via CLI,
 * the configuration provided via config file,
 * and backfilling with default settings.
 */
export interface Data {
  /** the name of the default filename, set to '' if none is given */
  defaultFile: string

  /** whether to empty the workspace before executing tests */
  emptyWorkspace: boolean

  /** list of names or regexes of files to exclude */
  exclude: string | string[]

  /** glob of the files to test */
  files: string

  /** whether to skip built-in tests that require a network connection */
  online: boolean

  /** folder mappings */
  publications: Publications

  /** the name of the attribute that denotes active regions */
  regionMarker: string

  /** language in which to scaffold new steps */
  scaffoldLanguage: "js" | "ts"

  /** whether to display/emit skipped tests */
  showSkipped: boolean

  /** the root directory of the source code to test */
  sourceDir: string

  /** whether to create the workspace in the system temp directory or locally */
  systemTmp: boolean

  /** the root directory of the workspace */
  workspace: string
}

export type PartialData = Partial<Data>
