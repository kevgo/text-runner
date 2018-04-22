// @flow

import type Formatter from './formatters/formatter.js'
import type { CliArgTypes } from './cli/cli-arg-types.js'

const ActivityTypeManager = require('./commands/run/activity-type-manager.js')
const { red } = require('chalk')
const commandPath = require('./commands/command-path')
const Configuration = require('./configuration/configuration.js')
const FormatterManager = require('./formatters/formatter-manager')
const fs = require('fs')
const hasCommand = require('./commands/has-command')
const PrintedUserError = require('./errors/printed-user-error.js')
const UnprintedUserError = require('./errors/unprinted-user-error.js')

// Tests the documentation in the given directory
module.exports = async function (cmdLineArgs: {
  command: string,
  file?: string,
  offline?: boolean,
  exclude?: string,
  format?: Formatter
}) {
  const constructorArgs = {
    offline: cmdLineArgs.offline,
    exclude: cmdLineArgs.exclude,
    format: cmdLineArgs.format
  }
  const configuration = new Configuration(configFileName(), constructorArgs)
  // TODO: make getting a formatter a function
  const formatter = new FormatterManager().getFormatter(
    configuration.get('format')
  )
  const activityTypesManager = new ActivityTypeManager(formatter, configuration)
  const commandName = cmdLineArgs.command
  if (!hasCommand(commandName)) {
    formatter.error(`unknown command: ${red(commandName)}`)
  }
  const file = cmdLineArgs.file
  try {
    const command = require(commandPath(commandName))
    switch (commandName) {
      case 'add':
        await command(file)
        break
      case 'help':
        await command()
        break
      case 'run':
        await command({ formatter, activityTypesManager, file })
        break
      case 'setup':
        await command()
        break
      case 'version':
        await command()
        break
    }
  } catch (err) {
    if (err instanceof UnprintedUserError) {
      formatter.error(err.message, err.filePath, err.line)
      throw new PrintedUserError(err)
    } else {
      throw err
    }
  }
}

function configFileName (): string {
  return fs.existsSync('text-run.yml') ? 'text-run.yml' : ''
}
