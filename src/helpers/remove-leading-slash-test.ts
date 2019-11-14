import { assert } from "chai"
import { removeLeadingSlash } from "./remove-leading-slash"

describe("removeLeadingSlash", function() {
  it("removes the leading slash if one exists", function() {
    assert.equal(removeLeadingSlash("/foo/bar/"), "foo/bar/")
  })

  it("removes the leading backslash if one exists", function() {
    assert.equal(removeLeadingSlash("\\foo\\bar\\"), "foo\\bar\\")
  })

  it("leaves a string without leading slash unchanged", function() {
    assert.equal(removeLeadingSlash("foo/bar/"), "foo/bar/")
  })
})
