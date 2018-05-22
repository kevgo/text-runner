// @flow

import type { CliArgTypes } from './cli/cli-arg-types.js'

const { red } = require('chalk')
const fs = require('fs')
const loadConfiguration = require('./configuration/load-configuration.js')
const path = require('path')
const printCodeFrame = require('./helpers/print-code-frame')
const PrintedUserError = require('./errors/printed-user-error.js')
const UnprintedUserError = require('./errors/unprinted-user-error.js')

const addCommand = require('./commands/add/add-command')
const debugCommand = require('./commands/debug/debug-command')
const helpCommand = require('./commands/help/help-command')
const runCommand = require('./commands/run/run-command')
const setupCommand = require('./commands/setup/setup-command')
const versionCommand = require('./commands/version/version-command')

// Tests the documentation in the given directory
module.exports = async function (cmdLineArgs: CliArgTypes) {
  const configuration = loadConfiguration(configFileName(), cmdLineArgs)
  const commandName = cmdLineArgs.command
  try {
    switch (commandName) {
      case 'add':
        await addCommand(cmdLineArgs.files)
        break
      case 'debug':
        await debugCommand(configuration)
        break
      case 'help':
        await helpCommand()
        break
      case 'run':
        await runCommand(configuration)
        break
      case 'setup':
        await setupCommand()
        break
      case 'version':
        await versionCommand()
        break
      default:
        console.log(red(`unknown command: ${red(commandName)}`))
    }
  } catch (err) {
    if (err instanceof UnprintedUserError) {
      console.log(red(`${err.filePath}:${err.line} -- ${err.message}`))
      const filePath = path.join(process.cwd(), err.filePath)
      printCodeFrame(console.log, filePath, err.line)
      throw new PrintedUserError(err)
    } else {
      throw err
    }
  }
}

function configFileName (): string {
  return fs.existsSync('text-run.yml') ? 'text-run.yml' : ''
}
