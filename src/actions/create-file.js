// @flow

import type { ActionArgs } from '../commands/run/5-execute/action-args.js'

const { cyan } = require('chalk')
const fs = require('fs')
const mkdirp = require('mkdirp')
const path = require('path')
const debug = require('debug')('textrun:actions:create-file')

module.exports = function (args: ActionArgs) {
  const filePath = args.nodes.textInNodeOfType('emphasizedtext', 'strongtext')
  const content = args.nodes.textInNodeOfType('fence', 'code')
  args.formatter.name(`create file ${cyan(filePath)}`)
  const fullPath = path.join(args.configuration.workspace, filePath)
  debug(fullPath)
  mkdirp.sync(path.dirname(fullPath))
  fs.writeFileSync(fullPath, content)
}
