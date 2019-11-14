import { assert } from "chai"
import { addTrailingSlash } from "./add-trailing-slash"

describe("addTrailingSlash", function() {
  it("appends a slash if there is not one", function() {
    assert.equal(addTrailingSlash("foo"), "foo/")
  })
  it("does not append a slash if there is one", function() {
    assert.equal(addTrailingSlash("foo/"), "foo/")
  })
})
