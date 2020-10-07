import { assert } from "chai"

import * as ast from "../../ast"
import * as files from "../../filesystem/index"
import { OpenNodeTracker } from "./open-node-tracker"

suite("OpenTagTracker.close()", function () {
  /** placeholder filename */
  const file = new files.FullPath("foo")

  test("closing an open tag", function () {
    const openTags = new OpenNodeTracker()
    openTags.open(ast.Node.scaffold({ type: "anchor_open" }), 3)
    const found = openTags.close("anchor_close", file, 12)
    assert.equal(found, 3)
  })

  test("closing a tag that hasn't been opened", function () {
    const openTags = new OpenNodeTracker()
    // @ts-ignore
    openTags.open(ast.Node.scaffold({ type: "anchor_open" }))
    const testFn = () => openTags.close("bold_close", file, 12)
    assert.throws(testFn, "No opening node 'bold_open' found for closing node 'bold_close'")
  })
})

test("OpenTagTracker.has()", function () {
  const openTags = new OpenNodeTracker()
  openTags.open(ast.Node.scaffold({ type: "link_open" }), 3)
  assert.isTrue(openTags.has("link_open"))
  assert.isFalse(openTags.has("anchor_open"))
})
