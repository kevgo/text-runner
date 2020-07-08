const assertNoDiff = require("assert-no-diff")
const { removeTrailingColon } = require("../dist/helpers/remove-trailing-colon.js")
const removeValue = require("remove-value")

module.exports = function verifyHandlerArgs(args) {
  const expectedTools = args.nodes.textInNodesOfType("strong").sort().map(removeTrailingColon)
  const actualTools = Object.keys(args).sort()
  removeValue(actualTools, "linkTargets")
  assertNoDiff.trimmedLines(expectedTools.join("\n"), actualTools.join("\n"))
}
