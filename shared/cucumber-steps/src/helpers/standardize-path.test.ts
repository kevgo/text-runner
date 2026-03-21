import { assert } from "chai"
import { suite, test } from "node:test"

import { standardizePath } from "./standardize-path.js"

suite("standardizePath", () => {
  test("unix path", () => {
    assert.equal(standardizePath("foo/bar"), "foo/bar")
  })
  test("windows path", () => {
    assert.equal(standardizePath("foo\\bar"), "foo/bar")
  })
})
