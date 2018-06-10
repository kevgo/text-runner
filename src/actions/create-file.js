// @flow

import type { ActionArgs } from '../runners/action-args.js'

const { cyan } = require('chalk')
const fs = require('fs')
const mkdirp = require('mkdirp')
const path = require('path')

module.exports = function (args: ActionArgs) {
  const filePath = args.nodes.textInNodeOfType('em', 'strong')
  const content = args.nodes.textInNodeOfType('fence', 'code')
  args.formatter.name(`create file ${cyan(filePath)}`)
  const fullPath = path.join(args.configuration.workspace, filePath)
  args.formatter.log(`create file ${fullPath}`)
  mkdirp.sync(path.dirname(fullPath))
  fs.writeFileSync(fullPath, content)
}
