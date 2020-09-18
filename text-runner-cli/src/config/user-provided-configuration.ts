import * as tr from "text-runner-core"
import { FormatterName } from "../formatters/formatter"
import { ScaffoldLanguage } from "../commands/scaffold"

/**
 * UserProvidedConfiguration describes arguments provided by the user,
 * either via command line or via config file.
 */
export interface UserProvidedConfiguration {
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

export class UserConfigurationBuilder {
  private config: UserProvidedConfiguration

  constructor(config: UserProvidedConfiguration) {
    this.config = config
  }

  /**
   * Returns a new UserProvidedConfiguration that contains this config
   * with the fields from other overwriting the fields of this one.
   */
  merge(other: UserProvidedConfiguration): UserConfigurationBuilder {
    const result = {}
    for (const [key, value] of Object.entries(this.config)) {
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
    return new UserConfigurationBuilder(result)
  }

  data(): UserProvidedConfiguration {
    this.config.publications = tr.Publications.fromJSON(this.config.publications).sorted()
    return this.config
  }
}
