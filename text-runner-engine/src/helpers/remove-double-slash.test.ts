import { assert } from "chai"
import { suite, test } from "node:test"

import { removeDoubleSlash } from "./remove-double-slash.js"

suite("removeDoubleSlash", () => {
  const tests = {
    "/foo//bar/": "/foo/bar/"
  }
  for (const [give, want] of Object.entries(tests)) {
    test(`${give} ==> ${want}`, () => {
      assert.equal(removeDoubleSlash(give), want)
    })
  }
})
