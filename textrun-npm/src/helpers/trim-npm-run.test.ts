import { assert } from "chai"
import { suite, test } from "node:test"

import { trimNpmRun } from "./trim-npm-run.js"

suite("trimNpmRun", function() {
  const tests = {
    "npm run test": "test"
  }
  for (const [give, want] of Object.entries(tests)) {
    test(`${give} --> ${want}`, function() {
      assert.equal(want, trimNpmRun(give))
    })
  }
})
