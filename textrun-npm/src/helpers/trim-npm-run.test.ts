import { assert } from "chai"
import { suite, test } from "node:test"

import { trimNpmRun } from "./trim-npm-run.js"

suite("trimNpmRun", () => {
  const tests = {
    "npm run test": "test"
  }
  for (const [give, want] of Object.entries(tests)) {
    test(`${give} --> ${want}`, () => {
      assert.equal(want, trimNpmRun(give))
    })
  }
})
