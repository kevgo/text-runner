// @flow

import type { ActionArgs } from '../commands/run/5-execute/action-args.js'

const { cyan } = require('chalk')
const mkdirp = require('mkdirp')
const path = require('path')

module.exports = function (args: ActionArgs) {
  const directoryName = args.nodes.textInNodeOfType('code')
  if (!directoryName) {
    throw new Error('empty directory name given')
  }
  args.formatter.setTitle(`create directory ${cyan(directoryName)}`)
  const fullPath = path.join(args.configuration.testDir, directoryName)
  mkdirp.sync(fullPath)
}
