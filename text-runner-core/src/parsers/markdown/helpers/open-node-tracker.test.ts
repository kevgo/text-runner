import { assert } from "chai"
import { AbsoluteFilePath } from "../../../filesystem/absolute-file-path"
import { AstNode } from "../../standard-AST/ast-node"
import { OpenNodeTracker } from "./open-node-tracker"

suite("OpenTagTracker.close()", function () {
  /** placeholder filename */
  const file = new AbsoluteFilePath("foo")

  test("closing an open tag", function () {
    const openTags = new OpenNodeTracker()
    openTags.open({ type: "foo_open" })
    const found = openTags.close({ type: "foo_close" }, file, 12)
    assert.equal(found.type, "foo_open")
  })

  test("closing a tag that hasn't been opened", function () {
    const openTags = new OpenNodeTracker()
    // @ts-ignore
    openTags.open(AstNode.scaffold({ type: "foo_open" }))
    const testFn = () => openTags.close({ type: "other_close" }, file, 12)
    assert.throws(testFn, "No opening node 'other_open' found for closing node 'other_close'")
  })
})

test("OpenTagTracker.has()", function () {
  const openTags = new OpenNodeTracker()
  openTags.open(AstNode.scaffold({ type: "link_open" }))
  assert.isTrue(openTags.has("link_open"))
  assert.isFalse(openTags.has("anchor_open"))
})
