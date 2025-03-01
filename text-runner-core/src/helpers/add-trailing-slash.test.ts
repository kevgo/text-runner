import { assert } from "chai"
import { suite, test } from "node:test"

import { addTrailingSlash } from "./add-trailing-slash.js"

suite("addTrailingSlash", function () {
  const tests = {
    foo: "foo/",
    "foo/": "foo/"
  }
  for (const [give, want] of Object.entries(tests)) {
    test(`${give} ==> ${want}`, function () {
      assert.equal(addTrailingSlash(give), want)
    })
  }
})
