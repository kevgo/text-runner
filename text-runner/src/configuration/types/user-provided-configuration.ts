import { Publications } from "../publications/publications"
import { FormatterName } from "../../formatters/formatter"

/**
 * UserProvidedConfiguration describes arguments provided by the user,
 * either via command line or via config file.
 */
export interface UserProvidedConfiguration {
  regionMarker?: string
  configFileName?: string // name of the config file to use
  debugSwitches?: DebugSwitches
  defaultFile?: string
  exclude?: string | string[]
  files?: string // files to test
  formatterName?: FormatterName // name of the formatter to use
  online?: boolean
  publications?: Publications
  sourceDir?: string // the root directory of the source code to test
  useSystemTempDirectory?: boolean
  workspace?: string // path of the workspace to use
}

interface DebugSwitches {
  activities: boolean
  ast: boolean
  images: boolean
  links: boolean
  linkTargets: boolean
}
