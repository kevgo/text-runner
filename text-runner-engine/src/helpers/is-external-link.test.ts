import { assert } from "chai"
import { suite, test } from "node:test"

import { isExternalLink } from "./is-external-link.js"

suite("isExternalLink", () => {
  test("link without protocol", () => {
    assert.isTrue(isExternalLink("//foo.com"))
  })
  test("link with protocol", () => {
    assert.isTrue(isExternalLink("http://foo.com"))
  })
  test("absolute link", () => {
    assert.isFalse(isExternalLink("/one/two.md"))
  })
  test("link to file in same dir", () => {
    assert.isFalse(isExternalLink("one.md"))
  })
  test("relative link", () => {
    assert.isFalse(isExternalLink("../one.md"))
  })
})
