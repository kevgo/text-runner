// @flow

import type { ActionArgs } from '../src/runners/action-args.js'

const AstNode = require('../src/parsers/ast-node.js')
const jsdiffConsole = require('jsdiff-console')
const removeTrailingColon = require('../src/helpers/remove-trailing-colon.js')

module.exports = async function (args: ActionArgs) {
  const expected = args.nodes
    .textInNodesOfType('strong')
    .sort()
    .map(removeTrailingColon)
  const actual = Object.keys(AstNode.scaffold()).sort()
  jsdiffConsole(actual, expected)
}
