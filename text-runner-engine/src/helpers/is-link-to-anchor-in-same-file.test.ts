import { assert } from "chai"
import { suite, test } from "node:test"

import { isLinkToAnchorInSameFile } from "./is-link-to-anchor-in-same-file.js"

suite("isLinkToAnchorInSameFile", () => {
  test("anchor in same file", () => {
    assert.isTrue(isLinkToAnchorInSameFile("#foo"))
  })
  test("anchor in other file", () => {
    assert.isFalse(isLinkToAnchorInSameFile("foo#bar"))
  })
  test("other file", () => {
    assert.isFalse(isLinkToAnchorInSameFile("foo.md"))
  })
})
