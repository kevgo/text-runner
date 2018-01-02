// @flow

const ActionManager = require('./actions/action-manager')
const {red} = require('chalk')
const commandPath = require('./helpers/command-path')
const Configuration = require('./configuration')
const FormatterManager = require('./formatters/formatter-manager')
const fs = require('fs')
const hasCommand = require('./helpers/has-command')
const hasDirectory = require('./helpers/has-directory')
const isGlob = require('is-glob')
const isMarkdownFile = require('./helpers/is-markdown-file')

// Tests the documentation in the given directory
module.exports = async function (value: {command: string, file: string, fast: boolean, format: Formatter}) {
  const configFileName = fs.existsSync('text-run.yml') ? 'text-run.yml' : ''
  const textRunner = new TextRunner({fast: value.fast, format: value.format}, configFileName)
  await textRunner.execute(value.command, value.file)
}

class TextRunner {
  constructorArgs: TextRunnerConfig
  configuration: Configuration
  formatter: Formatter
  actions: ActionManager

  constructor (constructorArgs: TextRunnerConfig, configPath) {
    this.constructorArgs = constructorArgs
    this.configuration = new Configuration(configPath, this.constructorArgs)
    const formatterManager = new FormatterManager()
    this.formatter = formatterManager.getFormatter(this.configuration.get('format'))
    this.actions = new ActionManager(this.formatter, this.configuration)
  }

  // Tests the documentation according to the given command and arguments
  async execute (command, file) {
    if (command === 'run' && hasDirectory(file)) {
      await this._command('run').runDirectory(file)
    } else if (command === 'run' && isMarkdownFile(file)) {
      await this._command('run').runFile(file)
    } else if (command === 'run' && isGlob(file)) {
      await this._command('run').runGlob(file)
    } else if (command === 'run' && file) {
      await this._missingFile(file)
    } else if (hasCommand(command)) {
      await this._command(command).run()
    } else {
      await this._unknownCommand(command)
    }
  }

  _command (command) {
    const CommandClass = require(commandPath(command))
    const commandInstance = new CommandClass({configuration: this.configuration, formatter: this.formatter, actions: this.actions})
    return commandInstance
  }

  async _missingFile (filename) {
    const errorMessage = `file or directory does not exist: ${red(filename)}`
    this.formatter.error(errorMessage)
    throw new Error('1')
  }

  async _unknownCommand (command) {
    this.formatter.error(`unknown command: ${red(command)}`)
    throw new Error('1')
  }
}
