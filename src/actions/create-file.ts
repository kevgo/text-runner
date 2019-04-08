import { ActionArgs } from '../runners/action-args'

import chalk from 'chalk'
import fs from 'fs-extra'
import mkdirp from 'mkdirp'
import path from 'path'

export default async function createFile(args: ActionArgs) {
  const filePath = args.nodes.textInNodeOfType('em', 'strong')
  const content = args.nodes.textInNodeOfType('fence', 'code')
  args.formatter.name(`create file ${chalk.cyan(filePath)}`)
  const fullPath = path.join(args.configuration.workspace, filePath)
  args.formatter.log(`create file ${fullPath}`)
  mkdirp.sync(path.dirname(fullPath))
  await fs.writeFile(fullPath, content)
}
