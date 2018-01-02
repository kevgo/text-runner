// @flow

const ActionManager = require('../../actions/action-manager.js')
const {cyan} = require('chalk')

class SetupCommand implements Command {
  configuration: Configuration
  formatter: Formatter
  actions: ActionManager

  constructor (value: {configuration: Configuration, formatter: Formatter, actions: ActionManager}) {
    this.configuration = value.configuration
    this.formatter = value.formatter
    this.actions = value.actions
  }

  async run (): Promise<?ErrnoError> {
    this.formatter.start(`Create configuration file ${cyan('text-run.yml')} with default values`)
    this.configuration.createDefault()
    this.formatter.success()
  }
}

module.exports = SetupCommand
