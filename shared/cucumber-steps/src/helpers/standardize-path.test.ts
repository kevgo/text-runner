import { assert } from "chai"

import { standardizePath } from "./standardize-path"

suite("standardizePath", function () {
  test("unix path", function () {
    assert.equal(standardizePath("foo/bar"), "foo/bar")
  })
  test("windows path", function () {
    assert.equal(standardizePath("foo\\bar"), "foo/bar")
  })
})
