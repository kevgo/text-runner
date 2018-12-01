import { ActionArgs } from '../runners/action-args'

import chalk from 'chalk'
import jsonfile from 'jsonfile'
import path from 'path'
import trimDollar from '../helpers/trim-dollar'

export default function(args: ActionArgs) {
  const installText = trimDollar(args.nodes.textInNodeOfType('fence', 'code'))
  const pkg = jsonfile.readFileSync(
    path.join(args.configuration.sourceDir, 'package.json')
  )
  args.formatter.name(`verify NPM installs ${chalk.cyan(pkg.name)}`)

  if (missesPackageName(installText, pkg.name)) {
    throw new Error(
      `could not find ${chalk.cyan(pkg.name)} in installation instructions`
    )
  }
}

function missesPackageName(installText: string, packageName: string): boolean {
  // Note: cannot use minimist here
  //       because it is too stupid to understand
  //       that NPM uses '-g' by itself, and not as a switch for the argument after it
  return (
    installText
      .split(' ')
      .map(word => word.trim())
      .filter(word => word === packageName).length === 0
  )
}
