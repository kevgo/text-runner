// @flow

import type { CliArgTypes } from './cli/cli-arg-types.js'

const { red } = require('chalk')
const fs = require('fs')
const loadConfiguration = require('./configuration/load-configuration.js')

const addCommand = require('./commands/add/add-command')
const debugCommand = require('./commands/debug/debug-command')
const helpCommand = require('./commands/help/help-command')
const runCommand = require('./commands/run/run-command')
const setupCommand = require('./commands/setup/setup-command')
const versionCommand = require('./commands/version/version-command')

// Tests the documentation in the given directory
module.exports = async function (
  cmdLineArgs: CliArgTypes
): Promise<Array<Error>> {
  var configuration
  try {
    configuration = loadConfiguration(configFileName(), cmdLineArgs)
    const commandName = cmdLineArgs.command
    var errors
    switch (commandName) {
      case 'add':
        errors = await addCommand(cmdLineArgs.files)
        return errors
      case 'debug':
        errors = await debugCommand(configuration)
        return errors
      case 'help':
        await helpCommand()
        return []
      case 'run':
        errors = await runCommand(configuration)
        return errors
      case 'setup':
        await setupCommand()
        return []
      case 'version':
        await versionCommand()
        return []
      default:
        console.log(red(`unknown command: ${red(commandName)}`))
        return []
    }
  } catch (err) {
    if (configuration && configuration.sourceDir) {
      process.chdir(configuration.sourceDir)
    }
    return [err]
  }
}

function configFileName (): string {
  return fs.existsSync('text-run.yml') ? 'text-run.yml' : ''
}
