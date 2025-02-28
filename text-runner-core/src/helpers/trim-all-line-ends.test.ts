import { suite, test } from "node:test"

import { assert } from "chai"

import { trimAllLineEnds } from "./trim-all-line-ends.js"

suite("trimAllLineEnds", function () {
  const tests = {
    hello: "hello",
    "one \n  two ": "one\n  two",
  }
  for (const [give, want] of Object.entries(tests)) {
    test(`${give} --> ${want}`, function () {
      assert.equal(trimAllLineEnds(give), want)
    })
  }
})
