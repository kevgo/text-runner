import * as textRunner from "text-runner-engine"

import * as commands from "./commands/index.js"
import * as formatters from "./formatters/index.js"

/** arguments provided by the user, either via command line or via config file */
export class Data {
  $schema?: string // link to the JSON-Schema, not used by Text-Runner but by editors
  configFileName?: string // name of the config file to use
  defaultFile?: string
  emptyWorkspace?: boolean
  exclude?: string | string[]
  files?: string // files to test
  format?: formatters.Names // name of the formatter to use
  ignoreLinkTargets?: RegExp[]
  online?: boolean
  publications?: textRunner.configuration.Publications
  regionMarker?: string
  scaffoldLanguage?: commands.ScaffoldLanguage
  showSkipped?: boolean
  systemTmp?: boolean
  workspace?: string // path of the workspace to use

  constructor(data: Partial<Data> = {}) {
    Object.assign(this, data)
  }

  /** merges the given configuration data into this instance */
  merge(other: Data): Data {
    const result = new Data()
    for (const [key, value] of Object.entries(this)) {
      if (value != null) {
        // @ts-expect-error `key` has the correct type here
        result[key] = value
      }
    }
    for (const [key, value] of Object.entries(other)) {
      if (value != null) {
        // @ts-expect-error `key` has the correct type here
        result[key] = value
      }
    }
    return result
  }

  toCoreConfig(): textRunner.configuration.APIData {
    const result: textRunner.configuration.APIData = {}
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
      result.publications = textRunner.configuration.Publications.fromConfigs(this.publications).sorted()
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
