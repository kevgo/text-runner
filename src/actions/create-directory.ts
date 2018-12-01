import { ActionArgs } from '../runners/action-args'

import chalk from 'chalk'
import mkdirp from 'mkdirp'
import path from 'path'

export default function(args: ActionArgs) {
  const directoryName = args.nodes.text().trim()
  if (!directoryName) {
    throw new Error('empty directory name given')
  }
  args.formatter.name(`create directory ${chalk.cyan(directoryName)}`)
  const fullPath = path.join(args.configuration.workspace, directoryName)
  mkdirp.sync(fullPath)
}
