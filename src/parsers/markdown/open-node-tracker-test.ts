import { strict as assert } from "assert"
import { AbsoluteFilePath } from "../../filesystem/absolute-file-path"
import { AstNode } from "../standard-AST/ast-node"
import { OpenNodeTracker } from "./open-node-tracker"

describe("OpenTagTracker", function() {
  /** placeholder filename */
  const file = new AbsoluteFilePath("foo")

  it("stores nodes", function() {
    const openTags = new OpenNodeTracker()
    openTags.open({ type: "foo_open" })
    const found = openTags.close({ type: "foo_close" }, file, 12)
    assert.equal(found.type, "foo_open")
  })

  it("throws when closing a tag that hasn't been opened", function() {
    const openTags = new OpenNodeTracker()
    openTags.open(AstNode.scaffold({ type: "foo_open" }))
    const testFn = () => openTags.close({ type: "other_close" }, file, 12)
    assert.throws(
      testFn,
      new Error(
        "No opening node 'other_open' found for closing node 'other_close'"
      )
    )
  })
})
