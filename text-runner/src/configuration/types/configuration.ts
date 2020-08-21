import { Publications } from "../publications/publications"

/**
 * All configuration values that are provided to the application
 * after analyzing the configuration provided by the user
 * and determining other runtime variables.
 */
export interface Configuration {
  actions: any // configuration data for actions
  classPrefix: string // the name of the attribute that denotes active regions
  defaultFile: string // the name of the default filename, set to '' if none is given
  exclude: string | string[] // list of names or regexes of files to exclude
  fileGlob: string // glob of the files to test
  formatterName: string // name of the Formatter class to use
  keepTmp: boolean // whether to keep the tmp dir if tests successful
  publications: Publications // folder mappings
  offline: boolean // whether to skip built-in tests that require a network connection
  sourceDir: string // the root directory of the source code to test
  useSystemTempDirectory: boolean // whether to create the workspace in the system temp directory or locally
  workspace: string // the root directory of the workspace
}

/** creates an empty configuration object for testing */
export function scaffoldConfiguration(): Configuration {
  return {
    actions: null,
    classPrefix: "",
    defaultFile: "",
    exclude: "",
    fileGlob: "",
    formatterName: "",
    keepTmp: false,
    offline: false,
    publications: new Publications(),
    sourceDir: "",
    useSystemTempDirectory: false,
    workspace: "",
  }
}
