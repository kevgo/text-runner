import chalk from 'chalk'
import createConfiguration from '../configuration/create-configuration'

async function setupCommand() {
  createConfiguration()
  console.log(
    chalk.green(
      `Created configuration file ${chalk.cyan(
        'text-run.yml'
      )} with default values`
    )
  )
}

export default setupCommand
