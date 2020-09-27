import { assert } from "chai"

import { addTrailingSlash } from "./add-trailing-slash"

suite("addTrailingSlash", function () {
  assert.equal(addTrailingSlash("foo"), "foo/")
  assert.equal(addTrailingSlash("foo/"), "foo/")
})
