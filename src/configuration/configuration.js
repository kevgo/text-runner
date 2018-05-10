// @flow

const Formatter = require('../formatters/formatter.js')

// Data structure for configuration values
export type Configuration = {|
  offline: boolean, // whether to skip built-in tests that require a network connection
  files: string, // glob of the files to test
  exclude: string | string[], // list of names or regexes of files to exclude
  FormatterClass: typeof Formatter, // type of the Formatter class to use
  sourceDir: string, // the root directory of the source code to test
  useSystemTempDirectory: boolean, // whether to create the workspace in the system temp directory or locally
  workspace: string, // the root directory of the workspace
  classPrefix: string, // the name of the attribute that denotes active blocks
  activityTypes: Object // activity-specific configuration
|}
