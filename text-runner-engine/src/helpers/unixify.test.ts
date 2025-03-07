import { assert } from "chai"
import { suite, test } from "node:test"

import { unixify } from "./unixify.js"

suite("unifixy", () => {
  const tests = {
    "/foo/bar/": "/foo/bar/",
    "/foo\\bar/": "/foo/bar/",
    "\\foo\\bar\\": "/foo/bar/"
  }
  for (const [give, want] of Object.entries(tests)) {
    test(`${give} ==> ${want}`, () => {
      assert.equal(unixify(give), want)
    })
  }
})
