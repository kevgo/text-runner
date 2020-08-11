import { assert } from "chai"
import { isExternalLink } from "./is-external-link"

test("isExternalLink", function () {
  assert.isTrue(isExternalLink("//foo.com"), "link without protocol")
  assert.isTrue(isExternalLink("http://foo.com"), "link with protocol")
  assert.isFalse(isExternalLink("/one/two.md"), "absolute link")
  assert.isFalse(isExternalLink("one.md"), "link to file in same dir")
  assert.isFalse(isExternalLink("../one.md"), "relative link")
})
