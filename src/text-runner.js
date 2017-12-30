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
module.exports = function (value: {command: string, file: string, fast: boolean, format: Formatter}, done: DoneFunction) {
  try {
    const configFileName = fs.existsSync('text-run.yml') ? 'text-run.yml' : ''
    const textRunner = new TextRunner({fast: value.fast, format: value.format}, configFileName)
    textRunner.execute(value.command, value.file, done)
  } catch (e) {
    done(e)
  }
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
  execute (command, file, done) {
    if (command === 'run' && hasDirectory(file)) {
      return this._command('run').runDirectory(file, done)
    }

    if (command === 'run' && isMarkdownFile(file)) {
      return this._command('run').runFile(file, done)
    }

    if (command === 'run' && isGlob(file)) {
      return this._command('run').runGlob(file, done)
    }

    if (command === 'run' && file) {
      return this._missingFile(file, done)
    }

    if (hasCommand(command)) {
      return this._command(command).run(done)
    }

    this._unknownCommand(command, done)
  }

  _command (command) {
    const CommandClass = require(commandPath(command))
    const commandInstance = new CommandClass({configuration: this.configuration, formatter: this.formatter, actions: this.actions})
    return commandInstance
  }

  _missingFile (filename, done) {
    const errorMessage = `file or directory does not exist: ${red(filename)}`
    this.formatter.error(errorMessage)
    done(new Error(errorMessage))
  }

  _unknownCommand (command, done) {
    this.formatter.error(`unknown command: ${red(command)}`)
    done(new Error(`unknown command: ${command}`))
  }
}
