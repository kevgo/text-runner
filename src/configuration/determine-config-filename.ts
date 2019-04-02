import chalk from 'chalk'
import fs from 'fs-extra'
import { CliArgTypes } from '../cli/cli-arg-types'
import { PrintedUserError } from './../errors/printed-user-error'

// Returns the filename for the config file based on the given
export default async function(constructorArgs: CliArgTypes): Promise<string> {
  if (constructorArgs.config == null) {
    try {
      await fs.stat('text-run.yml')
      return 'text-run.yml'
    } catch (e) {
      return ''
    }
  }

  try {
    await fs.stat(constructorArgs.config)
    return constructorArgs.config
  } catch (e) {
    console.log(
      chalk.red(
        `configuration file ${chalk.cyan(constructorArgs.config)} not found`
      )
    )
    throw new PrintedUserError()
  }
}
