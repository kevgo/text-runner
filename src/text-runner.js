const ActionManager = require('./actions/action-manager')
const {red} = require('chalk')
const commandPath = require('./helpers/command-path')
const Configuration = require('./configuration')
const FormatterManager = require('./formatters/formatter-manager')
const hasCommand = require('./helpers/has-command')
const hasDirectory = require('./helpers/has-directory')
const interpret = require('interpret')
const isGlob = require('is-glob')
const isMarkdownFile = require('./helpers/is-markdown-file')
const Liftoff = require('liftoff')

// Tests the documentation in the given directory
module.exports = function ({command, file, fast, format}, done) {
  const liftoff = new Liftoff({name: 'text-run', configName: 'text-run', extensions: interpret.extensions})
  liftoff.launch({}, ({configPath}) => {
    try {
      const textRunner = new TextRunner({fast, format}, configPath)
      textRunner.execute(command, file, done)
    } catch (e) {
      done(e)
    }
  })
}

class TextRunner {
  constructor (constructorArgs, configPath) {
    this.constructorArgs = constructorArgs
    this.configuration = new Configuration(configPath, this.constructorArgs)
    const formatterManager = new FormatterManager()
    this.formatter = formatterManager.getFormatter(this.configuration.get('format'))
    this.actions = new ActionManager({formatter: this.formatter, configuration: this.configuration})
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

    if (command === 'run') {
      return this._command('run').runAll(done)
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
