// @flow

import type { ActionArgs } from '../runners/action-args.js'

const { bold, cyan } = require('chalk')
const path = require('path')

// Changes the current working directory to the one given in the hyperlink or code block
module.exports = function (args: ActionArgs) {
  const directory = args.nodes.text()
  args.formatter.name(`changing into the ${bold(cyan(directory))} directory`)
  const fullPath = path.join(args.configuration.workspace, directory)
  args.formatter.log(`cd ${fullPath}`)
  try {
    process.chdir(fullPath)
  } catch (e) {
    if (e.code === 'ENOENT') throw new Error(`directory ${directory} not found`)
    throw e
  }
}
