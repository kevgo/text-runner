import { assert } from "chai"
import { removeTrailingColon } from "./remove-trailing-colon"

describe("removeTrailingColon", function() {
  context("with trailing colon", function() {
    it("removes the trailing colon", function() {
      assert.equal(removeTrailingColon("foo:"), "foo")
    })
  })

  context("without trailing colon", function() {
    it("returns the string as-is", function() {
      assert.equal(removeTrailingColon("foo"), "foo")
    })
  })
})
