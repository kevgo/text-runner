import { assert } from "chai"
import { removeTrailingColon } from "./remove-trailing-colon"

suite("removeTrailingColon", function() {
  assert.equal(removeTrailingColon("foo:"), "foo")
  assert.equal(removeTrailingColon("foo"), "foo")
})
