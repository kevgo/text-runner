import * as files from "../filesystem/index.js"
import { Publications } from "./publications.js"

/** configuration values used by the Text-Runner API */
export type APIData = Partial<CompleteAPIData>

/** a full set of configuration values used by the Text-Runner API */
export type CompleteAPIData = SharedValues & StringDirs

/** Configuration values used inside Text-Runner Core */
export type Data = AbsoluteDirs & SharedValues

interface AbsoluteDirs {
  /** the root directory of the source code to test */
  sourceDir: files.SourceDir

  /** the root directory of the workspace */
  workspace: files.AbsoluteDirPath
}

interface SharedValues {
  /** the name of the default filename, set to '' if none is given */
  defaultFile: string

  /** whether to empty the workspace before executing tests */
  emptyWorkspace: boolean

  /** list of names or regexes of files to exclude */
  exclude: string | string[]

  /** glob of the files to test */
  files: string

  /** link patterns to ignore */
  ignoreLinkTargets: RegExp[]

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

  /** whether to create the workspace in the system temp directory or locally */
  systemTmp: boolean
}

interface StringDirs {
  /** the root directory of the source code to test */
  sourceDir: string

  /** the root directory of the workspace */
  workspace?: string
}
