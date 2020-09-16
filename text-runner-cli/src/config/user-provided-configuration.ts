import { Publications } from "text-runner-core"
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
  publications?: Publications
  scaffoldLanguage?: ScaffoldLanguage
  sourceDir?: string // the root directory of the source code to test
  systemTmp?: boolean
  workspace?: string // path of the workspace to use
}
