import { ActionArgs } from '../runners/action-args'

import chalk from 'chalk'
import fs from 'fs'
import path from 'path'

// Verifies that the test workspace contains the given directory
export default function(args: ActionArgs) {
  const directory = args.nodes.text()
  const fullPath = path.join(args.configuration.workspace, directory)
  args.formatter.name(
    `verifying the ${chalk.bold(
      chalk.cyan(directory)
    )} directory exists in the test workspace`
  )
  args.formatter.log(`ls ${fullPath}`)
  let stats
  try {
    stats = fs.lstatSync(fullPath)
  } catch (err) {
    throw new Error(
      `directory ${chalk.cyan(
        chalk.bold(directory)
      )} does not exist in the test workspace`
    )
  }
  if (!stats.isDirectory()) {
    throw new Error(
      `${chalk.cyan(chalk.bold(directory))} exists but is not a directory`
    )
  }
}
