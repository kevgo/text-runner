import { suite, test } from "node:test"
import { assert } from "chai"

import { addTrailingSlash } from "./add-trailing-slash.js"

suite("addTrailingSlash", () => {
  const tests = {
    foo: "foo/",
    "foo/": "foo/"
  }
  for (const [give, want] of Object.entries(tests)) {
    test(`${give} ==> ${want}`, () => {
      assert.equal(addTrailingSlash(give), want)
    })
  }
})
