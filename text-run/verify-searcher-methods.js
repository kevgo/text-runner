// @flow

import type { ActionArgs } from '../src/runners/action-args.js'

// const classMethods = require('class-methods')
const jsdiffConsole = require('jsdiff-console')
const removeTrailingColon = require('../src/helpers/remove-trailing-colon.js')
const removeValue = require('remove-value')

module.exports = function (args: ActionArgs) {
  const expectedTools = args.nodes
    .textInNodesOfType('strongtext')
    .sort()
    .map(removeTrailingColon)
  // var actualTools = classMethods(Searcher).filter(isPublicMethod)
  const actualTools = Object.getOwnPropertyNames(args.nodes)
  actualTools.sort()
  removeValue(actualTools, 'query')
  jsdiffConsole(actualTools, expectedTools)
}
