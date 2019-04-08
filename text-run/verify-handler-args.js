const jsdiffConsole = require('jsdiff-console')
const {
  removeTrailingColon
} = require('../dist/helpers/remove-trailing-colon.js')
const removeValue = require('remove-value')

module.exports = function verifyHandlerArgs(args) {
  const expectedTools = args.nodes
    .textInNodesOfType('strong')
    .sort()
    .map(removeTrailingColon)
  const actualTools = Object.keys(args).sort()
  removeValue(actualTools, 'linkTargets')
  jsdiffConsole(expectedTools, actualTools)
}
