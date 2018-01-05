// @flow

import type {TextRunnerConfig} from './typedefs/text-runner-config.js'
import type {ConfigFileStructure} from './typedefs/config-file-structure.js'

const fs = require('fs')
const debug = require('debug')('textrun:configuration')
const YAML = require('yamljs')

const defaultValues = {
  fast: false,
  files: '**/*.md',
  format: 'detailed',
  useTempDirectory: false,
  classPrefix: 'tr_',
  actions: {
    runConsoleCommand: {
      globals: {}
    }
  }
}

// Encapsulates logic around the configuration
class Configuration {
  configFilePath: string
  constructorArgs: TextRunnerConfig
  fileData: ConfigFileStructure
  sourceDir: string
  testDir: string

  constructor (configFilePath: string, constructorArgs: TextRunnerConfig) {
    this.configFilePath = configFilePath
    this.constructorArgs = constructorArgs || {}

    if (this.configFilePath) {
      debug(`loading configuration file: ${this.configFilePath}`)
      // $FlowFixMe: flow-type defs seems to be wrong here
      this.fileData = YAML.load(configFilePath) || {}
    } else {
      this.fileData = {}
    }
    debug(`configuration file data: ${JSON.stringify(this.fileData)}`)

    // the directory containing the source code
    this.sourceDir = process.cwd()
  }

  // Returns the value of the attribute with the given name
  get (attributeName :string) :string {
    return this.constructorArgs[attributeName] || this.fileData[attributeName] || defaultValues[attributeName]
  }

  // Creates a config file with default values
  createDefault () {
    fs.writeFileSync('./text-run.yml',
`# white-list for files to test
files: '**/*.md'

# the formatter to use
format: detailed

# prefix that makes anchor tags active regions
classPrefix: 'tr_'

# whether to run the tests in an external temp directory,
# uses ./tmp if false,
# you can also provide a custom directory path here
useTempDirectory: false

# action-specific configuration
actions:
  runConsoleCommand:
    globals: {}`)
  }
}

module.exports = Configuration
