// @flow

import type { ActionArgs } from '../runners/action-args.js'

const { bold, cyan } = require('chalk')
const fs = require('fs')
const path = require('path')

// Verifies that a local directory linked in Markdown exists
module.exports = function (args: ActionArgs) {
  const directory = args.nodes.textInNodeOfType('link_open')
  args.formatter.name(
    `directory ${bold(cyan(directory))} exists in the source code`
  )
  var stats
  try {
    stats = fs.lstatSync(path.join(process.cwd(), directory))
  } catch (err) {
    throw new Error(
      `directory ${cyan(bold(directory))} does not exist in the source code`
    )
  }
  if (!stats.isDirectory()) {
    throw new Error(
      `${cyan(
        bold(directory)
      )} exists in the source code but is not a directory`
    )
  }
}
