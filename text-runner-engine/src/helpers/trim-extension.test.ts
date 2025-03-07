import { assert } from "chai"
import { suite, test } from "node:test"

import { trimExtension } from "./trim-extension.js"
import { unixify } from "./unixify.js"

suite("trimExtension()", () => {
  const tests = {
    "/one/two/three.ts": "/one/two/three"
  }
  for (const [give, want] of Object.entries(tests)) {
    test(`${give} ==> ${want}`, () => {
      assert.equal(unixify(trimExtension(give)), want)
    })
  }
})
