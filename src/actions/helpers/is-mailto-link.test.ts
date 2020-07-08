import { assert } from "chai"
import { isMailtoLink } from "./is-mailto-link"

test("isMailtoLink", function () {
  assert.isTrue(isMailtoLink("mailto:foo@bar.com"))
  assert.isFalse(isMailtoLink("foo"))
})
