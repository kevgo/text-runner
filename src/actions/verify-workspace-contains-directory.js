// @flow

import type { ActionArgs } from '../commands/run/5-execute/action-args.js'

const { bold, cyan } = require('chalk')
const fs = require('fs')
const path = require('path')

// Verifies that the test workspace contains the given directory
module.exports = function (args: ActionArgs) {
  const directory = args.nodes.textInNodeOfType('code')
  const fullPath = path.join(args.configuration.testDir, directory)
  args.formatter.setTitle(
    `verifying the ${bold(
      cyan(directory)
    )} directory exists in the test workspace`
  )
  var stats
  try {
    stats = fs.lstatSync(fullPath)
  } catch (err) {
    throw new Error(
      `directory ${cyan(bold(directory))} does not exist in the test workspace`
    )
  }
  if (!stats.isDirectory()) {
    throw new Error(`${cyan(bold(directory))} exists but is not a directory`)
  }
}
