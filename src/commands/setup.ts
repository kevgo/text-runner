import color from 'colorette'
import { createConfiguration } from '../configuration/create-configuration'

export async function setupCommand() {
  await createConfiguration()
  console.log(
    color.green(
      `Created configuration file ${color.cyan(
        'text-run.yml'
      )} with default values`
    )
  )
}
