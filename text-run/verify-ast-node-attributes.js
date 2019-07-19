const { AstNode } = require("../dist/parsers/ast-node.js")
const assertNoDiff = require("assert-no-diff")
const {
  removeTrailingColon
} = require("../dist/helpers/remove-trailing-colon.js")

module.exports = async function verifyAstNodeAttributes(args) {
  const expected = args.nodes
    .textInNodesOfType("strong")
    .sort()
    .map(removeTrailingColon)
    .join("\n")
  const actual = Object.keys(AstNode.scaffold())
    .sort()
    .join("\n")
  assertNoDiff.chars(expected, actual)
}
