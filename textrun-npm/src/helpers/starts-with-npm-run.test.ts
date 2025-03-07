import { assert } from "chai"
import { suite, test } from "node:test"

import { startsWithNpmRun } from "./starts-with-npm-run.js"

suite("startsWithNpmRun", () => {
  const tests = {
    "npm run test": true
  }
  for (const [give, want] of Object.entries(tests)) {
    test(`${give} --> ${want}`, () => {
      assert.equal(want, startsWithNpmRun(give))
    })
  }
})
