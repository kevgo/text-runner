const { AstNode } = require('../dist/parsers/ast-node.js')
const jsdiffConsole = require('jsdiff-console')
const {
  removeTrailingColon
} = require('../dist/helpers/remove-trailing-colon.js')

module.exports = async function(args) {
  const expected = args.nodes
    .textInNodesOfType('strong')
    .sort()
    .map(removeTrailingColon)
  const actual = Object.keys(AstNode.scaffold()).sort()
  jsdiffConsole(expected, actual)
}
