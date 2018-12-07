import chalk from 'chalk'
import fs from 'fs'
import util from 'util'
import { CliArgTypes } from '../cli/cli-arg-types'
import PrintedUserError from './../errors/printed-user-error'

// Returns the filename for the config file based on the given
export default async function(constructorArgs: CliArgTypes): string {
  const exists = util.promisify(fs.exists)
  if (constructorArgs.config == null) {
    const textRunYmlExists = await exists('text-run.yml')
    return textRunYmlExists ? 'text-run.yml' : ''
  }
  const customConfigFileExists = await exists(constructorArgs.config)
  if (!customConfigFileExists) {
    console.log(
      chalk.red(
        `configuration file ${chalk.cyan(constructorArgs.config)} not found`
      )
    )
    throw new PrintedUserError()
  }
  return constructorArgs.config
}
