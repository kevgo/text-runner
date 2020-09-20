import * as tr from "text-runner-core"
import * as formatters from "./formatters"
import * as commands from "./commands"

/**
 * UserProvidedConfiguration describes arguments provided by the user,
 * either via command line or via config file.
 */
export class Data {
  regionMarker?: string
  configFileName?: string // name of the config file to use
  defaultFile?: string
  exclude?: string | string[]
  files?: string // files to test
  formatterName?: formatters.Names // name of the formatter to use
  online?: boolean
  publications?: tr.Publications
  scaffoldLanguage?: commands.ScaffoldLanguage
  sourceDir?: string // the root directory of the source code to test
  systemTmp?: boolean
  workspace?: string // path of the workspace to use

  constructor(data: Partial<Data> = {}) {
    for (const [key, value] of Object.entries(data)) {
      // @ts-ignore
      this[key] = value
    }
  }

  /**
   * Returns a new UserProvidedConfiguration that contains this config
   * with the fields from other overwriting the fields of this one.
   */
  merge(other: Data): Data {
    const result = new Data()
    for (const [key, value] of Object.entries(this)) {
      if (value != null) {
        // @ts-ignore
        result[key] = value
      }
    }
    for (const [key, value] of Object.entries(other)) {
      if (value != null) {
        // @ts-ignore
        result[key] = value
      }
    }
    return result
  }

  toCoreConfig(): tr.PartialConfiguration {
    const result: tr.PartialConfiguration = {}
    if (this.defaultFile != null) {
      result.defaultFile = this.defaultFile
    }
    if (this.exclude != null) {
      result.exclude = this.exclude
    }
    if (this.files != null) {
      result.files = this.files
    }
    if (this.online != null) {
      result.online = this.online
    }
    if (this.publications != null) {
      result.publications = tr.Publications.fromJSON(this.publications).sorted()
    }
    if (this.regionMarker != null) {
      result.regionMarker = this.regionMarker
    }
    if (this.sourceDir != null) {
      result.sourceDir = this.sourceDir
    }
    if (this.systemTmp != null) {
      result.systemTmp = this.systemTmp
    }
    if (this.workspace != null) {
      result.workspace = this.workspace
    }
    return result
  }
}
