import { assert } from "chai"
import { suite, test } from "node:test"

import { removeTrailingColon } from "./remove-trailing-colon.js"

suite("removeTrailingColon", () => {
  const tests = {
    foo: "foo",
    "foo:": "foo"
  }
  for (const [give, want] of Object.entries(tests)) {
    test(`${give} ==> ${want}`, () => {
      assert.equal(removeTrailingColon(give), want)
    })
  }
})
