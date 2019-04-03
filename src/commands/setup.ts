import chalk from 'chalk'
import createConfiguration from '../configuration/create-configuration'

export async function setupCommand() {
  await createConfiguration()
  console.log(
    chalk.green(
      `Created configuration file ${chalk.cyan(
        'text-run.yml'
      )} with default values`
    )
  )
}
