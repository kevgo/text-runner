const assertNoDiff = require("assert-no-diff")
const { removeTrailingColon } = require("../src/dist/helpers/remove-trailing-colon.js")
const removeValue = require("remove-value")

module.exports = function verifySearcherMethod(args) {
  const expectedTools = args.nodes.textInNodesOfType("strongtext").sort().map(removeTrailingColon)
  const actualTools = Object.getOwnPropertyNames(args.nodes)
  actualTools.sort()
  removeValue(actualTools, "query")
  assertNoDiff.chars(actualTools.join("\n"), expectedTools.join("\n"))
}
