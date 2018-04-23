// @flow

import type Formatter from './formatters/formatter.js'
import type { CliArgTypes } from './cli/cli-arg-types.js'

const { red } = require('chalk')
const commandPath = require('./commands/command-path')
const Configuration = require('./configuration/configuration.js')
const FormatterManager = require('./formatters/formatter-manager')
const fs = require('fs')
const hasCommand = require('./commands/has-command')
const PrintedUserError = require('./errors/printed-user-error.js')
const UnprintedUserError = require('./errors/unprinted-user-error.js')

const addCommand = require('./commands/add/add-command')
const helpCommand = require('./commands/help/help-command')
const runCommand = require('./commands/run/run-command')
const setupCommand = require('./commands/setup/setup-command')
const versionCommand = require('./commands/version/version-command')

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
  const commandName = cmdLineArgs.command
  if (!hasCommand(commandName)) {
    formatter.error(`unknown command: ${red(commandName)}`)
  }
  const file = cmdLineArgs.file
  try {
    switch (commandName) {
      case 'add':
        await addCommand(file)
        break
      case 'help':
        await helpCommand()
        break
      case 'run':
        await runCommand(file, configuration, formatter)
        break
      case 'setup':
        await setupCommand(configuration, formatter)
        break
      case 'version':
        await versionCommand()
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
