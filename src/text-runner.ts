import { CliArgTypes } from './cli/cli-arg-types'

import chalk from 'chalk'
import loadConfiguration from './configuration/load-configuration'

import addCommand from './commands/add'
import debugCommand from './commands/debug'
import dynamicCommand from './commands/dynamic'
import helpCommand from './commands/help'
import runCommand from './commands/run'
import setupCommand from './commands/setup'
import staticCommand from './commands/static'
import versionCommand from './commands/version'
import determineConfigFilename from './configuration/determine-config-filename'

// Tests the documentation in the given directory
export default async function(cmdLineArgs: CliArgTypes): Promise<Error[]> {
  let configuration
  try {
    configuration = loadConfiguration(
      determineConfigFilename(cmdLineArgs),
      cmdLineArgs
    )
    const commandName = cmdLineArgs.command
    let errors
    switch (commandName) {
      case 'add':
        errors = await addCommand(cmdLineArgs.files)
        return errors
      case 'debug':
        errors = await debugCommand(configuration)
        return errors
      case 'dynamic':
        errors = await dynamicCommand(configuration)
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
      case 'static':
        errors = await staticCommand(configuration)
        return errors
      case 'version':
        await versionCommand()
        return []
      default:
        console.log(chalk.red(`unknown command: ${chalk.red(commandName)}`))
        return []
    }
  } catch (err) {
    if (configuration && configuration.sourceDir) {
      process.chdir(configuration.sourceDir)
    }
    return [err]
  }
}
