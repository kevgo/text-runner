import { assert } from "chai"
import { suite, test } from "node:test"

import { removeLeadingSlash } from "./remove-leading-slash.js"

suite("removeLeadingSlash", () => {
  const tests = {
    "/foo/bar/": "foo/bar/",
    "\\foo\\bar\\": "foo\\bar\\",
    "foo/bar/": "foo/bar/"
  }
  for (const [give, want] of Object.entries(tests)) {
    test(`${give} ==> ${want}`, () => {
      assert.equal(removeLeadingSlash(give), want)
    })
  }
})
