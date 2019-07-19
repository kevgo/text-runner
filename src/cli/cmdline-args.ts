/**
 * data structure for arguments provided by the user,
 * either via command line or via config file
 */
export interface UserProvidedConfiguration {
  actions?: any
  command?: string // the text-runner command to run
  configFileName?: string // name of the config file to use
  exclude?: string
  fileGlob?: string // files to test
  formatterName?: string // name of the formatter to use
  keepTmp?: boolean
  offline?: boolean
  workspace?: string // path of the workspace to use
}
