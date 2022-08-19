import { assert } from "chai"

import { isLinkToAnchorInSameFile } from "./is-link-to-anchor-in-same-file.js"

suite("isLinkToAnchorInSameFile", function () {
  test("anchor in same file", function () {
    assert.isTrue(isLinkToAnchorInSameFile("#foo"))
  })
  test("anchor in other file", function () {
    assert.isFalse(isLinkToAnchorInSameFile("foo#bar"))
  })
  test("other file", function () {
    assert.isFalse(isLinkToAnchorInSameFile("foo.md"))
  })
})
