import { assert } from "chai"
import { suite, test } from "node:test"

import { trimAllLineEnds } from "./trim-all-line-ends.js"

suite("trimAllLineEnds", () => {
  const tests = {
    hello: "hello",
    "one \n  two ": "one\n  two"
  }
  for (const [give, want] of Object.entries(tests)) {
    test(`${give} --> ${want}`, () => {
      assert.equal(trimAllLineEnds(give), want)
    })
  }
})
