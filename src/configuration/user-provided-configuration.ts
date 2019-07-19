import { Publications } from './publications'

/**
 * data structure for arguments provided by the user,
 * either via command line or via config file
 */
export interface UserProvidedConfiguration {
  actions?: any
  classPrefix?: string
  command?: string // the text-runner command to run
  configFileName?: string // name of the config file to use
  defaultFile?: string
  exclude?: string | string[]
  fileGlob?: string // files to test
  formatterName?: string // name of the formatter to use
  keepTmp?: boolean
  offline?: boolean
  publications?: Publications
  useSystemTempDirectory?: boolean
  workspace?: string // path of the workspace to use
}
