import * as tr from "text-runner-core"

import * as commands from "./commands"
import * as formatters from "./formatters"

/**
 * UserProvidedConfiguration describes arguments provided by the user,
 * either via command line or via config file.
 */
export class Data {
  regionMarker?: string
  configFileName?: string // name of the config file to use
  defaultFile?: string
  emptyWorkspace?: boolean
  exclude?: string | string[]
  files?: string // files to test
  formatterName?: formatters.Names // name of the formatter to use
  ignoreLinkTargets?: RegExp[]
  online?: boolean
  publications?: tr.configuration.Publications
  scaffoldLanguage?: commands.ScaffoldLanguage
  showSkipped?: boolean
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

  toCoreConfig(): tr.configuration.APIData {
    const result: tr.configuration.APIData = {}
    if (this.defaultFile != null) {
      result.defaultFile = this.defaultFile
    }
    if (this.emptyWorkspace != null) {
      result.emptyWorkspace = this.emptyWorkspace
    }
    if (this.exclude != null) {
      result.exclude = this.exclude
    }
    if (this.files != null) {
      result.files = this.files
    }
    if (this.ignoreLinkTargets != null) {
      result.ignoreLinkTargets = this.ignoreLinkTargets.map(ignoreLink => new RegExp(ignoreLink))
    }
    if (this.online != null) {
      result.online = this.online
    }
    if (this.publications != null) {
      result.publications = tr.configuration.Publications.fromConfigs(this.publications).sorted()
    }
    if (this.regionMarker != null) {
      result.regionMarker = this.regionMarker
    }
    if (this.showSkipped != null) {
      result.showSkipped = this.showSkipped
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
