import { assert } from "chai"

import { removeLeadingSlash } from "./remove-leading-slash"

suite("removeLeadingSlash", function () {
  const tests = {
    "/foo/bar/": "foo/bar/",
    "\\foo\\bar\\": "foo\\bar\\",
    "foo/bar/": "foo/bar/",
  }
  for (const [give, want] of Object.entries(tests)) {
    test(`${give} ==> ${want}`, function () {
      assert.equal(removeLeadingSlash(give), want)
    })
  }
})
