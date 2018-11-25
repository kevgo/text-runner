import { ActionArgs } from '../runners/action-args'

import chalk from 'chalk'
import path from 'path'
import trimDollar from '../helpers/trim-dollar'

export default function(args: ActionArgs) {
  args.formatter.name('NPM module exports the command')
  const commandName = trimDollar(
    args.nodes.textInNodeOfType('fence', 'code').trim()
  )
  const pkg = require(path.join(args.configuration.sourceDir, 'package.json'))
  args.formatter.name(
    `NPM module exports the ${chalk.cyan(commandName)} command`
  )

  if (!hasCommandName(commandName, pkg.bin)) {
    throw new Error(
      `${chalk.cyan('package.json')} does not export a ${chalk.red(
        commandName
      )} command`
    )
  }
}

function hasCommandName(
  commandName: string,
  exportedCommands: { [key: string]: string }
): boolean {
  return Object.keys(exportedCommands).includes(commandName)
}
