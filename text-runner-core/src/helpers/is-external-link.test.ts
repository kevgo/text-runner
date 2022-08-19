import { assert } from "chai"

import { isExternalLink } from "./is-external-link.js"

suite("isExternalLink", function () {
  test("link without protocol", function () {
    assert.isTrue(isExternalLink("//foo.com"))
  })
  test("link with protocol", function () {
    assert.isTrue(isExternalLink("http://foo.com"))
  })
  test("absolute link", function () {
    assert.isFalse(isExternalLink("/one/two.md"))
  })
  test("link to file in same dir", function () {
    assert.isFalse(isExternalLink("one.md"))
  })
  test("relative link", function () {
    assert.isFalse(isExternalLink("../one.md"))
  })
})
