import { assert } from "chai"

import { isLinkToAnchorInSameFile } from "./is-link-to-anchor-in-same-file"

test("isLinkToAnchorInSameFile", function () {
  assert.isTrue(isLinkToAnchorInSameFile("#foo"), "anchor in same file")
  assert.isFalse(isLinkToAnchorInSameFile("foo#bar"), "anchor in other file")
  assert.isFalse(isLinkToAnchorInSameFile("foo.md"), "other file")
})
