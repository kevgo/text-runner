import chalk from 'chalk'
import fs from 'fs'
import { CliArgTypes } from '../cli/cli-arg-types'
import AbsoluteFilePath from '../domain-model/absolute-file-path'
import PrintedUserError from './../errors/printed-user-error'

// Returns the filename for the config file based on the given
export default function(constructorArgs: CliArgTypes): AbsoluteFilePath {
  if (constructorArgs.config == null) {
    return new AbsoluteFilePath(
      fs.existsSync('text-run.yml') ? 'text-run.yml' : ''
    )
  }
  if (!fs.existsSync(constructorArgs.config)) {
    console.log(
      chalk.red(
        `configuration file ${chalk.cyan(constructorArgs.config)} not found`
      )
    )
    throw new PrintedUserError()
  }
  return new AbsoluteFilePath(constructorArgs.config)
}
