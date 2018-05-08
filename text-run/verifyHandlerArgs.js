// @flow

import type { ActionArgs } from '../src/commands/run/5-execute/action-args.js'

const jsdiffConsole = require('jsdiff-console')
const removeTrailingColon = require('../src/helpers/remove-trailing-colon.js')
const removeValue = require('remove-value')

module.exports = function (args: ActionArgs) {
  const expectedTools = args.nodes
    .textInNodesOfType('strongtext')
    .sort()
    .map(removeTrailingColon)
  const actualTools = Object.keys(args).sort()
  removeValue(actualTools, 'activityTypeName')
  removeValue(actualTools, 'linkTargets')
  jsdiffConsole(actualTools, expectedTools)
}
