import chalk from 'chalk'
import fs from 'fs-extra'
import { UserProvidedConfiguration } from '../cli/cmdline-args'
import { PrintedUserError } from './../errors/printed-user-error'

/**
 * Returns the filename for the config file
 *
 * @param cmdLineArgs
 */
export async function determineConfigFilename(
  cmdLineArgs: UserProvidedConfiguration
): Promise<string> {
  if (cmdLineArgs.configFileName == null) {
    try {
      await fs.stat('text-run.yml')
      return 'text-run.yml'
    } catch (e) {
      return ''
    }
  }

  // TODO: move this to the top of the method
  try {
    await fs.stat(cmdLineArgs.configFileName)
    return cmdLineArgs.configFileName
  } catch (e) {
    console.log(
      chalk.red(
        `configuration file ${chalk.cyan(cmdLineArgs.configFileName)} not found`
      )
    )
    throw new PrintedUserError()
  }
}
