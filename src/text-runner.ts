import chalk from 'chalk'
import { CmdlineArgs } from './cli/cmdline-args'
import { addCommand } from './commands/add'
import { debugCommand } from './commands/debug'
import { dynamicCommand } from './commands/dynamic'
import { helpCommand } from './commands/help'
import { runCommand } from './commands/run'
import { setupCommand } from './commands/setup'
import { staticCommand } from './commands/static'
import { unusedCommand } from './commands/unused'
import { versionCommand } from './commands/version'
import { Configuration } from './configuration/configuration'
import { determineConfigFilename } from './configuration/determine-config-filename'
import { loadConfiguration } from './configuration/load-configuration'

/**
 * Tests the documentation in the given directory
 * @param cmdLineArgs the arguments provided on the command line
 */
export async function textRunner(cmdLineArgs: CmdlineArgs): Promise<Error[]> {
  let configuration: Configuration | undefined
  try {
    const configFilename = await determineConfigFilename(cmdLineArgs)
    configuration = loadConfiguration(configFilename, cmdLineArgs)
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
      case 'unused':
        await unusedCommand(configuration)
        return []
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
