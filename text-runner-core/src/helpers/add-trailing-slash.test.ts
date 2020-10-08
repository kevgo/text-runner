import { assert } from "chai"

import { addTrailingSlash } from "./add-trailing-slash"

suite("addTrailingSlash", function () {
  const tests = {
    foo: "foo/",
    "foo/": "foo/",
  }
  for (const [give, want] of Object.entries(tests)) {
    test(`${give} ==> ${want}`, function () {
      assert.equal(addTrailingSlash(give), want)
    })
  }
})
