import { assert } from "chai"
import { isLinkToAnchorInOtherFile } from "./is-link-to-anchor-in-other-file"

test("isLinkToAnchorInOtherFile()", function() {
  assert.isTrue(isLinkToAnchorInOtherFile("foo.md#bar"))
  assert.isFalse(isLinkToAnchorInOtherFile("#foo"))
  assert.isFalse(isLinkToAnchorInOtherFile("foo.md"))
  assert.isFalse(isLinkToAnchorInOtherFile("https://foo.com/bar"))
  assert.isFalse(isLinkToAnchorInOtherFile("https://foo.com/bar#baz"))
})
