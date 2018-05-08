// @flow

import type { ActionArgs } from '../commands/run/5-execute/action-args.js'

const { bold, cyan } = require('chalk')
const path = require('path')
const debug = require('debug')('textrun:actions:cd')

// Changes the current working directory to the one given in the hyperlink or code block
module.exports = function (args: ActionArgs) {
  const directory = args.nodes.textInNode('link', 'code')
  args.formatter.setTitle(
    `changing into the ${bold(cyan(directory))} directory`
  )
  args.formatter.output(`cd ${directory}`)
  const fullPath = path.join(args.configuration.testDir, directory)
  debug(`changing into directory '${fullPath}`)
  try {
    process.chdir(fullPath)
  } catch (e) {
    if (e.code === 'ENOENT') throw new Error(`directory ${directory} not found`)
    throw e
  }
}
