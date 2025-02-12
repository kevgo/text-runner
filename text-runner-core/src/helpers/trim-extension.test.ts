import { assert } from "chai"

import { trimExtension } from "./trim-extension.js"
import { unixify } from "./unixify.js"

suite("trimExtension()", function () {
  const tests = {
    "/one/two/three.ts": "/one/two/three",
  }
  for (const [give, want] of Object.entries(tests)) {
    test(`${give} ==> ${want}`, function () {
      assert.equal(unixify(trimExtension(give)), want)
    })
  }
})
