import { assert } from "chai"

import { removeDoubleSlash } from "./remove-double-slash"

suite("removeDoubleSlash", function () {
  const tests = {
    "/foo//bar/": "/foo/bar/",
  }
  for (const [give, want] of Object.entries(tests)) {
    test(`${give} ==> ${want}`, function () {
      assert.equal(removeDoubleSlash(give), want)
    })
  }
})
