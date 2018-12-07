import { ActionArgs } from '../runners/action-args'

import chalk from 'chalk'
import fs from 'fs'
import mkdirp from 'mkdirp'
import path from 'path'
import util from 'util'

export default async function(args: ActionArgs) {
  const filePath = args.nodes.textInNodeOfType('em', 'strong')
  const content = args.nodes.textInNodeOfType('fence', 'code')
  args.formatter.name(`create file ${chalk.cyan(filePath)}`)
  const fullPath = path.join(args.configuration.workspace, filePath)
  args.formatter.log(`create file ${fullPath}`)
  mkdirp.sync(path.dirname(fullPath))
  await util.promisify(fs.writeFile)(fullPath, content)
}
