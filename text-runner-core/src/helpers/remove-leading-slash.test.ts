import { assert } from "chai"

import { removeLeadingSlash } from "./remove-leading-slash"

test("removeLeadingSlash", function () {
  assert.equal(removeLeadingSlash("/foo/bar/"), "foo/bar/")
  assert.equal(removeLeadingSlash("\\foo\\bar\\"), "foo\\bar\\")
  assert.equal(removeLeadingSlash("foo/bar/"), "foo/bar/")
})
