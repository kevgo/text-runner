import { assert } from "chai"
import { addLeadingSlash } from "./add-leading-slash"

describe("addLeadingSlash", function() {
  it("adds a leading slash if missing", function() {
    assert.equal(addLeadingSlash("foo"), "/foo")
  })

  it("does not add a slash if one is already there", function() {
    assert.equal(addLeadingSlash("/foo"), "/foo")
  })
})
