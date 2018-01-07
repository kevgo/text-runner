// @flow

import type Formatter from './formatters/formatter.js'
import type {CliArgTypes} from './cli/cli-arg-types.js'

const ActivityTypeManager = require('./commands/run/activity-type-manager.js')
const {red} = require('chalk')
const commandPath = require('./commands/command-path')
const Configuration = require('./configuration/configuration.js')
const FormatterManager = require('./formatters/formatter-manager')
const fs = require('fs')
const hasCommand = require('./commands/has-command')
const isGlob = require('is-glob')
const path = require('path')
const PrintedUserError = require('./errors/printed-user-error.js')
const UnprintedUserError = require('./errors/unprinted-user-error.js')

// Tests the documentation in the given directory
module.exports = async function (value: {command: string, file: string, offline: boolean, format: Formatter}) {
  const configFileName = fs.existsSync('text-run.yml') ? 'text-run.yml' : ''
  const textRunner = new TextRunner({offline: value.offline, format: value.format}, configFileName)
  await textRunner.execute(value.command, value.file)
}

class TextRunner {
  constructorArgs: CliArgTypes
  configuration: Configuration
  formatter: Formatter
  activityTypesManager: ActivityTypeManager

  constructor (constructorArgs: CliArgTypes, configPath) {
    this.constructorArgs = constructorArgs
    this.configuration = new Configuration(configPath, this.constructorArgs)
    const formatterManager = new FormatterManager()
    this.formatter = formatterManager.getFormatter(this.configuration.get('format'))
    this.activityTypesManager = new ActivityTypeManager(this.formatter, this.configuration)
  }

  // Tests the documentation according to the given command and arguments
  async execute (command, file) {
    try {
      if (command === 'run' && hasDirectory(file)) {
        await this._command('run').runDirectory(file)
      } else if (command === 'run' && isMarkdownFile(file)) {
        await this._command('run').runFile(file)
      } else if (command === 'run' && isGlob(file)) {
        await this._command('run').runGlob(file)
      } else if (command === 'run' && file) {
        await this._missingFile(file)
      } else if (command === 'add') {
        this._command('add').runFile(file)
      } else if (hasCommand(command)) {
        await this._command(command).run()
      } else {
        await this._unknownCommand(command)
      }
    } catch (err) {
      if (err instanceof UnprintedUserError) {
        this.formatter.error(err.message)
        throw new PrintedUserError(err)
      } else {
        throw err
      }
    }
  }

  _command (command) {
    const CommandClass = require(commandPath(command))
    const commandInstance = new CommandClass({configuration: this.configuration, formatter: this.formatter, activityTypesManager: this.activityTypesManager})
    return commandInstance
  }

  async _missingFile (filename) {
    throw new UnprintedUserError(`file or directory does not exist: ${red(filename)}`)
  }

  async _unknownCommand (command) {
    throw new UnprintedUserError(`unknown command: ${red(command)}`)
  }
}

function hasDirectory (dirname :string) :boolean {
  try {
    return fs.statSync(dirname).isDirectory()
  } catch (e) {
    return false
  }
}

function isMarkdownFile (filename :string) :boolean {
  try {
    const filepath = path.join(process.cwd(), filename)
    return filename.endsWith('.md') && fs.statSync(filepath).isFile()
  } catch (e) {
    return false
  }
}
