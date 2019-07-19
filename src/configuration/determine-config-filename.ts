import color from 'colorette'
import fs from 'fs-extra'
import { CmdlineArgs } from '../cli/cmdline-args'
import { PrintedUserError } from './../errors/printed-user-error'

/**
 * Returns the filename for the config file
 *
 * @param cmdLineArgs
 */
export async function determineConfigFilename(
  cmdLineArgs: CmdlineArgs
): Promise<string> {
  if (cmdLineArgs.config == null) {
    try {
      await fs.stat('text-run.yml')
      return 'text-run.yml'
    } catch (e) {
      return ''
    }
  }

  // TODO: move this to the top of the method
  try {
    await fs.stat(cmdLineArgs.config)
    return cmdLineArgs.config
  } catch (e) {
    console.log(
      color.red(
        `configuration file ${color.cyan(cmdLineArgs.config)} not found`
      )
    )
    throw new PrintedUserError()
  }
}
