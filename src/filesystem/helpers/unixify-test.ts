import { assert } from "chai"
import { unixify } from "./unixify"

test("unifixy", function() {
  assert.equal(unixify("\\foo\\bar\\"), "/foo/bar/")
  assert.equal(unixify("/foo/bar/"), "/foo/bar/")
  assert.equal(unixify("/foo\\bar/"), "/foo/bar/")
})
