import { assert } from "chai"

import { unixify } from "./unixify"

suite("unifixy", function () {
  const tests = {
    "\\foo\\bar\\": "/foo/bar/",
    "/foo/bar/": "/foo/bar/",
    "/foo\\bar/": "/foo/bar/",
  }
  for (const [give, want] of Object.entries(tests)) {
    test(`${give} ==> ${want}`, function () {
      assert.equal(unixify(give), want)
    })
  }
})
