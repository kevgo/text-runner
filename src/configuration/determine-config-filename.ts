import chalk from 'chalk'
import fs from 'fs'
import { CliArgTypes } from '../cli/cli-arg-types'
import PrintedUserError from './../errors/printed-user-error'

// Returns the filename for the config file based on the given
export default function(constructorArgs: CliArgTypes): string {
  if (constructorArgs.config == null) {
    return fs.existsSync('text-run.yml') ? 'text-run.yml' : ''
  }
  if (!fs.existsSync(constructorArgs.config)) {
    console.log(
      chalk.red(
        `configuration file ${chalk.cyan(constructorArgs.config)} not found`
      )
    )
    throw new PrintedUserError()
  }
  return constructorArgs.config
}
