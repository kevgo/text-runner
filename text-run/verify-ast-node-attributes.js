const { AstNode } = require("../text-runner/dist/parsers/standard-AST/ast-node.js")
const assertNoDiff = require("assert-no-diff")
const { removeTrailingColon } = require("../text-runner/dist/helpers/remove-trailing-colon.js")

module.exports = async function verifyAstNodeAttributes(args) {
  const expected = args.nodes.textInNodesOfType("strong").sort().map(removeTrailingColon).join("\n")
  const actual = Object.keys(AstNode.scaffold()).sort().join("\n")
  assertNoDiff.chars(expected, actual)
}
