import { Publications } from "../publications/publications"
import { FormatterName } from "../../formatters/types/formatter-name"
import { Commands } from "../../text-runner"

/**
 * UserProvidedConfiguration describes arguments provided by the user,
 * either via command line or via config file.
 */
export interface UserProvidedConfiguration {
  regionMarker?: string
  command?: Commands // the text-runner command to run
  configFileName?: string // name of the config file to use
  defaultFile?: string
  exclude?: string | string[]
  fileGlob?: string // files to test
  formatterName?: FormatterName // name of the formatter to use
  offline?: boolean
  publications?: Publications
  useSystemTempDirectory?: boolean
  workspace?: string // path of the workspace to use
}
