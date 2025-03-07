import { assert } from "chai"
import { suite, test } from "node:test"

import * as ast from "../../ast/index.js"
import * as files from "../../filesystem/index.js"
import { OpenNodeTracker } from "./open-node-tracker.js"

suite("OpenTagTracker.close()", () => {
  /** placeholder filename */
  const file = new files.FullFilePath("foo.md")

  test("closing an open tag", () => {
    const openTags = new OpenNodeTracker()
    openTags.open(ast.Node.scaffold({ type: "anchor_open" }), 3)
    const location = new files.Location(new files.SourceDir(""), file, 12)
    const found = openTags.close("anchor_close", location)
    assert.equal(found, 3)
  })

  test("closing a tag that hasn't been opened", () => {
    const openTags = new OpenNodeTracker()
    openTags.open(ast.Node.scaffold({ type: "anchor_open" }), 3)
    const location = new files.Location(new files.SourceDir(""), file, 12)
    const testFn = () => openTags.close("bold_close", location)
    assert.throws(testFn, "No opening node 'bold_open' found for closing node 'bold_close'")
  })
})

test("OpenTagTracker.has()", () => {
  const openTags = new OpenNodeTracker()
  openTags.open(ast.Node.scaffold({ type: "link_open" }), 3)
  assert.isTrue(openTags.has("link_open"))
  assert.isFalse(openTags.has("anchor_open"))
})
