import * as tr from "text-runner-core"
import { FormatterName } from "./formatters/formatter"
import { ScaffoldLanguage } from "./commands/scaffold"
import * as YAML from "yamljs"
import { promises as fs } from "fs"

export interface ConfigData {
  regionMarker?: string
  configFileName?: string // name of the config file to use
  defaultFile?: string
  exclude?: string | string[]
  files?: string // files to test
  formatterName?: FormatterName // name of the formatter to use
  online?: boolean
  publications?: tr.Publications
  scaffoldLanguage?: ScaffoldLanguage
  sourceDir?: string // the root directory of the source code to test
  systemTmp?: boolean
  workspace?: string // path of the workspace to use
}

/**
 * UserProvidedConfiguration describes arguments provided by the user,
 * either via command line or via config file.
 */
export class Configuration implements ConfigData {
  regionMarker?: string
  configFileName?: string // name of the config file to use
  defaultFile?: string
  exclude?: string | string[]
  files?: string // files to test
  formatterName?: FormatterName // name of the formatter to use
  online?: boolean
  publications?: tr.Publications
  scaffoldLanguage?: ScaffoldLanguage
  sourceDir?: string // the root directory of the source code to test
  systemTmp?: boolean
  workspace?: string // path of the workspace to use

  constructor(data: ConfigData = {}) {
    for (const [key, value] of Object.entries(data)) {
      // @ts-ignore
      this[key] = value
    }
  }

  /** provides the content of the config file in the standardized format */
  static async fromConfigFile(filename: string): Promise<Configuration> {
    if (!filename) {
      return new Configuration({})
    }
    const fileContent = await fs.readFile(filename, "utf-8")
    const fileData = YAML.parse(fileContent)
    return new Configuration({
      regionMarker: fileData.regionMarker,
      defaultFile: fileData.defaultFile,
      exclude: fileData.exclude,
      files: fileData.files,
      formatterName: fileData.format,
      online: fileData.online,
      publications: fileData.publications,
      systemTmp: fileData.systemTmp,
      workspace: fileData.workspace,
    })
  }

  /**
   * Returns a new UserProvidedConfiguration that contains this config
   * with the fields from other overwriting the fields of this one.
   */
  merge(other: Configuration): Configuration {
    const result = new Configuration()
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
