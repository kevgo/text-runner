import { assert } from "chai"
import { removeDoubleSlash } from "./remove-double-slash"

describe("removeDoubleSlash", function() {
  it("removes double slashes", function() {
    assert.equal(removeDoubleSlash("/foo//bar/"), "/foo/bar/")
  })
})
