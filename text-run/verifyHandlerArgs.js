// @flow

import type { ActionArgs } from '../src/runners/action-args.js'

const jsdiffConsole = require('jsdiff-console')
const removeTrailingColon = require('../src/helpers/remove-trailing-colon.js')
const removeValue = require('remove-value')

module.exports = function (args: ActionArgs) {
  const expectedTools = args.nodes
    .textInNodesOfType('strong')
    .sort()
    .map(removeTrailingColon)
  const actualTools = Object.keys(args).sort()
  removeValue(actualTools, 'linkTargets')
  jsdiffConsole(actualTools, expectedTools)
}
