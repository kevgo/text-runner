// @flow

import type { ActionArgs } from '../runners/action-args.js'

const { cyan } = require('chalk')
const mkdirp = require('mkdirp')
const path = require('path')

module.exports = function (args: ActionArgs) {
  const directoryName = args.nodes.text().trim()
  if (!directoryName) {
    throw new Error('empty directory name given')
  }
  args.formatter.name(`create directory ${cyan(directoryName)}`)
  const fullPath = path.join(args.configuration.workspace, directoryName)
  mkdirp.sync(fullPath)
}
