import { assert } from "chai"
import { unixify } from "./unixify"

describe("unifixy", function() {
  it("converts Windows paths to Unix paths", function() {
    assert.equal(unixify("\\foo\\bar\\"), "/foo/bar/")
  })
  it("leaves Unix paths alone", function() {
    assert.equal(unixify("/foo/bar/"), "/foo/bar/")
  })
  it("handles mixed path styles", function() {
    assert.equal(unixify("/foo\\bar/"), "/foo/bar/")
  })
})
