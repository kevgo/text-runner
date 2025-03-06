import { assert } from "chai"
import { suite, test } from "node:test"

import { standardizePath } from "./standardize-path.js"

suite("standardizePath", function() {
  test("unix path", function() {
    assert.equal(standardizePath("foo/bar"), "foo/bar")
  })
  test("windows path", function() {
    assert.equal(standardizePath("foo\\bar"), "foo/bar")
  })
})
