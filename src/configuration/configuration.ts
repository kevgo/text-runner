import Formatter from '../formatters/formatter'
import Publications from './publications'

// Data structure for configuration values
export interface Configuration {
  actions: any // configuration for actions
  classPrefix: string // the name of the attribute that denotes active blocks
  defaultFile: string // the name of the default filename, set to '' if none is given
  exclude: string | string[] // list of names or regexes of files to exclude
  fileGlob: string // glob of the files to test
  FormatterClass: typeof Formatter // type of the Formatter class to use
  keepTmp: boolean // whether to keep the tmp dir if tests successful
  publications: Publications // folder mappings
  offline: boolean // whether to skip built-in tests that require a network connection
  sourceDir: string // the root directory of the source code to test
  useSystemTempDirectory: boolean // whether to create the workspace in the system temp directory or locally
  workspace: string // the root directory of the workspace
}
