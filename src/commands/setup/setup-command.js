// @flow

import type {Command} from '../command.js'
import type Configuration from '../../configuration/configuration.js'
import type Formatter from '../../formatters/formatter.js'

const ActivityTypeManager = require('../run/activity-type-manager.js')
const {cyan} = require('chalk')

class SetupCommand implements Command {
  configuration: Configuration
  formatter: Formatter
  actions: ActivityTypeManager

  constructor (value: {configuration: Configuration, formatter: Formatter, actions: ActivityTypeManager}) {
    this.configuration = value.configuration
    this.formatter = value.formatter
    this.actions = value.actions
  }

  async run (): Promise<?ErrnoError> {
    this.formatter.action(`Create configuration file ${cyan('text-run.yml')} with default values`)
    this.configuration.createDefault()
    this.formatter.success()
  }
}

module.exports = SetupCommand
