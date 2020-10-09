import * as files from "../filesystem"
import { Publications } from "./publications"

/** Configuration values for Text-Runner Core used internally */
export type Data = CoreData & AbsoluteDirWorkspace

/** Configuration values for Text-Runner Core from the outside */
export type CompleteAPIData = CoreData & StringWorkspace

export type APIData = Partial<CompleteAPIData>

interface AbsoluteDirWorkspace {
  /** the root directory of the workspace */
  workspace: files.AbsoluteDir
}

interface CoreData {
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
  sourceDir: files.AbsoluteDir

  /** whether to create the workspace in the system temp directory or locally */
  systemTmp: boolean
}

interface StringWorkspace {
  /** the root directory of the workspace */
  workspace?: string
}
