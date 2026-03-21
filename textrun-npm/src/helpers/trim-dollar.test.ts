import { suite, test } from "node:test"
import { assert } from "chai"

import { trimDollar } from "./trim-dollar.js"

suite("trimDollar", () => {
  const tests = {
    "$   foo": "foo",
    "$ foo": "foo",
    foo: "foo"
  }
  for (const [give, want] of Object.entries(tests)) {
    test(`${give} --> ${want}`, () => {
      assert.equal(want, trimDollar(give))
    })
  }
})
