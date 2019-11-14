import { assert } from "chai"
import { AstNodeList } from "../parsers/standard-AST/ast-node-list"
import { extractActivities } from "./extract-activities"

describe("extractActivities()", function() {
  it("extracts all activities from the given AstNodeList", function() {
    const input = new AstNodeList()
    input.pushNode({
      attributes: { textrun: "verify-foo" },
      file: "README.md",
      line: 3,
      type: "anchor_open"
    })
    input.pushNode({ type: "text" })
    input.pushNode({ type: "anchor_close" })
    const result = extractActivities([input], "textrun")
    assert.lengthOf(result, 1)
    assert.equal(result[0].actionName, "verify-foo")
    assert.equal(result[0].file.unixified(), "README.md")
    assert.equal(result[0].line, 3)
    assert.deepEqual(result[0].nodes, input)
  })

  it("normalizes action names in CamelCase", function() {
    const AST = new AstNodeList()
    AST.pushNode({
      attributes: { textrun: "verifyFoo" }
    })
    AST.pushNode({ type: "anchor_close" })
    const result = extractActivities([AST], "textrun")
    assert.equal(result[0].actionName, "verify-foo")
  })

  it("normalizes action names in kebab-case", function() {
    const AST = new AstNodeList()
    AST.pushNode({
      attributes: { textrun: "verify-foo" },
      file: "README.md",
      line: 3,
      type: "anchor_open"
    })
    AST.pushNode({ type: "anchor_close" })
    const result = extractActivities([AST], "textrun")
    assert.equal(result[0].actionName, "verify-foo")
  })

  it("normalizes action names in snake_case", function() {
    const AST = new AstNodeList()
    AST.pushNode({
      attributes: { textrun: "verify_foo" },
      file: "README.md",
      line: 3,
      type: "anchor_open"
    })
    AST.pushNode({ type: "anchor_close" })
    const result = extractActivities([AST], "textrun")
    assert.equal(result[0].actionName, "verify-foo")
  })
})
